/*
 * 局域网共享网页的全部逻辑。
 *
 * 一个 IIFE，没有框架与构建步骤：静态件随 APK 走，局域网里的浏览器多半连不上外网。
 *
 * 约定：
 *  - 所有请求走 api()，统一处理 401（显示口令页）、错误提示与顶栏的忙碌条；
 *  - 状态在 S 里，改完调 render()；
 *  - 图标走 icon()，指向页面内联的精灵；
 *  - 浮层（对话框、预览、菜单）走同一个栈，Esc 与遮罩只关最上面一层。
 *  - 文案里不用「·」分隔，几段信息用各自的元素与间距排开。
 */
(function () {
  "use strict";

  var BOOT = (function () {
    var node = document.getElementById("lan-boot");
    if (!node) return {};
    try {
      return JSON.parse(node.textContent) || {};
    } catch (error) {
      return {};
    }
  })();

  /* ================================================================ 状态 */

  var S = {
    path: "/",
    entries: [],
    parent: null,
    truncated: false,
    sort: "name",
    desc: false,
    view: "list",
    query: "",
    deep: false,
    selection: new Set(),
    pane: "files",
    caps: BOOT.caps || {},
    shares: BOOT.shares || [],
    authorized: !!BOOT.authorized,
    needsPin: !!BOOT.needsPin,
    generation: BOOT.generation || 0,
    device: BOOT.device || "共享",
    session: "",
    /* 这个浏览器自己发起的传输。手机那一侧看的是「谁在传什么」，这里只有「我在传什么」。 */
    jobs: [],
    loading: false,
    messages: [],
    seenMessages: 0,
  };

  var SORT_LABELS = { name: "名称", size: "大小", time: "修改时间" };
  var THEMES = ["auto", "light", "dark"];
  var THEME_LABELS = { auto: "跟随系统", light: "浅色", dark: "深色" };

  var $ = function (id) {
    return document.getElementById(id);
  };

  /* ================================================================ 小工具 */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(name, extra) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", extra ? "i " + extra : "i");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function setIcon(button, name) {
    var use = button && button.querySelector("use");
    if (use) use.setAttribute("href", "#i-" + name);
  }

  function iconButton(iconName, label, className, handler) {
    var button = el("button", (className || "icon-btn") + " hover");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.appendChild(icon(iconName));
    if (handler) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        handler(event);
      });
    }
    return button;
  }

  function textButton(label, className, iconName, handler) {
    var button = el("button", className + " hover");
    button.type = "button";
    if (iconName) button.appendChild(icon(iconName));
    button.appendChild(el("span", null, label));
    if (handler) button.addEventListener("click", handler);
    return button;
  }

  var KIND_ICONS = {
    folder: "folder",
    image: "image",
    video: "movie",
    audio: "music_note",
    text: "description",
    pdf: "picture_as_pdf",
    archive: "folder_zip",
    code: "code",
    font: "text_snippet",
    other: "draft",
  };

  function kindIcon(entry) {
    return entry.dir ? "folder" : KIND_ICONS[entry.kind] || "draft";
  }

  var UNITS = ["B", "KB", "MB", "GB", "TB"];

  function fmtBytes(bytes) {
    if (bytes == null || bytes < 0) return "—";
    var value = bytes;
    var unit = 0;
    while (value >= 1024 && unit < UNITS.length - 1) {
      value /= 1024;
      unit += 1;
    }
    if (unit === 0) return bytes + " B";
    return (value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)) + " " + UNITS[unit];
  }

  function fmtRate(bytesPerSecond) {
    return bytesPerSecond > 0 ? fmtBytes(bytesPerSecond) + "/s" : "0 B/s";
  }

  /* 今天的只给时刻，今年的给月日，更早的才带年份。 */
  function fmtTime(millis) {
    if (!millis) return "";
    var date = new Date(millis);
    var now = new Date();
    var pad = function (n) {
      return n < 10 ? "0" + n : String(n);
    };
    var clock = pad(date.getHours()) + ":" + pad(date.getMinutes());
    if (date.toDateString() === now.toDateString()) return "今天 " + clock;
    var monthDay = date.getMonth() + 1 + "月" + date.getDate() + "日";
    if (date.getFullYear() === now.getFullYear()) return monthDay + " " + clock;
    return date.getFullYear() + "年" + monthDay;
  }

  function enc(value) {
    return encodeURIComponent(value);
  }

  function fileUrl(path, download) {
    return "/api/file?p=" + enc(path) + (download ? "&dl=1" : "");
  }

  function thumbUrl(path, size) {
    return "/api/thumb?p=" + enc(path) + "&s=" + (size || 256);
  }

  function parentOf(path) {
    var parts = path.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }

  function baseName(path) {
    return path.split("/").filter(Boolean).pop() || "";
  }

  function isNarrow() {
    return window.matchMedia("(max-width: 899px)").matches;
  }

  /* ================================================================ 请求 */

  var busyCount = 0;

  function busy(on) {
    busyCount = Math.max(0, busyCount + (on ? 1 : -1));
    $("busy").hidden = busyCount === 0;
  }

  function api(url, options) {
    options = options || {};
    busy(true);
    return fetch(url, {
      method: options.method || "GET",
      headers: options.json ? { "Content-Type": "application/json" } : options.headers || undefined,
      body: options.json ? JSON.stringify(options.json) : options.body,
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(function (response) {
        if (response.status === 401) {
          S.authorized = false;
          showGate();
          throw new Error("需要访问口令");
        }
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            if (!response.ok) throw new Error(data.error || "请求失败");
            return data;
          });
      })
      .finally(function () {
        busy(false);
      });
  }

  /* ================================================================ 浮层栈 */

  var stack = [];

  /**
   * 打开一层浮层。返回关闭函数。Esc 与遮罩点击只关最上面那一层；关掉时把焦点还给打开前的元素。
   */
  function overlay(node, options) {
    options = options || {};
    var scrim = null;
    if (!options.noScrim) {
      /* 逐层抬高：从预览里再开一个对话框时，它必须压在预览之上。 */
      var depth = stack.length;
      scrim = el("div", "scrim");
      scrim.style.zIndex = String(52 + depth * 2);
      node.style.zIndex = String(53 + depth * 2);
      scrim.addEventListener("click", function () {
        if (stack.length && stack[stack.length - 1].node === node) close();
      });
      node.parentNode.insertBefore(scrim, node);
    }
    var layer = { node: node, scrim: scrim, onClose: options.onClose, returnFocus: document.activeElement };
    stack.push(layer);
    node.hidden = false;
    if (options.focus) {
      setTimeout(function () {
        options.focus.focus();
        if (options.focus.select) options.focus.select();
      }, 30);
    }

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      var index = stack.indexOf(layer);
      if (index >= 0) stack.splice(index, 1);
      node.hidden = true;
      if (scrim) scrim.remove();
      if (layer.onClose) layer.onClose();
      if (layer.returnFocus && layer.returnFocus.focus) {
        try {
          layer.returnFocus.focus({ preventScroll: true });
        } catch (error) {
          /* 焦点源已经不在文档里了。 */
        }
      }
    }
    layer.close = close;
    return close;
  }

  function closeTop() {
    if (stack.length) stack[stack.length - 1].close();
  }

  function dialog(id, options) {
    return overlay($(id), options);
  }

  /* ---------------------------------------------------------------- 弹出菜单 */

  var openMenuNode = null;

  function closeMenu() {
    if (openMenuNode) {
      openMenuNode.remove();
      openMenuNode = null;
    }
  }

  /** 锚定在按钮下方的菜单。项目：{ icon, label, hint, onClick }。 */
  function popupMenu(anchor, items) {
    closeMenu();
    var menu = el("div", "menu");
    menu.setAttribute("role", "menu");
    items.forEach(function (item) {
      var row = el("button", "menu-item hover");
      row.type = "button";
      row.setAttribute("role", "menuitem");
      row.appendChild(icon(item.icon, "sm"));
      row.appendChild(el("span", null, item.label));
      if (item.hint) row.appendChild(el("small", null, item.hint));
      row.addEventListener("click", function () {
        closeMenu();
        item.onClick();
      });
      menu.appendChild(row);
    });
    document.body.appendChild(menu);
    var rect = anchor.getBoundingClientRect();
    var width = menu.offsetWidth;
    var height = menu.offsetHeight;
    var left = Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12);
    var top = rect.bottom + 6;
    if (top + height > window.innerHeight - 12) top = Math.max(12, rect.top - height - 6);
    menu.style.left = left + "px";
    menu.style.top = top + "px";
    openMenuNode = menu;
    var first = menu.querySelector("button");
    if (first) first.focus({ preventScroll: true });
  }

  document.addEventListener(
    "pointerdown",
    function (event) {
      if (openMenuNode && !openMenuNode.contains(event.target)) closeMenu();
    },
    true
  );
  window.addEventListener("resize", closeMenu);

  /* ---------------------------------------------------------------- 提示条 */

  var snackQueue = [];
  var snackBusy = false;

  function snack(text) {
    if (!text) return;
    snackQueue.push(text);
    if (!snackBusy) nextSnack();
  }

  function nextSnack() {
    var text = snackQueue.shift();
    if (text == null) {
      snackBusy = false;
      return;
    }
    snackBusy = true;
    var node = el("div", "snack", text);
    $("snacks").appendChild(node);
    setTimeout(function () {
      node.classList.add("out");
      setTimeout(function () {
        node.remove();
        nextSnack();
      }, 180);
    }, Math.min(5200, 2400 + text.length * 40));
  }

  /* ================================================================ 载入与渲染 */

  function load(path, options) {
    options = options || {};
    S.path = path;
    S.selection.clear();
    var deep = S.deep && S.query;
    var url = deep
      ? "/api/search?p=" + enc(path) + "&q=" + enc(S.query)
      : "/api/list?p=" + enc(path) + "&sort=" + S.sort + (S.desc ? "&desc=1" : "") + (S.query ? "&q=" + enc(S.query) : "");

    S.loading = true;
    if (!options.silent) S.entries = [];
    render();
    return api(url)
      .then(function (data) {
        S.entries = data.entries || [];
        S.parent = data.parent;
        S.truncated = !!data.truncated;
        S.generation = data.generation || S.generation;
        S.authorized = true;
        S.loading = false;
        render();
        if (S.truncated) snack("结果较多，仅显示部分");
        if (!options.silent) $("body").scrollTop = 0;
      })
      .catch(function (error) {
        S.loading = false;
        S.entries = [];
        render();
        if (S.authorized) snack(error.message);
      });
  }

  function refresh() {
    return load(S.path, { silent: true });
  }

  function render() {
    renderTop();
    renderCrumbs();
    renderShares();
    renderSideShares();
    renderList();
    renderStates();
    renderSelection();
  }

  function renderTop() {
    var title = $("title");
    var subtitle = $("subtitle");
    subtitle.replaceChildren();
    if (S.pane === "transfers") {
      title.textContent = "传输";
      var running = S.jobs.filter(function (job) {
        return job.state === "run" || job.state === "wait";
      }).length;
      if (running) subtitle.appendChild(el("span", null, running + " 项进行中"));
      return;
    }
    if (S.pane === "messages") {
      title.textContent = "文本互传";
      if (S.messages.length) subtitle.appendChild(el("span", null, S.messages.length + " 条"));
      return;
    }
    var atRoot = S.path === "/" || !S.parent;
    $("btn-up").disabled = atRoot;
    title.textContent = atRoot ? S.device : baseName(S.path);
    if (S.loading) {
      subtitle.appendChild(el("span", null, "正在载入"));
    } else if (S.entries.length) {
      var folders = 0;
      var bytes = 0;
      S.entries.forEach(function (entry) {
        if (entry.dir) folders += 1;
        else bytes += entry.size;
      });
      var files = S.entries.length - folders;
      if (folders) subtitle.appendChild(el("span", null, folders + " 个文件夹"));
      if (files) subtitle.appendChild(el("span", null, files + " 个文件"));
      if (bytes) subtitle.appendChild(el("span", null, fmtBytes(bytes)));
    }
    setIcon($("btn-view"), S.view === "grid" ? "view_list" : "grid_view");
    $("btn-view").title = S.view === "grid" ? "列表视图" : "网格视图";
  }

  function renderCrumbs() {
    var host = $("crumbs");
    host.replaceChildren();
    var parts = S.path.split("/").filter(Boolean);

    var home = el("button", "crumb hover" + (parts.length ? "" : " here"));
    home.type = "button";
    home.appendChild(icon("home"));
    home.appendChild(el("span", null, "全部"));
    home.addEventListener("click", function () {
      if (parts.length) navigate("/");
    });
    host.appendChild(home);

    var walked = "";
    var last = null;
    parts.forEach(function (part, index) {
      walked += "/" + part;
      var target = walked;
      var separator = el("span", "crumb-sep");
      separator.appendChild(icon("chevron_right"));
      host.appendChild(separator);
      var isLast = index === parts.length - 1;
      var crumb = el("button", "crumb hover" + (isLast ? " here" : ""), part);
      crumb.type = "button";
      crumb.title = part;
      if (!isLast) {
        crumb.addEventListener("click", function () {
          navigate(target);
        });
      }
      host.appendChild(crumb);
      if (isLast) last = crumb;
    });
    if (last) host.scrollLeft = host.scrollWidth;
  }

  /* 根目录、无搜索词、多于一个共享时的共享目录卡片。只有一个共享时首屏直接进去。 */
  function renderShares() {
    var host = $("shares");
    host.replaceChildren();
    var show = S.pane === "files" && S.path === "/" && !S.query && S.shares.length > 1;
    host.hidden = !show;
    if (!show) return;
    S.shares.forEach(function (share) {
      var card = el("button", "share-card hover");
      card.type = "button";
      var mark = el("span", "share-mark");
      mark.appendChild(icon(share.readOnly ? "lock" : "folder"));
      card.appendChild(mark);
      var text = el("span", "share-text");
      text.appendChild(el("span", "share-name", share.name));
      var sub = el("span", "share-sub");
      if (share.freeBytes > 0) sub.appendChild(el("span", null, "可用 " + fmtBytes(share.freeBytes)));
      if (share.readOnly) sub.appendChild(el("span", "tag", "只读"));
      text.appendChild(sub);
      card.appendChild(text);
      card.appendChild(icon("chevron_right", "sm"));
      card.addEventListener("click", function () {
        navigate(share.path);
      });
      host.appendChild(card);
    });
  }

  function renderSideShares() {
    var host = $("side-shares");
    host.replaceChildren();
    $("side-shares-label").hidden = !S.shares.length;
    S.shares.forEach(function (share) {
      var inside = S.path === share.path || S.path.indexOf(share.path + "/") === 0;
      var item = el("button", "side-share hover" + (inside && S.pane === "files" ? " on" : ""));
      item.type = "button";
      item.title = share.name;
      item.appendChild(icon(share.readOnly ? "lock" : "folder", "sm"));
      item.appendChild(el("span", null, share.name));
      item.addEventListener("click", function () {
        setPane("files");
        navigate(share.path);
      });
      host.appendChild(item);
    });
  }

  function renderList() {
    var host = $("list");
    host.className = "list" + (S.view === "grid" ? " grid" : "");
    host.replaceChildren();
    if (S.loading && !S.entries.length) {
      /* 骨架与真实行同高，内容到达时不跳动。 */
      for (var i = 0; i < 8; i += 1) {
        var skeleton = el("div", "skeleton");
        skeleton.appendChild(el("i"));
        var lines = el("div");
        lines.appendChild(el("b"));
        lines.appendChild(el("b"));
        skeleton.appendChild(lines);
        host.appendChild(skeleton);
      }
      return;
    }
    if (!S.entries.length) return;
    var fragment = document.createDocumentFragment();
    if (S.view !== "grid") {
      var head = el("div", "list-head");
      head.appendChild(el("span"));
      head.appendChild(el("span", null, "名称"));
      head.appendChild(el("span", null, "修改时间"));
      head.appendChild(el("span", null, "大小"));
      head.appendChild(el("span"));
      fragment.appendChild(head);
    }
    S.entries.forEach(function (entry) {
      fragment.appendChild(S.view === "grid" ? renderTile(entry) : renderRow(entry));
    });
    host.appendChild(fragment);
  }

  /** 文件图标或缩略图，叠一层勾选标记。 */
  function renderMark(entry, size) {
    var mark = el("span", "mark" + (entry.dir ? " dir" : " k-" + (entry.kind || "other")));
    mark.appendChild(icon(kindIcon(entry)));
    if (entry.thumb && S.caps.thumbnails !== false) {
      var image = el("img");
      image.alt = "";
      image.decoding = "async";
      image.dataset.src = thumbUrl(entry.path, size);
      image.addEventListener("load", function () {
        image.classList.add("in");
      });
      image.addEventListener("error", function () {
        image.remove();
      });
      mark.appendChild(image);
      observe(image);
    }
    var check = el("span", "check");
    check.appendChild(icon("check"));
    mark.appendChild(check);
    return mark;
  }

  /*
   * 行与卡片用 div[role=button]，不用 button：里面还有「更多」按钮，按钮套按钮是非法嵌套，
   * 浏览器会把内层按钮挤出去，布局随之错乱。
   */
  function bindItem(node, entry) {
    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.dataset.path = entry.path;
    node.addEventListener("click", function (event) {
      if (event.ctrlKey || event.metaKey || S.selection.size) {
        toggleSelect(entry);
        return;
      }
      openEntry(entry);
    });
    node.addEventListener("keydown", function (event) {
      if (event.target !== node) return;
      if (event.key === "Enter") openEntry(entry);
      else if (event.key === " ") {
        event.preventDefault();
        toggleSelect(entry);
      }
    });
    /* 鼠标右键打开详情；触屏上的长按留给多选，不弹系统菜单。 */
    node.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      if (window.matchMedia("(pointer: coarse)").matches) return;
      openDetails(entry);
    });
    bindLongPress(node, function () {
      toggleSelect(entry);
    });
  }

  function renderRow(entry) {
    var row = el("div", "row hover" + (S.selection.has(entry.path) ? " sel" : ""));
    row.appendChild(renderMark(entry, 128));

    var main = el("div", "row-main");
    main.appendChild(el("span", "row-name", entry.name));
    var meta = el("span", "row-meta");
    if (!entry.dir) meta.appendChild(el("span", null, fmtBytes(entry.size)));
    if (entry.time) meta.appendChild(el("span", null, fmtTime(entry.time)));
    main.appendChild(meta);
    row.appendChild(main);

    row.appendChild(el("span", "row-time", fmtTime(entry.time)));
    row.appendChild(el("span", "row-size", entry.dir ? "" : fmtBytes(entry.size)));
    row.appendChild(iconButton("more_vert", "更多", "icon-btn", function () {
      openDetails(entry);
    }));
    bindItem(row, entry);
    return row;
  }

  function renderTile(entry) {
    var tile = el("div", "tile hover" + (S.selection.has(entry.path) ? " sel" : ""));
    tile.appendChild(renderMark(entry, 320));
    tile.appendChild(el("span", "tile-name", entry.name));
    tile.appendChild(el("span", "tile-meta", entry.dir ? fmtTime(entry.time) : fmtBytes(entry.size)));
    tile.appendChild(iconButton("more_vert", "更多", "icon-btn sm tile-more", function () {
      openDetails(entry);
    }));
    bindItem(tile, entry);
    return tile;
  }

  /*
   * 缩略图懒加载。用 IntersectionObserver 自己控制提前量：一个相册目录一次把几十张都请求出去，
   * 会打满服务端的缩略图闸门。
   */
  var observer = null;

  function observe(image) {
    if (!("IntersectionObserver" in window)) {
      image.src = image.dataset.src;
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        function (records) {
          records.forEach(function (record) {
            if (!record.isIntersecting) return;
            observer.unobserve(record.target);
            record.target.src = record.target.dataset.src;
          });
        },
        { root: $("body"), rootMargin: "300px" }
      );
    }
    observer.observe(image);
  }

  function renderStates() {
    var empty = !S.loading && !S.entries.length;
    var showingShares = S.path === "/" && !S.query && S.shares.length > 1;
    var emptyState = $("state-empty");
    emptyState.hidden = !(empty && S.authorized && !showingShares);
    emptyState.querySelector("p").textContent = S.query ? "没有匹配的结果" : "此文件夹为空";
    $("state-locked").hidden = S.authorized;
  }

  function renderSelection() {
    var count = S.selection.size;
    $("selbar").hidden = count === 0;
    $("sel-count").textContent = "已选择 " + count + " 项";
  }

  /* ================================================================ 导航与选择 */

  /* 走 pushState：浏览器的返回键就是「上一级」。 */
  function navigate(path, replace) {
    var url = "/#" + enc(path);
    if (replace) history.replaceState({ path: path }, "", url);
    else history.pushState({ path: path }, "", url);
    load(path);
  }

  window.addEventListener("popstate", function (event) {
    /* 返回键先收起浮层，再回到上一级。 */
    closeMenu();
    while (stack.length) closeTop();
    load((event.state && event.state.path) || pathFromHash());
  });

  function pathFromHash() {
    var hash = location.hash.replace(/^#/, "");
    if (!hash) return "/";
    try {
      return decodeURIComponent(hash);
    } catch (error) {
      return "/";
    }
  }

  function toggleSelect(entry) {
    if (S.selection.has(entry.path)) S.selection.delete(entry.path);
    else S.selection.add(entry.path);
    renderList();
    renderSelection();
  }

  function toggleSelectAll() {
    if (S.selection.size === S.entries.length) S.selection.clear();
    else
      S.entries.forEach(function (entry) {
        S.selection.add(entry.path);
      });
    renderList();
    renderSelection();
  }

  function bindLongPress(node, handler) {
    var timer = 0;
    var startX = 0;
    var startY = 0;
    var cancel = function () {
      clearTimeout(timer);
    };
    node.addEventListener(
      "pointerdown",
      function (event) {
        if (event.pointerType === "mouse") return;
        cancel();
        startX = event.clientX;
        startY = event.clientY;
        timer = setTimeout(function () {
          /* 长按之后吃掉这一次 click，免得同时打开文件。 */
          node.addEventListener("click", swallow, { once: true, capture: true });
          if (navigator.vibrate) navigator.vibrate(12);
          handler();
        }, 480);
      },
      { passive: true }
    );
    node.addEventListener(
      "pointermove",
      function (event) {
        if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) cancel();
      },
      { passive: true }
    );
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (name) {
      node.addEventListener(name, cancel, { passive: true });
    });
  }

  function swallow(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  /* ================================================================ 打开与预览 */

  function openEntry(entry) {
    if (entry.dir) {
      navigate(entry.path);
      return;
    }
    if (canPreview(entry)) openViewer(entry);
    else startDownload(entry);
  }

  function canPreview(entry) {
    return ["image", "video", "audio", "text", "code", "pdf"].indexOf(entry.kind) >= 0 && !entry.dir;
  }

  function textEditable(entry) {
    return !!S.caps.upload && !!entry.writable;
  }

  var closeViewerLayer = null;
  var viewingEntry = null;
  var editingText = false;

  function galleryList() {
    return S.entries.filter(canPreview);
  }

  function stepViewer(delta) {
    if (!viewingEntry) return;
    var list = galleryList();
    if (list.length < 2) return;
    var index = -1;
    list.forEach(function (item, i) {
      if (item.path === viewingEntry.path) index = i;
    });
    if (index < 0) return;
    openViewer(list[(index + delta + list.length) % list.length]);
  }

  function openViewer(entry) {
    releaseMedia();
    var stage = $("viewer-stage");
    var actions = $("viewer-actions");
    stage.replaceChildren();
    actions.replaceChildren();
    viewingEntry = entry;
    editingText = false;
    $("viewer-name").textContent = entry.name;

    if (!closeViewerLayer) {
      closeViewerLayer = overlay($("viewer"), {
        noScrim: true,
        onClose: function () {
          closeViewerLayer = null;
          viewingEntry = null;
          editingText = false;
          releaseMedia();
          $("viewer-stage").replaceChildren();
        },
      });
    }

    var list = galleryList();
    var position = -1;
    list.forEach(function (item, i) {
      if (item.path === entry.path) position = i;
    });
    $("viewer-pos").textContent = list.length > 1 && position >= 0 ? position + 1 + " / " + list.length : fmtBytes(entry.size);
    $("viewer-prev").hidden = list.length < 2;
    $("viewer-next").hidden = list.length < 2;

    var url = fileUrl(entry.path, false);
    if (entry.kind === "image") {
      var image = el("img");
      image.src = url;
      image.alt = entry.name;
      stage.appendChild(image);
    } else if (entry.kind === "video") {
      var video = el("video");
      video.src = url;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      stage.appendChild(video);
    } else if (entry.kind === "audio") {
      var audio = el("audio");
      audio.src = url;
      audio.controls = true;
      audio.preload = "metadata";
      stage.appendChild(audio);
    } else if (entry.kind === "pdf") {
      var frame = el("iframe", "viewer-frame");
      frame.src = url;
      frame.title = entry.name;
      stage.appendChild(frame);
    } else {
      renderTextViewer(entry);
      if (textEditable(entry)) {
        actions.appendChild(iconButton("edit", "编辑", "icon-btn", function () {
          if (editingText) exitTextEdit(entry);
          else enterTextEdit(entry);
        }));
        var save = iconButton("save", "保存", "icon-btn", function () {
          saveTextEdit(entry);
        });
        save.id = "viewer-save";
        save.hidden = true;
        actions.appendChild(save);
      }
    }

    $("viewer-open").onclick = function () {
      window.open(url, "_blank", "noopener");
    };
    $("viewer-dl").onclick = function () {
      startDownload(entry);
    };
  }

  /** 文本只读视图：走 /api/text 取完整内容，截断与否由服务端说了算。 */
  function renderTextViewer(entry) {
    var stage = $("viewer-stage");
    stage.replaceChildren();
    var pre = el("pre", "viewer-text", "正在载入");
    stage.appendChild(pre);
    api("/api/text?p=" + enc(entry.path))
      .then(function (data) {
        if (viewingEntry !== entry || editingText) return;
        pre.textContent = data.text || "";
        if (data.truncated) snack("文件较大，仅显示开头部分");
      })
      .catch(function (error) {
        if (viewingEntry === entry) pre.textContent = error.message || "无法读取";
      });
  }

  function enterTextEdit(entry) {
    var stage = $("viewer-stage");
    editingText = true;
    var save = $("viewer-save");
    if (save) save.hidden = false;
    stage.replaceChildren();
    var wrap = el("div", "viewer-editor");
    var area = el("textarea");
    area.value = "";
    area.placeholder = "正在载入";
    area.spellcheck = false;
    area.disabled = true;
    wrap.appendChild(area);
    stage.appendChild(wrap);
    api("/api/text?p=" + enc(entry.path))
      .then(function (data) {
        if (!editingText || viewingEntry !== entry) return;
        if (data.truncated) {
          snack("文件较大，不支持在线编辑");
          exitTextEdit(entry);
          return;
        }
        area.value = data.text || "";
        area.disabled = false;
        area.focus();
      })
      .catch(function (error) {
        snack(error.message || "无法读取");
        exitTextEdit(entry);
      });
  }

  function exitTextEdit(entry) {
    editingText = false;
    var save = $("viewer-save");
    if (save) save.hidden = true;
    renderTextViewer(entry);
  }

  function saveTextEdit(entry) {
    if (!editingText || !entry) return;
    var area = $("viewer-stage").querySelector("textarea");
    if (!area || area.disabled) return;
    var save = $("viewer-save");
    if (save) save.disabled = true;
    api("/api/text?p=" + enc(entry.path), {
      method: "PUT",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: area.value,
    })
      .then(function (data) {
        if (save) save.disabled = false;
        snack("已保存，" + fmtBytes(data.size));
        exitTextEdit(entry);
        refresh();
      })
      .catch(function (error) {
        if (save) save.disabled = false;
        snack(error.message || "保存失败");
      });
  }

  /** 停掉正在解码的媒体：直接清空舞台会留下一个在后台继续播放的音频。 */
  function releaseMedia() {
    $("viewer-stage")
      .querySelectorAll("video, audio")
      .forEach(function (media) {
        media.pause();
        media.removeAttribute("src");
        media.load();
      });
  }

  /* 触屏上左右滑动切换。只在图片上生效，视频与文本要自己的手势。 */
  function wireSwipe() {
    var stage = $("viewer-stage");
    var startX = 0;
    var startY = 0;
    var tracking = false;
    stage.addEventListener(
      "touchstart",
      function (event) {
        tracking = event.touches.length === 1 && !!viewingEntry && viewingEntry.kind === "image";
        if (!tracking) return;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchend",
      function (event) {
        if (!tracking) return;
        tracking = false;
        var touch = event.changedTouches[0];
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepViewer(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  }

  /* ================================================================ 下载 */

  /* 用隐藏的 <a download> 交给浏览器的下载管理器；之后的进度 JS 拿不到。 */
  function startDownload(entry) {
    trigger(fileUrl(entry.path, true), entry.name);
    note(entry.name, "down");
  }

  function downloadZip(paths, label) {
    var names = paths.map(baseName);
    var url = "/api/zip?p=" + enc(S.path) + (names.length ? "&n=" + enc(names.join("\n")) : "");
    trigger(url, label);
    note(label, "down");
  }

  function trigger(url, name) {
    var anchor = el("a");
    anchor.href = url;
    anchor.download = name || "";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  /* ================================================================ 上传 */

  /*
   * 一个文件一个 PUT，串行：每个文件都有准确的长度与进度，一个失败不影响其余；手机的上行带宽
   * 是共享的，并发只会让几条进度一起变慢。
   */
  function uploadFiles(files, directory) {
    var list = Array.prototype.slice.call(files);
    if (!list.length) return;
    var limit = S.caps.maxUploadBytes || 0;
    var queue = list.filter(function (file) {
      if (limit > 0 && file.size > limit) {
        snack(file.name + " 超出单文件上限 " + fmtBytes(limit));
        return false;
      }
      return true;
    });
    if (!queue.length) return;

    var jobs = queue.map(function (file) {
      var job = {
        id: "u" + Date.now() + Math.random().toString(36).slice(2, 7),
        name: file.name,
        dir: "up",
        total: file.size,
        sent: 0,
        state: "wait",
        rate: 0,
      };
      S.jobs.unshift(job);
      return { job: job, file: file };
    });
    renderJobs();
    snack("已加入 " + jobs.length + " 个上传任务");

    var index = 0;
    var next = function () {
      if (index >= jobs.length) {
        refresh();
        return;
      }
      var current = jobs[index];
      index += 1;
      uploadOne(current.file, current.job, directory).then(next, next);
    };
    next();
  }

  function uploadOne(file, job, directory) {
    return new Promise(function (resolve) {
      var request = new XMLHttpRequest();
      var relative = file.webkitRelativePath || "";
      var target = relative ? directory + "/" + relative.split("/").slice(0, -1).join("/") : directory;
      var url = "/api/file?p=" + enc(target.replace(/\/+$/, "") || "/") + "&name=" + enc(file.name);
      request.open("PUT", url, true);
      request.withCredentials = true;
      job.state = "run";
      job.startedAt = Date.now();
      renderJobs();

      var lastPaint = 0;
      request.upload.onprogress = function (event) {
        job.sent = event.loaded;
        var seconds = (Date.now() - job.startedAt) / 1000;
        job.rate = seconds > 0.2 ? Math.round(event.loaded / seconds) : 0;
        /* 进度事件很密，限制到每 120ms 重绘一次。 */
        var now = Date.now();
        if (now - lastPaint > 120) {
          lastPaint = now;
          renderJobs();
        }
      };
      request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
          job.state = "done";
          job.sent = job.total;
        } else {
          job.state = "fail";
          job.error = errorOf(request);
        }
        job.abort = null;
        renderJobs();
        resolve();
      };
      request.onerror = function () {
        job.state = "fail";
        job.error = "连接中断";
        job.abort = null;
        renderJobs();
        resolve();
      };
      request.onabort = function () {
        job.state = "fail";
        job.error = "已取消";
        job.abort = null;
        renderJobs();
        resolve();
      };
      job.abort = function () {
        request.abort();
      };
      request.send(file);
    });
  }

  function errorOf(request) {
    try {
      return JSON.parse(request.responseText).error || "上传失败";
    } catch (error) {
      return request.status === 403 ? "不允许上传" : "上传失败";
    }
  }

  /* 「上传文件夹」带相对路径，服务端只往已存在的目录里写，所以目录先在这里逐级建出来。 */
  function ensureDirs(files, directory) {
    var needed = new Set();
    Array.prototype.forEach.call(files, function (file) {
      var relative = file.webkitRelativePath || "";
      if (!relative) return;
      var walked = directory;
      relative
        .split("/")
        .slice(0, -1)
        .forEach(function (part) {
          walked = walked.replace(/\/+$/, "") + "/" + part;
          needed.add(walked);
        });
    });
    var ordered = Array.from(needed).sort(function (a, b) {
      return a.length - b.length;
    });
    return ordered.reduce(function (chain, path) {
      return chain.then(function () {
        return api("/api/mkdir", { method: "POST", json: { path: parentOf(path), name: baseName(path) } }).catch(function () {
          /* 已存在即视为成功。 */
        });
      });
    }, Promise.resolve());
  }

  /* ================================================================ 传输面板 */

  function note(name, dir) {
    S.jobs.unshift({
      id: "d" + Date.now() + Math.random().toString(36).slice(2, 7),
      name: name,
      dir: dir,
      total: -1,
      sent: 0,
      state: "handed",
    });
    S.jobs = S.jobs.slice(0, 80);
    renderJobs();
  }

  function renderJobs() {
    var host = $("transfers");
    host.replaceChildren();
    $("state-xfers").hidden = S.jobs.length > 0;
    $("btn-xfer-clear").hidden = !S.jobs.some(function (job) {
      return job.state !== "run" && job.state !== "wait";
    });
    var running = 0;
    var fragment = document.createDocumentFragment();
    S.jobs.forEach(function (job) {
      if (job.state === "run" || job.state === "wait") running += 1;
      fragment.appendChild(renderJob(job));
    });
    host.appendChild(fragment);
    setCount("transfers", running);
    if (S.pane === "transfers") renderTop();
  }

  function renderJob(job) {
    var card = el("div", "xfer" + (job.state === "fail" ? " fail" : ""));
    var up = job.dir === "up";
    var mark = el("span", "mark " + (up ? "k-image" : "dir"));
    mark.appendChild(icon(up ? "cloud_upload" : "download"));
    card.appendChild(mark);
    card.appendChild(el("div", "xfer-name", job.name));

    var side = el("div", "xfer-side");
    if (job.state === "run" && job.abort) {
      side.appendChild(iconButton("close", "取消", "icon-btn", job.abort));
    } else if (job.state === "done") {
      side.appendChild(el("span", "tag primary", "已完成"));
    } else if (job.state === "fail") {
      side.appendChild(el("span", "tag error", "失败"));
    } else if (job.state === "handed") {
      side.appendChild(el("span", "tag", "下载"));
    } else {
      side.appendChild(el("span", "tag", "等待"));
    }
    card.appendChild(side);

    var meta = el("div", "xfer-meta");
    if (job.state === "run") {
      meta.appendChild(el("span", null, fmtBytes(job.sent) + " / " + fmtBytes(job.total)));
      meta.appendChild(el("span", null, fmtRate(job.rate)));
    } else if (job.state === "done") {
      meta.appendChild(el("span", null, fmtBytes(job.total)));
    } else if (job.state === "fail") {
      meta.appendChild(el("span", null, job.error || "失败"));
    } else if (job.state === "handed") {
      meta.appendChild(el("span", null, "已交由浏览器下载"));
    } else {
      meta.appendChild(el("span", null, fmtBytes(job.total)));
    }
    card.appendChild(meta);

    if (up && (job.state === "run" || job.state === "wait")) {
      var bar = el("div", "progress");
      var fill = el("span");
      bar.appendChild(fill);
      if (job.total > 0) bar.style.setProperty("--p", String(Math.min(1, job.sent / job.total)));
      else bar.classList.add("indeterminate");
      card.appendChild(bar);
    }
    return card;
  }

  function setCount(pane, count) {
    document.querySelectorAll('[data-count="' + pane + '"]').forEach(function (node) {
      node.textContent = count > 0 ? (count > 99 ? "99+" : String(count)) : "";
    });
  }

  /* ================================================================ 文本互传 */

  function loadMessages() {
    if (!S.caps.messages || !$("messages")) return Promise.resolve();
    return api("/api/messages")
      .then(function (data) {
        S.messages = data.messages || [];
        if (S.pane === "messages") S.seenMessages = S.messages.length;
        if (S.seenMessages > S.messages.length) S.seenMessages = S.messages.length;
        renderMessages();
      })
      .catch(function () {
        /* 功能关掉之后旧页面还会请求一次，静默即可。 */
      });
  }

  function renderMessages() {
    var host = $("messages");
    if (!host) return;
    var body = $("body");
    var nearBottom = body.scrollHeight - body.scrollTop - body.clientHeight < 120;
    host.replaceChildren();
    $("state-msgs").hidden = S.messages.length > 0;
    $("btn-msg-clear").hidden = S.messages.length === 0;
    S.messages.forEach(function (message) {
      /* fromDevice 为真是手机发出的；从浏览器看，「我」是那些不是手机发的。 */
      var bubble = el("div", "msg" + (message.fromDevice ? "" : " mine"));
      bubble.appendChild(el("div", "msg-text", message.text));
      var foot = el("div", "msg-foot");
      foot.appendChild(el("span", null, message.origin));
      foot.appendChild(el("span", null, fmtTime(message.atMillis)));
      foot.appendChild(iconButton("content_copy", "复制", "icon-btn sm", function () {
        copyText(message.text);
      }));
      bubble.appendChild(foot);
      host.appendChild(bubble);
    });
    setCount("messages", S.pane === "messages" ? 0 : S.messages.length - S.seenMessages);
    if (S.pane === "messages") {
      renderTop();
      if (nearBottom) body.scrollTop = body.scrollHeight;
    }
  }

  function sendMessage() {
    var input = $("msg-input");
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    autosize(input);
    api("/api/messages", { method: "POST", json: { text: text } })
      .then(function () {
        return loadMessages();
      })
      .then(function () {
        $("body").scrollTop = $("body").scrollHeight;
      })
      .catch(function (error) {
        input.value = text;
        autosize(input);
        snack(error.message);
      });
  }

  function autosize(area) {
    area.style.height = "auto";
    area.style.height = Math.min(area.scrollHeight, 160) + "px";
  }

  /*
   * 复制。navigator.clipboard 需要安全上下文，而这台服务只有 http，所以多数情况下退回
   * execCommand('copy')：它已被标记为废弃，但在非安全上下文里是唯一可用的办法。
   */
  function copyText(text) {
    var done = function () {
      snack("已复制");
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
      return;
    }
    fallback();

    function fallback() {
      var area = el("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.setAttribute("readonly", "readonly");
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      area.remove();
      if (ok) done();
      else snack("复制失败，请手动选择文本");
    }
  }

  /* ================================================================ 详情 */

  function openDetails(entry) {
    var body = $("details-body");
    body.replaceChildren();
    var card = el("div");
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "20px";

    var head = el("div", "detail-head");
    head.appendChild(renderMark(entry, 160));
    var titles = el("div");
    titles.style.minWidth = "0";
    titles.appendChild(el("h2", "detail-name", entry.name));
    var sub = el("div", "detail-sub");
    sub.appendChild(el("span", null, entry.dir ? "文件夹" : fmtBytes(entry.size)));
    if (entry.time) sub.appendChild(el("span", null, fmtTime(entry.time)));
    titles.appendChild(sub);
    head.appendChild(titles);
    card.appendChild(head);

    var close = null;
    var acts = el("div", "actions-grid");
    var add = function (label, iconName, className, handler) {
      acts.appendChild(textButton(label, "btn " + className, iconName, function () {
        close();
        handler();
      }));
    };
    if (!entry.dir) {
      add("下载", "download", "filled", function () {
        startDownload(entry);
      });
      if (canPreview(entry)) {
        add("预览", "visibility", "tonal", function () {
          openViewer(entry);
        });
      }
      add("分享链接", "share", "tonal", function () {
        askShareLink(entry);
      });
    } else {
      add("打开", "folder_open", "filled", function () {
        navigate(entry.path);
      });
      if (S.caps.zip) {
        add("打包下载", "folder_zip", "tonal", function () {
          downloadZip([entry.path], entry.name + ".zip");
        });
      }
    }
    if (S.caps.rename && entry.writable) {
      add("重命名", "edit", "outlined", function () {
        askName("重命名", entry.name, function (name) {
          return api("/api/rename", { method: "POST", json: { path: entry.path, name: name } });
        });
      });
    }
    if (S.caps.delete && entry.deletable) {
      add("删除", "delete", "danger-text", function () {
        confirmDelete([entry.path], entry.name);
      });
    }
    card.appendChild(acts);

    var rows = el("div", "info");
    infoRow(rows, "位置", entry.path, true);
    infoRow(rows, "修改时间", fmtTime(entry.time) || "—");
    if (!entry.dir) infoRow(rows, "大小", entry.size.toLocaleString() + " 字节");
    infoRow(rows, "类型", entry.mime || (entry.dir ? "文件夹" : "—"));
    if (!entry.dir) {
      var link = location.origin + fileUrl(entry.path, true);
      infoRow(rows, "下载地址", link, true, function () {
        copyText(link);
      });
    }
    card.appendChild(rows);

    var actions = el("div", "dialog-actions");
    actions.appendChild(textButton("关闭", "btn text", null, function () {
      close();
    }));
    card.appendChild(actions);

    body.appendChild(card);
    close = dialog("dlg-details");
  }

  function infoRow(host, key, value, mono, onCopy) {
    var row = el("div", "info-row");
    row.appendChild(el("div", "info-key", key));
    row.appendChild(el("div", "info-val" + (mono ? " mono" : ""), value));
    if (onCopy) row.appendChild(iconButton("content_copy", "复制", "icon-btn sm", onCopy));
    host.appendChild(row);
  }

  /** 直链：三档有效期，选定即生成并复制。 */
  function askShareLink(entry) {
    var host = $("link-options");
    host.replaceChildren();
    var close = dialog("dlg-link");
    [
      ["1 小时", 3600],
      ["1 天", 86400],
      ["7 天", 604800],
    ].forEach(function (item) {
      var option = el("button", "option hover");
      option.type = "button";
      option.appendChild(icon("schedule", "sm"));
      option.appendChild(el("span", null, "有效期 " + item[0]));
      option.addEventListener("click", function () {
        api("/api/share", { method: "POST", json: { path: entry.path, ttlSeconds: item[1] } })
          .then(function (data) {
            close();
            copyText(location.origin + data.url);
            snack("链接已复制，有效期至 " + fmtTime(data.expiresAtMillis));
          })
          .catch(function (error) {
            snack(error.message);
          });
      });
      host.appendChild(option);
    });
    $("link-cancel").onclick = function () {
      close();
    };
  }

  /* ================================================================ 对话框流程 */

  function showGate() {
    var gate = $("gate");
    if (!gate) return;
    gate.hidden = false;
    $("pin-error").textContent = "";
    var input = $("pin-input");
    input.value = "";
    setTimeout(function () {
      input.focus();
    }, 50);
  }

  function submitPin() {
    var input = $("pin-input");
    var button = $("pin-ok");
    if (!input.value) {
      $("pin-error").textContent = "请输入口令";
      return;
    }
    button.disabled = true;
    api("/api/login", { method: "POST", json: { pin: input.value } })
      .then(function () {
        button.disabled = false;
        $("gate").hidden = true;
        S.authorized = true;
        return boot();
      })
      .catch(function (error) {
        button.disabled = false;
        $("pin-error").textContent = error.message === "需要访问口令" ? "口令错误" : error.message;
        input.select();
      });
  }

  function askName(title, initial, commit) {
    var input = $("name-input");
    var hint = $("name-error");
    $("name-title").textContent = title;
    input.value = initial || "";
    hint.textContent = "";
    var close = dialog("dlg-name", { focus: input });
    var submit = function () {
      var value = input.value.trim();
      if (!value) {
        hint.textContent = "名称不能为空";
        return;
      }
      commit(value)
        .then(function () {
          close();
          refresh();
        })
        .catch(function (error) {
          hint.textContent = error.message;
        });
    };
    $("name-ok").onclick = submit;
    $("name-cancel").onclick = function () {
      close();
    };
    input.onkeydown = function (event) {
      if (event.key === "Enter" && !event.isComposing) submit();
    };
  }

  function confirmAction(title, text, okLabel, run) {
    $("confirm-title").textContent = title;
    $("confirm-text").textContent = text;
    $("confirm-ok").querySelector("span").textContent = okLabel;
    var close = dialog("dlg-confirm", { focus: $("confirm-cancel") });
    $("confirm-cancel").onclick = function () {
      close();
    };
    $("confirm-ok").onclick = function () {
      close();
      run();
    };
  }

  function confirmDelete(paths, label) {
    confirmAction(
      "删除",
      paths.length > 1 ? "确定删除选中的 " + paths.length + " 项？此操作无法撤销。" : "确定删除「" + label + "」？此操作无法撤销。",
      "删除",
      function () {
        api("/api/delete", { method: "POST", json: { paths: paths } })
          .then(function (data) {
            S.selection.clear();
            snack(data.message || "已删除");
            refresh();
          })
          .catch(function (error) {
            snack(error.message);
          });
      }
    );
  }

  function openSort() {
    var close = dialog("dlg-sort");
    var sync = function () {
      document.querySelectorAll("#dlg-sort .option").forEach(function (option) {
        option.classList.toggle("on", option.dataset.sort === S.sort);
      });
      $("sort-desc").checked = S.desc;
    };
    document.querySelectorAll("#dlg-sort .option").forEach(function (option) {
      option.onclick = function () {
        S.sort = option.dataset.sort;
        savePref("lan-sort", S.sort);
        sync();
        refresh();
      };
    });
    $("sort-desc").onchange = function (event) {
      S.desc = event.target.checked;
      savePref("lan-desc", S.desc ? "1" : "0");
      refresh();
    };
    $("sort-close").onclick = function () {
      close();
    };
    sync();
  }

  function openInfo() {
    var rows = $("info-rows");
    rows.replaceChildren();
    infoRow(rows, "设备", S.device);
    infoRow(rows, "访问地址", location.origin, true, function () {
      copyText(location.origin);
    });
    infoRow(rows, "共享目录", S.shares.length + " 个");
    if (S.session) infoRow(rows, "会话", S.session, true);
    var caps = [
      S.caps.upload ? "上传" : null,
      S.caps.mkdir ? "新建文件夹" : null,
      S.caps.rename ? "重命名" : null,
      S.caps.delete ? "删除" : null,
      S.caps.zip ? "打包下载" : null,
    ].filter(Boolean);
    infoRow(rows, "允许操作", caps.length ? caps.join("、") : "仅浏览与下载");
    if (S.caps.maxUploadBytes > 0) infoRow(rows, "单文件上限", fmtBytes(S.caps.maxUploadBytes));
    var close = dialog("dlg-info");
    $("info-close").onclick = function () {
      close();
    };
    var logoutButton = $("info-logout");
    if (logoutButton) {
      logoutButton.onclick = function () {
        close();
        logout();
      };
    }
  }

  function logout() {
    api("/api/logout", { method: "POST" }).finally(function () {
      location.reload();
    });
  }

  function openMore(anchor) {
    var items = [];
    if (S.pane === "files" && isNarrow()) {
      items.push({
        icon: S.view === "grid" ? "view_list" : "grid_view",
        label: S.view === "grid" ? "列表视图" : "网格视图",
        onClick: toggleView,
      });
      items.push({ icon: "sort", label: "排序方式", hint: SORT_LABELS[S.sort], onClick: openSort });
    }
    if (S.pane === "files" && S.authorized) {
      items.push({ icon: "refresh", label: "刷新", onClick: refresh });
    }
    if (S.pane === "files" && S.caps.zip && S.entries.length && S.path !== "/") {
      items.push({
        icon: "folder_zip",
        label: "打包下载此文件夹",
        onClick: function () {
          downloadZip([], (baseName(S.path) || "共享") + ".zip");
        },
      });
    }
    items.push({ icon: themeIcon(), label: "外观", hint: THEME_LABELS[currentTheme()], onClick: cycleTheme });
    items.push({ icon: "info", label: "连接信息", onClick: openInfo });
    if (S.needsPin && S.authorized) items.push({ icon: "logout", label: "退出登录", onClick: logout });
    popupMenu(anchor, items);
  }

  /* ================================================================ 面板与外观 */

  function setPane(name) {
    if (name === "messages" && !$("pane-messages")) name = "files";
    S.pane = name;
    document.querySelectorAll(".pane").forEach(function (pane) {
      pane.hidden = pane.dataset.pane !== name;
    });
    document.querySelectorAll(".nav-item, .tab-item").forEach(function (item) {
      var on = item.dataset.pane === name;
      item.classList.toggle("on", on);
      if (on) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    var files = name === "files";
    document.querySelectorAll(".files-only").forEach(function (node) {
      node.hidden = !files;
    });
    if (!files) {
      $("search-row").hidden = true;
      if (S.selection.size) {
        S.selection.clear();
        renderSelection();
      }
    }
    var fab = $("fab-wrap");
    if (fab) fab.hidden = !files || !S.authorized;
    $("body").scrollTop = 0;
    renderTop();
    renderSideShares();
    if (name === "messages") {
      S.seenMessages = S.messages.length;
      setCount("messages", 0);
      loadMessages();
      setTimeout(function () {
        $("body").scrollTop = $("body").scrollHeight;
      }, 0);
    }
  }

  function toggleView() {
    S.view = S.view === "grid" ? "list" : "grid";
    savePref("lan-view", S.view);
    renderTop();
    renderList();
  }

  function savePref(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* 隐私模式下 localStorage 会抛，偏好记不住但页面照常。 */
    }
  }

  function readPref(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  /* 外观三档：跟随系统、浅色、深色。默认跟随：看这张页面的是另一台设备，它自己的明暗设置才对。 */
  function currentTheme() {
    var theme = readPref("lan-theme", "auto");
    return THEMES.indexOf(theme) >= 0 ? theme : "auto";
  }

  function themeIcon() {
    var theme = currentTheme();
    if (theme === "auto") return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark_mode" : "light_mode";
    return theme === "dark" ? "dark_mode" : "light_mode";
  }

  function applyTheme(theme) {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    savePref("lan-theme", theme);
    var button = $("btn-side-theme");
    if (button) {
      setIcon(button, themeIcon());
      button.title = "外观：" + THEME_LABELS[theme];
    }
  }

  function cycleTheme() {
    var next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    applyTheme(next);
    snack("外观：" + THEME_LABELS[next]);
  }

  /* ================================================================ 实时事件 */

  var sseStarted = false;

  /* EventSource 自带重连与退避。tree：目录树变了；messages：文本板变了；state：配置变了。 */
  function connect() {
    if (!("EventSource" in window)) return;
    var source = new EventSource("/api/events");
    source.addEventListener("tree", function (event) {
      var generation = Number(event.data || 0);
      if (generation > S.generation) {
        S.generation = generation;
        if (S.pane === "files" && !S.loading) refresh();
      }
    });
    source.addEventListener("messages", function () {
      loadMessages();
    });
    source.addEventListener("state", function () {
      loadState().then(render);
    });
  }

  function loadState() {
    return api("/api/state").then(function (data) {
      S.shares = data.shares || [];
      S.caps = data.caps || S.caps;
      S.authorized = !!data.authorized;
      S.needsPin = !!data.needsPin;
      S.session = data.session || "";
      S.device = data.device || S.device;
      S.generation = data.generation || S.generation;
      $("side-device").textContent = S.device;
    });
  }

  /* ================================================================ 键盘与粘贴 */

  function isTyping(event) {
    var target = event.target;
    if (!target) return false;
    var tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable === true;
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      if (openMenuNode) {
        closeMenu();
        return;
      }
      if (stack.length) {
        event.preventDefault();
        closeTop();
        return;
      }
      if (S.selection.size) {
        S.selection.clear();
        renderList();
        renderSelection();
      }
      return;
    }
    if (closeViewerLayer && stack[stack.length - 1] && stack[stack.length - 1].node === $("viewer")) {
      if ((event.ctrlKey || event.metaKey) && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        saveTextEdit(viewingEntry);
        return;
      }
      if (isTyping(event)) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepViewer(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepViewer(1);
      }
      return;
    }
    if (stack.length || isTyping(event)) return;

    if ((event.ctrlKey || event.metaKey) && (event.key === "a" || event.key === "A")) {
      if (S.pane !== "files" || !S.authorized || !S.entries.length) return;
      event.preventDefault();
      toggleSelectAll();
    } else if (event.key === "Delete" && S.pane === "files" && S.selection.size && S.caps.delete) {
      confirmDelete(Array.from(S.selection), "");
    } else if (event.key === "/" && S.pane === "files") {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Backspace" && S.pane === "files" && S.parent && S.path !== "/") {
      navigate(S.parent);
    }
  }

  /* 截图后直接粘贴上传。剪贴板里没有文件时放行，不截胡文本粘贴。 */
  function onPaste(event) {
    if (!S.caps.upload || S.pane !== "files" || stack.length) return;
    var files = event.clipboardData && event.clipboardData.files;
    if (!files || !files.length) return;
    event.preventDefault();
    uploadFiles(files, S.path);
  }

  function openSearch() {
    var row = $("search-row");
    row.hidden = false;
    $("q").focus();
  }

  function closeSearch() {
    $("search-row").hidden = true;
    if (S.query) {
      S.query = "";
      $("q").value = "";
      refresh();
    }
  }

  /* ================================================================ 事件绑定 */

  function wire() {
    $("btn-up").addEventListener("click", function () {
      if (S.parent) navigate(S.parent);
    });

    $("btn-search").addEventListener("click", function () {
      if ($("search-row").hidden) openSearch();
      else closeSearch();
    });

    /* 输入防抖：SAF 上每次请求都是一次目录列举。 */
    var timer = 0;
    $("q").addEventListener("input", function (event) {
      S.query = event.target.value;
      clearTimeout(timer);
      timer = setTimeout(refresh, 280);
    });
    $("q").addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeSearch();
      }
    });
    $("btn-q-clear").addEventListener("click", function () {
      if (!S.query) {
        closeSearch();
        return;
      }
      S.query = "";
      $("q").value = "";
      $("q").focus();
      refresh();
    });
    $("btn-deep").addEventListener("click", function () {
      S.deep = !S.deep;
      $("btn-deep").setAttribute("aria-pressed", String(S.deep));
      $("btn-deep").classList.toggle("on", S.deep);
      if (S.query) refresh();
    });

    $("btn-view").addEventListener("click", toggleView);
    $("btn-sort").addEventListener("click", openSort);
    $("btn-more").addEventListener("click", function (event) {
      event.stopPropagation();
      if (openMenuNode) closeMenu();
      else openMore($("btn-more"));
    });

    var sideTheme = $("btn-side-theme");
    if (sideTheme) sideTheme.addEventListener("click", cycleTheme);
    $("btn-side-info").addEventListener("click", openInfo);
    var sideLogout = $("btn-side-logout");
    if (sideLogout) sideLogout.addEventListener("click", logout);

    $("btn-sel-clear").addEventListener("click", function () {
      S.selection.clear();
      renderList();
      renderSelection();
    });
    $("btn-sel-all").addEventListener("click", toggleSelectAll);
    var selZip = $("btn-sel-zip");
    if (selZip) {
      selZip.addEventListener("click", function () {
        downloadZip(Array.from(S.selection), "选中的 " + S.selection.size + " 项.zip");
      });
    }
    var selDel = $("btn-sel-del");
    if (selDel) {
      selDel.addEventListener("click", function () {
        confirmDelete(Array.from(S.selection), "");
      });
    }

    document.querySelectorAll(".nav-item, .tab-item").forEach(function (item) {
      item.addEventListener("click", function () {
        setPane(item.dataset.pane);
      });
    });

    $("btn-xfer-clear").addEventListener("click", function () {
      S.jobs = S.jobs.filter(function (job) {
        return job.state === "run" || job.state === "wait";
      });
      renderJobs();
    });

    var msgInput = $("msg-input");
    if (msgInput) {
      $("msg-send").addEventListener("click", sendMessage);
      msgInput.addEventListener("input", function () {
        autosize(msgInput);
      });
      msgInput.addEventListener("keydown", function (event) {
        /* Enter 发送，Shift+Enter 换行；输入法组字时的 Enter 不算。 */
        if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
          event.preventDefault();
          sendMessage();
        }
      });
      $("btn-msg-clear").addEventListener("click", function () {
        confirmAction("清空文本", "确定清空全部互传内容？手机端也会同步清空。", "清空", function () {
          api("/api/messages/clear", { method: "POST" })
            .then(loadMessages)
            .catch(function (error) {
              snack(error.message);
            });
        });
      });
    }

    var pinOk = $("pin-ok");
    if (pinOk) {
      pinOk.addEventListener("click", submitPin);
      $("pin-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") submitPin();
      });
      $("pin-input").addEventListener("input", function () {
        $("pin-error").textContent = "";
      });
    }

    $("viewer-close").addEventListener("click", function () {
      if (closeViewerLayer) closeViewerLayer();
    });
    $("viewer-prev").addEventListener("click", function () {
      stepViewer(-1);
    });
    $("viewer-next").addEventListener("click", function () {
      stepViewer(1);
    });
    wireSwipe();

    wireFab();
    wireDrop();
    window.addEventListener("paste", onPaste);
    document.addEventListener("keydown", onKeyDown);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      applyTheme(currentTheme());
    });
  }

  function wireFab() {
    var wrap = $("fab-wrap");
    if (!wrap) return;
    var menu = $("fab-menu");
    var toggle = function (open) {
      wrap.classList.toggle("open", open);
      menu.hidden = !open;
      $("fab").setAttribute("aria-expanded", String(open));
    };
    $("fab").addEventListener("click", function (event) {
      event.stopPropagation();
      toggle(menu.hidden);
    });
    document.addEventListener(
      "click",
      function (event) {
        if (!wrap.contains(event.target)) toggle(false);
      },
      true
    );
    menu.querySelectorAll(".fab-item").forEach(function (item) {
      item.addEventListener("click", function () {
        toggle(false);
        var act = item.dataset.act;
        if (act === "upload-files") $("picker").click();
        else if (act === "upload-folder") $("picker-dir").click();
        else if (act === "mkdir") {
          askName("新建文件夹", "", function (name) {
            return api("/api/mkdir", { method: "POST", json: { path: S.path, name: name } });
          });
        }
      });
    });

    var picker = $("picker");
    if (picker) {
      picker.addEventListener("change", function () {
        uploadFiles(picker.files, S.path);
        picker.value = "";
      });
    }
    var pickerDir = $("picker-dir");
    if (pickerDir) {
      pickerDir.addEventListener("change", function () {
        var files = pickerDir.files;
        ensureDirs(files, S.path).then(function () {
          uploadFiles(files, S.path);
          pickerDir.value = "";
        });
      });
    }
  }

  /* 拖放上传。用计数器判断进出窗口：在子元素之间移动时 dragenter/dragleave 会成对触发。 */
  function wireDrop() {
    var overlayNode = $("drop");
    if (!overlayNode || !S.caps.upload) return;
    var depth = 0;
    window.addEventListener("dragenter", function (event) {
      if (!hasFiles(event) || !S.authorized) return;
      event.preventDefault();
      depth += 1;
      overlayNode.hidden = false;
    });
    window.addEventListener("dragover", function (event) {
      if (!hasFiles(event)) return;
      event.preventDefault();
    });
    window.addEventListener("dragleave", function () {
      depth -= 1;
      if (depth <= 0) {
        depth = 0;
        overlayNode.hidden = true;
      }
    });
    window.addEventListener("drop", function (event) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      overlayNode.hidden = true;
      if (!S.authorized) return;
      if (S.pane !== "files") setPane("files");
      uploadFiles(event.dataTransfer.files, S.path);
    });
  }

  function hasFiles(event) {
    var transfer = event.dataTransfer;
    if (!transfer) return false;
    return Array.prototype.indexOf.call(transfer.types || [], "Files") >= 0;
  }

  /* ================================================================ 启动 */

  /* 只有一个共享目录时直接进去，省掉一屏只有一张卡片的首页。 */
  function boot() {
    return loadState()
      .catch(function () {
        /* 未授权时 /api/state 也会成功；走到这里说明网络断了。 */
      })
      .then(function () {
        if (!S.authorized) {
          render();
          showGate();
          return;
        }
        var fab = $("fab-wrap");
        if (fab) fab.hidden = S.pane !== "files";
        var hash = pathFromHash();
        var target = hash !== "/" ? hash : S.shares.length === 1 ? S.shares[0].path : "/";
        navigate(target, true);
        loadMessages();
        renderJobs();
        /* 授权之后才连：PIN 模式下未授权的事件流会被服务端直接关闭。 */
        if (!sseStarted) {
          sseStarted = true;
          connect();
        }
      });
  }

  function start() {
    applyTheme(currentTheme());
    S.view = readPref("lan-view", "list") === "grid" ? "grid" : "list";
    S.sort = SORT_LABELS[readPref("lan-sort", "name")] ? readPref("lan-sort", "name") : "name";
    S.desc = readPref("lan-desc", "0") === "1";
    $("side-origin").textContent = location.host;
    wire();
    setPane("files");
    render();
    boot();

    /* 回到前台时重新同步：手机浏览器在后台会断开事件流，期间的变化不会补发。 */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible" || !S.authorized) return;
      loadState().then(function () {
        if (S.pane === "files") refresh();
        loadMessages();
      });
    });
  }

  start();
})();
