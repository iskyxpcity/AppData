'use strict';
// 在 afp.js 之后执行。wasm 由宿主经 provideNamedData 交进来（沙盒只允许编译这样拿到的字节），
// afp.js 读 WASM_BINARY 时换成那块缓冲区；用运行时初始化回调代替 afp.js 的 setInterval 轮询。
(function () {
  const g = globalThis;
  const NAMED = 'voyage-named-wasm';
  let runtime = null;

  /** 宿主先 provideNamedData(name, wasm) 再调它。 */
  g.voyageLoadWasm = function (name) {
    return android.consumeNamedDataAsArrayBuffer(name).then(function (buffer) {
      g.VOYAGE_WASM = new Uint8Array(buffer);
      g.WASM_BINARY = NAMED;
      const decode = g.b64decode;
      g.b64decode = function (data) { return data === NAMED ? g.VOYAGE_WASM : decode(data); };
      return g.instantiateRuntime().then(function () { return 'ready'; });
    });
  };

  g.instantiateRuntime = function () {
    if (runtime) return runtime;
    runtime = new Promise(function (resolve, reject) {
      const rt = AudioFingerprintRuntime();
      if (typeof rt.ExtractQueryFP === 'function') { resolve(rt); return; }
      rt.onRuntimeInitialized = function () { resolve(rt); };
      rt.onAbort = function (what) { runtime = null; reject(new Error('afp abort: ' + what)); };
    });
    return runtime;
  };

  /** 8 kHz 单声道 16 位小端 PCM → 网易云指纹（Base64）。样本按 ÷32768 换成浮点。 */
  function fingerprint(bytes) {
    const count = bytes.length >> 1;
    const samples = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      let v = bytes[2 * i] | (bytes[2 * i + 1] << 8);
      if (v >= 32768) v -= 65536;
      samples[i] = v / 32768;
    }
    return g.instantiateRuntime().then(function (rt) {
      const v = rt.ExtractQueryFP(samples.buffer);
      const out = new Uint8Array(v.size());
      for (let i = 0; i < out.length; i++) out[i] = v.get(i);
      if (typeof v.delete === 'function') v.delete();
      return g.voyageB64Encode(out);
    });
  }

  /** 宿主先 provideNamedData(name, pcm) 再调它。 */
  g.voyageFingerprintNamed = function (name) {
    return android.consumeNamedDataAsArrayBuffer(name).then(function (buffer) { return fingerprint(new Uint8Array(buffer)); });
  };
})();
