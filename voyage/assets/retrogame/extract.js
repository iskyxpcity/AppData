/*
 * 小霸王游戏的页面解析运行时，跑在系统 WebView（Chromium / Blink）里，见 retrogame/RetroDomEngine.kt。
 *
 * 解析交给浏览器自己的 HTML5 解析器：DOMParser 建出来的文档是惰性的，不执行脚本、不加载图片与样式，
 * 选择器与真实浏览器完全一致。需要页面脚本先跑一遍的站点（列表由 JS 渲染）走「渲染模式」，
 * 在真实加载的页面上调用 extract。
 *
 * 规则写法（字段的 rule）：
 *   div.item a            CSS 选择器，默认取文字
 *   img@data-src          CSS 末尾 @属性；@text、@ownText、@html、@bg（背景图地址）是保留名
 *   @href                 条目自身的属性
 *   //div[@id='x']/a/@href、xpath:...   XPath，结果可以是元素、属性或文本节点
 *   js:el.dataset.id      JavaScript 表达式，可用 el（当前条目）、doc（文档）、json（响应按 JSON 解析的结果）、base（页面地址）
 *
 * 字段描述：{ rule, attrs?: [按顺序尝试的属性], url?: 结果按页面地址补全, all?: 取全部, object?: {子字段}, hasClass?: 类名 }
 */
(function () {
  'use strict';
  if (window.__voyageRetro) return;

  function norm(value) {
    return value == null ? '' : String(value).replace(/\s+/g, ' ').trim();
  }

  function absolute(value, base) {
    var text = value == null ? '' : String(value).trim();
    if (!text || /^(javascript|data|about|blob):/i.test(text)) return '';
    try {
      return new URL(text, base).href;
    } catch (e) {
      return '';
    }
  }

  function parseRule(rule) {
    var text = (rule || '').trim();
    if (!text) return { kind: 'self', expr: '', attr: null };
    if (text.indexOf('js:') === 0) return { kind: 'js', expr: text.slice(3), attr: null };
    if (text.indexOf('xpath:') === 0) return { kind: 'xpath', expr: text.slice(6).trim(), attr: null };
    if (text.charAt(0) === '/' || text.charAt(0) === '(' || text.indexOf('./') === 0) {
      return { kind: 'xpath', expr: text, attr: null };
    }
    var match = text.match(/^(.*?)@([A-Za-z_][\w:.-]*)$/);
    if (match) {
      var css = match[1].trim();
      return { kind: css ? 'css' : 'self', expr: css, attr: match[2] };
    }
    return { kind: 'css', expr: text, attr: null };
  }

  function json(ctx) {
    if (ctx.jsonReady) return ctx.jsonValue;
    ctx.jsonReady = true;
    try {
      ctx.jsonValue = JSON.parse(ctx.text);
    } catch (e) {
      ctx.jsonValue = null;
    }
    return ctx.jsonValue;
  }

  function toList(value) {
    if (value == null) return [];
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [value];
    if (typeof value.length === 'number' && typeof value !== 'function' && !value.nodeType) {
      return Array.prototype.slice.call(value);
    }
    return [value];
  }

  function select(root, parsed, ctx) {
    switch (parsed.kind) {
      case 'self':
        return [root];
      case 'css':
        if (!root || typeof root.querySelectorAll !== 'function') return [];
        return Array.prototype.slice.call(root.querySelectorAll(parsed.expr));
      case 'xpath': {
        var owner = root && root.nodeType === 9 ? root : root && root.ownerDocument;
        if (!owner) return [];
        var result = owner.evaluate(parsed.expr, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var nodes = [];
        for (var i = 0; i < result.snapshotLength; i++) nodes.push(result.snapshotItem(i));
        return nodes;
      }
      case 'js': {
        var fn = new Function('el', 'doc', 'json', 'base', 'return (' + parsed.expr + ');');
        return toList(fn(root, ctx.doc, json(ctx), ctx.base));
      }
    }
    return [];
  }

  function read(node, attr, ctx, asUrl) {
    if (node == null) return '';
    var kind = typeof node;
    if (kind === 'string' || kind === 'number' || kind === 'boolean') {
      return asUrl ? absolute(node, ctx.base) : norm(node);
    }
    if (!node.nodeType) {
      // js: 规则取出来的普通对象：按属性名读，读不到就当没有。
      var own = attr && attr !== 'text' ? node[attr] : null;
      if (own == null) return '';
      return asUrl ? absolute(own, ctx.base) : norm(own);
    }
    if (node.nodeType === 2) return asUrl ? absolute(node.value, ctx.base) : norm(node.value);
    if (node.nodeType === 3 || node.nodeType === 4) return asUrl ? absolute(node.textContent, ctx.base) : norm(node.textContent);
    if (node.nodeType !== 1) return '';
    var value;
    switch (attr || 'text') {
      case 'text':
        value = node.textContent;
        break;
      case 'ownText':
        value = Array.prototype.filter.call(node.childNodes, function (child) {
          return child.nodeType === 3;
        }).map(function (child) {
          return child.textContent;
        }).join(' ');
        break;
      case 'html':
        return node.innerHTML;
      case 'bg': {
        var style = node.getAttribute('style') || '';
        var match = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
        value = match ? match[1] : '';
        break;
      }
      default:
        value = node.getAttribute(attr);
    }
    return asUrl ? absolute(value, ctx.base) : norm(value);
  }

  function field(root, spec, ctx) {
    var parsed = parseRule(spec.rule);
    var found;
    try {
      found = select(root, parsed, ctx);
    } catch (e) {
      throw new Error((spec.rule || '') + ' : ' + (e && e.message ? e.message : e));
    }
    if (spec.object) {
      var list = found.map(function (node) {
        return object(node, spec.object, ctx);
      });
      return spec.all ? list : (list.length ? list[0] : null);
    }
    if (spec.hasClass) {
      var first = found[0];
      return !!(first && first.classList && first.classList.contains(spec.hasClass));
    }
    var attrs = parsed.attr ? [parsed.attr] : (spec.attrs && spec.attrs.length ? spec.attrs : ['text']);
    var one = function (node) {
      for (var i = 0; i < attrs.length; i++) {
        var value = read(node, attrs[i], ctx, spec.url);
        if (value) return value;
      }
      return '';
    };
    if (spec.all) {
      return found.map(one).filter(function (value) {
        return value;
      });
    }
    for (var j = 0; j < found.length; j++) {
      var value = one(found[j]);
      if (value) return value;
    }
    return '';
  }

  function object(root, fields, ctx) {
    var out = {};
    Object.keys(fields).forEach(function (key) {
      out[key] = field(root, fields[key], ctx);
    });
    return out;
  }

  function run(doc, text, base, plan) {
    var ctx = { doc: doc, text: text, base: base, jsonReady: false, jsonValue: null };
    try {
      return { ok: true, data: object(doc, plan, ctx) };
    } catch (e) {
      return { ok: false, error: String(e && e.message ? e.message : e) };
    }
  }

  window.__voyageRetro = {
    /** 惰性解析一段 HTML（或 JSON 文本）并按计划取值。 */
    parse: function (text, base, plan) {
      var doc = new DOMParser().parseFromString(text, 'text/html');
      return run(doc, text, base, plan);
    },
    /** 在当前真实页面上取值：渲染模式用。 */
    extract: function (plan) {
      var text = document.documentElement ? document.documentElement.outerHTML : '';
      return run(document, text, location.href, plan);
    },
    /** 规则在当前页面上能选中几个：渲染模式据此判断列表是否已经出来。 */
    count: function (rule) {
      try {
        var ctx = { doc: document, text: '', base: location.href, jsonReady: false, jsonValue: null };
        return select(document, parseRule(rule), ctx).length;
      } catch (e) {
        return -1;
      }
    }
  };
})();
