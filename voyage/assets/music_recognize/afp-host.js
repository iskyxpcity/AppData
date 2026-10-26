'use strict';
// 安卓 JavaScriptSandbox 是裸 V8：没有 atob/btoa、计时器，console 也未必有。afp.js 只在几处用到它们。
(function () {
  const g = globalThis;
  if (typeof g.console === 'undefined') g.console = { log() {}, info() {}, warn() {}, error() {} };
  const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < 64; i++) lookup[table.charCodeAt(i)] = i;
  g.voyageB64Decode = function (s) {
    s = s.replace(/[^A-Za-z0-9+/]/g, '');
    const out = new Uint8Array((s.length * 3) >> 2);
    let o = 0;
    for (let i = 0; i < s.length; i += 4) {
      const a = lookup[s.charCodeAt(i)], b = lookup[s.charCodeAt(i + 1)];
      const c = i + 2 < s.length ? lookup[s.charCodeAt(i + 2)] : 0, d = i + 3 < s.length ? lookup[s.charCodeAt(i + 3)] : 0;
      const n = (a << 18) | (b << 12) | (c << 6) | d;
      if (o < out.length) out[o++] = (n >> 16) & 255;
      if (o < out.length) out[o++] = (n >> 8) & 255;
      if (o < out.length) out[o++] = n & 255;
    }
    return out;
  };
  g.voyageB64Encode = function (bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      s += table[(n >> 18) & 63] + table[(n >> 12) & 63] + (i + 1 < bytes.length ? table[(n >> 6) & 63] : '=') + (i + 2 < bytes.length ? table[n & 63] : '=');
    }
    return s;
  };
  if (typeof g.atob === 'undefined') g.atob = function (s) { let r = ''; const b = g.voyageB64Decode(s); for (let i = 0; i < b.length; i++) r += String.fromCharCode(b[i]); return r; };
  if (typeof g.btoa === 'undefined') g.btoa = function (s) { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return g.voyageB64Encode(b); };
  if (typeof g.setTimeout === 'undefined') g.setTimeout = function (f) { Promise.resolve().then(f); return 0; };
  if (typeof g.clearTimeout === 'undefined') g.clearTimeout = function () {};
})();
