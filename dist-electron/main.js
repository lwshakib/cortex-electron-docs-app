import { app as H, session as $t, ipcMain as G, BrowserWindow as Ve, shell as Ot } from "electron";
import Y from "node:path";
import { fileURLToPath as Ft } from "node:url";
import ze from "fs";
import Pt from "constants";
import Dt from "stream";
import kt from "util";
import In from "assert";
import _ from "path";
import { homedir as Nt } from "os";
import Ge from "fs/promises";
import { randomFillSync as xt, randomUUID as Tt } from "crypto";
const _n = {
  dev: !H.isPackaged
}, tn = {
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux"
}, It = {
  setAppUserModelId(e) {
    tn.isWindows && H.setAppUserModelId(_n.dev ? process.execPath : e);
  },
  setAutoLaunch(e) {
    if (tn.isLinux)
      return !1;
    const n = () => H.getLoginItemSettings().openAtLogin;
    return n() !== e ? (H.setLoginItemSettings({ openAtLogin: e }), n() === e) : !0;
  },
  skipProxy() {
    return $t.defaultSession.setProxy({ mode: "direct" });
  }
}, _t = {
  watchWindowShortcuts(e, n) {
    if (!e)
      return;
    const { webContents: t } = e, { escToCloseWindow: r = !1, zoom: i = !1 } = n || {};
    t.on("before-input-event", (o, c) => {
      c.type === "keyDown" && (_n.dev ? c.code === "F12" && (t.isDevToolsOpened() ? t.closeDevTools() : (t.openDevTools({ mode: "undocked" }), console.log("Open dev tool..."))) : (c.code === "KeyR" && (c.control || c.meta) && o.preventDefault(), c.code === "KeyI" && (c.alt && c.meta || c.control && c.shift) && o.preventDefault()), r && c.code === "Escape" && c.key !== "Process" && (e.close(), o.preventDefault()), i || (c.code === "Minus" && (c.control || c.meta) && o.preventDefault(), c.code === "Equal" && c.shift && (c.control || c.meta) && o.preventDefault()));
    });
  },
  registerFramelessWindowIpc() {
    G.on("win:invoke", (e, n) => {
      const t = Ve.fromWebContents(e.sender);
      t && (n === "show" ? t.show() : n === "showInactive" ? t.showInactive() : n === "min" ? t.minimize() : n === "max" ? t.isMaximized() ? t.unmaximize() : t.maximize() : n === "close" && t.close());
    });
  }
};
var Me = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, jn = { exports: {} }, Ye = {}, U = {};
U.fromCallback = function(e) {
  return Object.defineProperty(function() {
    if (typeof arguments[arguments.length - 1] == "function") e.apply(this, arguments);
    else
      return new Promise((n, t) => {
        arguments[arguments.length] = (r, i) => {
          if (r) return t(r);
          n(i);
        }, arguments.length++, e.apply(this, arguments);
      });
  }, "name", { value: e.name });
};
U.fromPromise = function(e) {
  return Object.defineProperty(function() {
    const n = arguments[arguments.length - 1];
    if (typeof n != "function") return e.apply(this, arguments);
    e.apply(this, arguments).then((t) => n(null, t), n);
  }, "name", { value: e.name });
};
var X = Pt, jt = process.cwd, Fe = null, Ct = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Fe || (Fe = jt.call(process)), Fe;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var rn = process.chdir;
  process.chdir = function(e) {
    Fe = null, rn.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, rn);
}
var Lt = Rt;
function Rt(e) {
  X.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && n(e), e.lutimes || t(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(a, l, y) {
    y && process.nextTick(y);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(a, l, y, f) {
    f && process.nextTick(f);
  }, e.lchownSync = function() {
  }), Ct === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(a) {
    function l(y, f, d) {
      var $ = Date.now(), E = 0;
      a(y, f, function D(B) {
        if (B && (B.code === "EACCES" || B.code === "EPERM" || B.code === "EBUSY") && Date.now() - $ < 6e4) {
          setTimeout(function() {
            e.stat(f, function(J, oe) {
              J && J.code === "ENOENT" ? a(y, f, D) : d(B);
            });
          }, E), E < 100 && (E += 10);
          return;
        }
        d && d(B);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(l, a), l;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(a) {
    function l(y, f, d, $, E, D) {
      var B;
      if (D && typeof D == "function") {
        var J = 0;
        B = function(oe, en, nn) {
          if (oe && oe.code === "EAGAIN" && J < 10)
            return J++, a.call(e, y, f, d, $, E, B);
          D.apply(this, arguments);
        };
      }
      return a.call(e, y, f, d, $, E, B);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(l, a), l;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(a) {
    return function(l, y, f, d, $) {
      for (var E = 0; ; )
        try {
          return a.call(e, l, y, f, d, $);
        } catch (D) {
          if (D.code === "EAGAIN" && E < 10) {
            E++;
            continue;
          }
          throw D;
        }
    };
  }(e.readSync);
  function n(a) {
    a.lchmod = function(l, y, f) {
      a.open(
        l,
        X.O_WRONLY | X.O_SYMLINK,
        y,
        function(d, $) {
          if (d) {
            f && f(d);
            return;
          }
          a.fchmod($, y, function(E) {
            a.close($, function(D) {
              f && f(E || D);
            });
          });
        }
      );
    }, a.lchmodSync = function(l, y) {
      var f = a.openSync(l, X.O_WRONLY | X.O_SYMLINK, y), d = !0, $;
      try {
        $ = a.fchmodSync(f, y), d = !1;
      } finally {
        if (d)
          try {
            a.closeSync(f);
          } catch {
          }
        else
          a.closeSync(f);
      }
      return $;
    };
  }
  function t(a) {
    X.hasOwnProperty("O_SYMLINK") && a.futimes ? (a.lutimes = function(l, y, f, d) {
      a.open(l, X.O_SYMLINK, function($, E) {
        if ($) {
          d && d($);
          return;
        }
        a.futimes(E, y, f, function(D) {
          a.close(E, function(B) {
            d && d(D || B);
          });
        });
      });
    }, a.lutimesSync = function(l, y, f) {
      var d = a.openSync(l, X.O_SYMLINK), $, E = !0;
      try {
        $ = a.futimesSync(d, y, f), E = !1;
      } finally {
        if (E)
          try {
            a.closeSync(d);
          } catch {
          }
        else
          a.closeSync(d);
      }
      return $;
    }) : a.futimes && (a.lutimes = function(l, y, f, d) {
      d && process.nextTick(d);
    }, a.lutimesSync = function() {
    });
  }
  function r(a) {
    return a && function(l, y, f) {
      return a.call(e, l, y, function(d) {
        m(d) && (d = null), f && f.apply(this, arguments);
      });
    };
  }
  function i(a) {
    return a && function(l, y) {
      try {
        return a.call(e, l, y);
      } catch (f) {
        if (!m(f)) throw f;
      }
    };
  }
  function o(a) {
    return a && function(l, y, f, d) {
      return a.call(e, l, y, f, function($) {
        m($) && ($ = null), d && d.apply(this, arguments);
      });
    };
  }
  function c(a) {
    return a && function(l, y, f) {
      try {
        return a.call(e, l, y, f);
      } catch (d) {
        if (!m(d)) throw d;
      }
    };
  }
  function s(a) {
    return a && function(l, y, f) {
      typeof y == "function" && (f = y, y = null);
      function d($, E) {
        E && (E.uid < 0 && (E.uid += 4294967296), E.gid < 0 && (E.gid += 4294967296)), f && f.apply(this, arguments);
      }
      return y ? a.call(e, l, y, d) : a.call(e, l, d);
    };
  }
  function u(a) {
    return a && function(l, y) {
      var f = y ? a.call(e, l, y) : a.call(e, l);
      return f && (f.uid < 0 && (f.uid += 4294967296), f.gid < 0 && (f.gid += 4294967296)), f;
    };
  }
  function m(a) {
    if (!a || a.code === "ENOSYS")
      return !0;
    var l = !process.getuid || process.getuid() !== 0;
    return !!(l && (a.code === "EINVAL" || a.code === "EPERM"));
  }
}
var on = Dt.Stream, At = Mt;
function Mt(e) {
  return {
    ReadStream: n,
    WriteStream: t
  };
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    on.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var c = Object.keys(i), s = 0, u = c.length; s < u; s++) {
      var m = c[s];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(a, l) {
      if (a) {
        o.emit("error", a), o.readable = !1;
        return;
      }
      o.fd = l, o.emit("open", l), o._read();
    });
  }
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    on.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), c = 0, s = o.length; c < s; c++) {
      var u = o[c];
      this[u] = i[u];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Jt = Ut, Wt = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Ut(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var n = { __proto__: Wt(e) };
  else
    var n = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(t) {
    Object.defineProperty(n, t, Object.getOwnPropertyDescriptor(e, t));
  }), n;
}
var N = ze, Bt = Lt, qt = At, Vt = Jt, Se = kt, A, Ne;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (A = Symbol.for("graceful-fs.queue"), Ne = Symbol.for("graceful-fs.previous")) : (A = "___graceful-fs.queue", Ne = "___graceful-fs.previous");
function zt() {
}
function Cn(e, n) {
  Object.defineProperty(e, A, {
    get: function() {
      return n;
    }
  });
}
var ee = zt;
Se.debuglog ? ee = Se.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (ee = function() {
  var e = Se.format.apply(Se, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!N[A]) {
  var Gt = Me[A] || [];
  Cn(N, Gt), N.close = function(e) {
    function n(t, r) {
      return e.call(N, t, function(i) {
        i || cn(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(n, Ne, {
      value: e
    }), n;
  }(N.close), N.closeSync = function(e) {
    function n(t) {
      e.apply(N, arguments), cn();
    }
    return Object.defineProperty(n, Ne, {
      value: e
    }), n;
  }(N.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    ee(N[A]), In.equal(N[A].length, 0);
  });
}
Me[A] || Cn(Me, N[A]);
var T = He(Vt(N));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !N.__patched && (T = He(N), N.__patched = !0);
function He(e) {
  Bt(e), e.gracefulify = He, e.createReadStream = en, e.createWriteStream = nn;
  var n = e.readFile;
  e.readFile = t;
  function t(h, v, S) {
    return typeof v == "function" && (S = v, v = null), j(h, v, S);
    function j(C, I, k, x) {
      return n(C, I, function(g) {
        g && (g.code === "EMFILE" || g.code === "ENFILE") ? ne([j, [C, I, k], g, x || Date.now(), Date.now()]) : typeof k == "function" && k.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(h, v, S, j) {
    return typeof S == "function" && (j = S, S = null), C(h, v, S, j);
    function C(I, k, x, g, L) {
      return r(I, k, x, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ne([C, [I, k, x, g], O, L || Date.now(), Date.now()]) : typeof g == "function" && g.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = c);
  function c(h, v, S, j) {
    return typeof S == "function" && (j = S, S = null), C(h, v, S, j);
    function C(I, k, x, g, L) {
      return o(I, k, x, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ne([C, [I, k, x, g], O, L || Date.now(), Date.now()]) : typeof g == "function" && g.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = u);
  function u(h, v, S, j) {
    return typeof S == "function" && (j = S, S = 0), C(h, v, S, j);
    function C(I, k, x, g, L) {
      return s(I, k, x, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ne([C, [I, k, x, g], O, L || Date.now(), Date.now()]) : typeof g == "function" && g.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = l;
  var a = /^v[0-5]\./;
  function l(h, v, S) {
    typeof v == "function" && (S = v, v = null);
    var j = a.test(process.version) ? function(k, x, g, L) {
      return m(k, C(
        k,
        x,
        g,
        L
      ));
    } : function(k, x, g, L) {
      return m(k, x, C(
        k,
        x,
        g,
        L
      ));
    };
    return j(h, v, S);
    function C(I, k, x, g) {
      return function(L, O) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? ne([
          j,
          [I, k, x],
          L,
          g || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof x == "function" && x.call(this, L, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var y = qt(e);
    D = y.ReadStream, J = y.WriteStream;
  }
  var f = e.ReadStream;
  f && (D.prototype = Object.create(f.prototype), D.prototype.open = B);
  var d = e.WriteStream;
  d && (J.prototype = Object.create(d.prototype), J.prototype.open = oe), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return D;
    },
    set: function(h) {
      D = h;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return J;
    },
    set: function(h) {
      J = h;
    },
    enumerable: !0,
    configurable: !0
  });
  var $ = D;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return $;
    },
    set: function(h) {
      $ = h;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = J;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return E;
    },
    set: function(h) {
      E = h;
    },
    enumerable: !0,
    configurable: !0
  });
  function D(h, v) {
    return this instanceof D ? (f.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function B() {
    var h = this;
    Ie(h.path, h.flags, h.mode, function(v, S) {
      v ? (h.autoClose && h.destroy(), h.emit("error", v)) : (h.fd = S, h.emit("open", S), h.read());
    });
  }
  function J(h, v) {
    return this instanceof J ? (d.apply(this, arguments), this) : J.apply(Object.create(J.prototype), arguments);
  }
  function oe() {
    var h = this;
    Ie(h.path, h.flags, h.mode, function(v, S) {
      v ? (h.destroy(), h.emit("error", v)) : (h.fd = S, h.emit("open", S));
    });
  }
  function en(h, v) {
    return new e.ReadStream(h, v);
  }
  function nn(h, v) {
    return new e.WriteStream(h, v);
  }
  var gt = e.open;
  e.open = Ie;
  function Ie(h, v, S, j) {
    return typeof S == "function" && (j = S, S = null), C(h, v, S, j);
    function C(I, k, x, g, L) {
      return gt(I, k, x, function(O, No) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ne([C, [I, k, x, g], O, L || Date.now(), Date.now()]) : typeof g == "function" && g.apply(this, arguments);
      });
    }
  }
  return e;
}
function ne(e) {
  ee("ENQUEUE", e[0].name, e[1]), N[A].push(e), Ke();
}
var we;
function cn() {
  for (var e = Date.now(), n = 0; n < N[A].length; ++n)
    N[A][n].length > 2 && (N[A][n][3] = e, N[A][n][4] = e);
  Ke();
}
function Ke() {
  if (clearTimeout(we), we = void 0, N[A].length !== 0) {
    var e = N[A].shift(), n = e[0], t = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      ee("RETRY", n.name, t), n.apply(null, t);
    else if (Date.now() - i >= 6e4) {
      ee("TIMEOUT", n.name, t);
      var c = t.pop();
      typeof c == "function" && c.call(null, r);
    } else {
      var s = Date.now() - o, u = Math.max(o - i, 1), m = Math.min(u * 1.2, 100);
      s >= m ? (ee("RETRY", n.name, t), n.apply(null, t.concat([i]))) : N[A].push(e);
    }
    we === void 0 && (we = setTimeout(Ke, 0));
  }
}
(function(e) {
  const n = U.fromCallback, t = T, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchown",
    "lchmod",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "readFile",
    "readdir",
    "readlink",
    "realpath",
    "rename",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof t[i] == "function");
  Object.keys(t).forEach((i) => {
    i !== "promises" && (e[i] = t[i]);
  }), r.forEach((i) => {
    e[i] = n(t[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? t.exists(i, o) : new Promise((c) => t.exists(i, c));
  }, e.read = function(i, o, c, s, u, m) {
    return typeof m == "function" ? t.read(i, o, c, s, u, m) : new Promise((a, l) => {
      t.read(i, o, c, s, u, (y, f, d) => {
        if (y) return l(y);
        a({ bytesRead: f, buffer: d });
      });
    });
  }, e.write = function(i, o, ...c) {
    return typeof c[c.length - 1] == "function" ? t.write(i, o, ...c) : new Promise((s, u) => {
      t.write(i, o, ...c, (m, a, l) => {
        if (m) return u(m);
        s({ bytesWritten: a, buffer: l });
      });
    });
  }, typeof t.realpath.native == "function" && (e.realpath.native = n(t.realpath.native));
})(Ye);
const _e = _;
function Yt(e) {
  return e = _e.normalize(_e.resolve(e)).split(_e.sep), e.length > 0 ? e[0] : null;
}
const Ht = /[<>:"|?*]/;
function Kt(e) {
  const n = Yt(e);
  return e = e.replace(n, ""), Ht.test(e);
}
var Ln = {
  invalidWin32Path: Kt
};
const Qt = T, je = _, Xt = Ln.invalidWin32Path, Zt = parseInt("0777", 8);
function Je(e, n, t, r) {
  if (typeof n == "function" ? (t = n, n = {}) : (!n || typeof n != "object") && (n = { mode: n }), process.platform === "win32" && Xt(e)) {
    const c = new Error(e + " contains invalid WIN32 path characters.");
    return c.code = "EINVAL", t(c);
  }
  let i = n.mode;
  const o = n.fs || Qt;
  i === void 0 && (i = Zt & ~process.umask()), r || (r = null), t = t || function() {
  }, e = je.resolve(e), o.mkdir(e, i, (c) => {
    if (!c)
      return r = r || e, t(null, r);
    switch (c.code) {
      case "ENOENT":
        if (je.dirname(e) === e) return t(c);
        Je(je.dirname(e), n, (s, u) => {
          s ? t(s, u) : Je(e, n, t, u);
        });
        break;
      default:
        o.stat(e, (s, u) => {
          s || !u.isDirectory() ? t(c, r) : t(null, r);
        });
        break;
    }
  });
}
var bt = Je;
const er = T, Ce = _, nr = Ln.invalidWin32Path, tr = parseInt("0777", 8);
function We(e, n, t) {
  (!n || typeof n != "object") && (n = { mode: n });
  let r = n.mode;
  const i = n.fs || er;
  if (process.platform === "win32" && nr(e)) {
    const o = new Error(e + " contains invalid WIN32 path characters.");
    throw o.code = "EINVAL", o;
  }
  r === void 0 && (r = tr & ~process.umask()), t || (t = null), e = Ce.resolve(e);
  try {
    i.mkdirSync(e, r), t = t || e;
  } catch (o) {
    if (o.code === "ENOENT") {
      if (Ce.dirname(e) === e) throw o;
      t = We(Ce.dirname(e), n, t), We(e, n, t);
    } else {
      let c;
      try {
        c = i.statSync(e);
      } catch {
        throw o;
      }
      if (!c.isDirectory()) throw o;
    }
  }
  return t;
}
var rr = We;
const ir = U.fromCallback, Le = ir(bt), Re = rr;
var z = {
  mkdirs: Le,
  mkdirsSync: Re,
  // alias
  mkdirp: Le,
  mkdirpSync: Re,
  ensureDir: Le,
  ensureDirSync: Re
};
const re = T;
function or(e, n, t, r) {
  re.open(e, "r+", (i, o) => {
    if (i) return r(i);
    re.futimes(o, n, t, (c) => {
      re.close(o, (s) => {
        r && r(c || s);
      });
    });
  });
}
function cr(e, n, t) {
  const r = re.openSync(e, "r+");
  return re.futimesSync(r, n, t), re.closeSync(r);
}
var Rn = {
  utimesMillis: or,
  utimesMillisSync: cr
};
const V = T, q = _, sn = 10, un = 5, sr = 0, Qe = process.versions.node.split("."), an = Number.parseInt(Qe[0], 10), fn = Number.parseInt(Qe[1], 10), ur = Number.parseInt(Qe[2], 10);
function ae() {
  if (an > sn)
    return !0;
  if (an === sn) {
    if (fn > un)
      return !0;
    if (fn === un && ur >= sr)
      return !0;
  }
  return !1;
}
function ar(e, n, t) {
  ae() ? V.stat(e, { bigint: !0 }, (r, i) => {
    if (r) return t(r);
    V.stat(n, { bigint: !0 }, (o, c) => o ? o.code === "ENOENT" ? t(null, { srcStat: i, destStat: null }) : t(o) : t(null, { srcStat: i, destStat: c }));
  }) : V.stat(e, (r, i) => {
    if (r) return t(r);
    V.stat(n, (o, c) => o ? o.code === "ENOENT" ? t(null, { srcStat: i, destStat: null }) : t(o) : t(null, { srcStat: i, destStat: c }));
  });
}
function fr(e, n) {
  let t, r;
  ae() ? t = V.statSync(e, { bigint: !0 }) : t = V.statSync(e);
  try {
    ae() ? r = V.statSync(n, { bigint: !0 }) : r = V.statSync(n);
  } catch (i) {
    if (i.code === "ENOENT") return { srcStat: t, destStat: null };
    throw i;
  }
  return { srcStat: t, destStat: r };
}
function lr(e, n, t, r) {
  ar(e, n, (i, o) => {
    if (i) return r(i);
    const { srcStat: c, destStat: s } = o;
    return s && s.ino && s.dev && s.ino === c.ino && s.dev === c.dev ? r(new Error("Source and destination must not be the same.")) : c.isDirectory() && Xe(e, n) ? r(new Error(fe(e, n, t))) : r(null, { srcStat: c, destStat: s });
  });
}
function yr(e, n, t) {
  const { srcStat: r, destStat: i } = fr(e, n);
  if (i && i.ino && i.dev && i.ino === r.ino && i.dev === r.dev)
    throw new Error("Source and destination must not be the same.");
  if (r.isDirectory() && Xe(e, n))
    throw new Error(fe(e, n, t));
  return { srcStat: r, destStat: i };
}
function Ue(e, n, t, r, i) {
  const o = q.resolve(q.dirname(e)), c = q.resolve(q.dirname(t));
  if (c === o || c === q.parse(c).root) return i();
  ae() ? V.stat(c, { bigint: !0 }, (s, u) => s ? s.code === "ENOENT" ? i() : i(s) : u.ino && u.dev && u.ino === n.ino && u.dev === n.dev ? i(new Error(fe(e, t, r))) : Ue(e, n, c, r, i)) : V.stat(c, (s, u) => s ? s.code === "ENOENT" ? i() : i(s) : u.ino && u.dev && u.ino === n.ino && u.dev === n.dev ? i(new Error(fe(e, t, r))) : Ue(e, n, c, r, i));
}
function An(e, n, t, r) {
  const i = q.resolve(q.dirname(e)), o = q.resolve(q.dirname(t));
  if (o === i || o === q.parse(o).root) return;
  let c;
  try {
    ae() ? c = V.statSync(o, { bigint: !0 }) : c = V.statSync(o);
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (c.ino && c.dev && c.ino === n.ino && c.dev === n.dev)
    throw new Error(fe(e, t, r));
  return An(e, n, o, r);
}
function Xe(e, n) {
  const t = q.resolve(e).split(q.sep).filter((i) => i), r = q.resolve(n).split(q.sep).filter((i) => i);
  return t.reduce((i, o, c) => i && r[c] === o, !0);
}
function fe(e, n, t) {
  return `Cannot ${t} '${e}' to a subdirectory of itself, '${n}'.`;
}
var xe = {
  checkPaths: lr,
  checkPathsSync: yr,
  checkParentPaths: Ue,
  checkParentPathsSync: An,
  isSrcSubdir: Xe
}, Ae, ln;
function dr() {
  return ln || (ln = 1, Ae = function(e) {
    if (typeof Buffer.allocUnsafe == "function")
      try {
        return Buffer.allocUnsafe(e);
      } catch {
        return new Buffer(e);
      }
    return new Buffer(e);
  }), Ae;
}
const F = T, le = _, mr = z.mkdirsSync, hr = Rn.utimesMillisSync, ye = xe;
function Sr(e, n, t) {
  typeof t == "function" && (t = { filter: t }), t = t || {}, t.clobber = "clobber" in t ? !!t.clobber : !0, t.overwrite = "overwrite" in t ? !!t.overwrite : t.clobber, t.preserveTimestamps && process.arch === "ia32" && console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  const { srcStat: r, destStat: i } = ye.checkPathsSync(e, n, "copy");
  return ye.checkParentPathsSync(e, r, n, "copy"), wr(i, e, n, t);
}
function wr(e, n, t, r) {
  if (r.filter && !r.filter(n, t)) return;
  const i = le.dirname(t);
  return F.existsSync(i) || mr(i), Mn(e, n, t, r);
}
function Mn(e, n, t, r) {
  if (!(r.filter && !r.filter(n, t)))
    return vr(e, n, t, r);
}
function vr(e, n, t, r) {
  const o = (r.dereference ? F.statSync : F.lstatSync)(n);
  if (o.isDirectory()) return $r(o, e, n, t, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return pr(o, e, n, t, r);
  if (o.isSymbolicLink()) return Pr(e, n, t, r);
}
function pr(e, n, t, r, i) {
  return n ? Er(e, t, r, i) : Jn(e, t, r, i);
}
function Er(e, n, t, r) {
  if (r.overwrite)
    return F.unlinkSync(t), Jn(e, n, t, r);
  if (r.errorOnExist)
    throw new Error(`'${t}' already exists`);
}
function Jn(e, n, t, r) {
  return typeof F.copyFileSync == "function" ? (F.copyFileSync(n, t), F.chmodSync(t, e.mode), r.preserveTimestamps ? hr(t, e.atime, e.mtime) : void 0) : gr(e, n, t, r);
}
function gr(e, n, t, r) {
  const o = dr()(65536), c = F.openSync(n, "r"), s = F.openSync(t, "w", e.mode);
  let u = 0;
  for (; u < e.size; ) {
    const m = F.readSync(c, o, 0, 65536, u);
    F.writeSync(s, o, 0, m), u += m;
  }
  r.preserveTimestamps && F.futimesSync(s, e.atime, e.mtime), F.closeSync(c), F.closeSync(s);
}
function $r(e, n, t, r, i) {
  if (!n) return Or(e, t, r, i);
  if (n && !n.isDirectory())
    throw new Error(`Cannot overwrite non-directory '${r}' with directory '${t}'.`);
  return Wn(t, r, i);
}
function Or(e, n, t, r) {
  return F.mkdirSync(t), Wn(n, t, r), F.chmodSync(t, e.mode);
}
function Wn(e, n, t) {
  F.readdirSync(e).forEach((r) => Fr(r, e, n, t));
}
function Fr(e, n, t, r) {
  const i = le.join(n, e), o = le.join(t, e), { destStat: c } = ye.checkPathsSync(i, o, "copy");
  return Mn(c, i, o, r);
}
function Pr(e, n, t, r) {
  let i = F.readlinkSync(n);
  if (r.dereference && (i = le.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = F.readlinkSync(t);
    } catch (c) {
      if (c.code === "EINVAL" || c.code === "UNKNOWN") return F.symlinkSync(i, t);
      throw c;
    }
    if (r.dereference && (o = le.resolve(process.cwd(), o)), ye.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (F.statSync(t).isDirectory() && ye.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Dr(i, t);
  } else
    return F.symlinkSync(i, t);
}
function Dr(e, n) {
  return F.unlinkSync(n), F.symlinkSync(e, n);
}
var kr = Sr, Un = {
  copySync: kr
};
const Nr = U.fromPromise, Bn = Ye;
function xr(e) {
  return Bn.access(e).then(() => !0).catch(() => !1);
}
var K = {
  pathExists: Nr(xr),
  pathExistsSync: Bn.existsSync
};
const M = T, de = _, Tr = z.mkdirs, Ir = K.pathExists, _r = Rn.utimesMillis, me = xe;
function jr(e, n, t, r) {
  typeof t == "function" && !r ? (r = t, t = {}) : typeof t == "function" && (t = { filter: t }), r = r || function() {
  }, t = t || {}, t.clobber = "clobber" in t ? !!t.clobber : !0, t.overwrite = "overwrite" in t ? !!t.overwrite : t.clobber, t.preserveTimestamps && process.arch === "ia32" && console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`), me.checkPaths(e, n, "copy", (i, o) => {
    if (i) return r(i);
    const { srcStat: c, destStat: s } = o;
    me.checkParentPaths(e, c, n, "copy", (u) => u ? r(u) : t.filter ? qn(yn, s, e, n, t, r) : yn(s, e, n, t, r));
  });
}
function yn(e, n, t, r, i) {
  const o = de.dirname(t);
  Ir(o, (c, s) => {
    if (c) return i(c);
    if (s) return Be(e, n, t, r, i);
    Tr(o, (u) => u ? i(u) : Be(e, n, t, r, i));
  });
}
function qn(e, n, t, r, i, o) {
  Promise.resolve(i.filter(t, r)).then((c) => c ? e(n, t, r, i, o) : o(), (c) => o(c));
}
function Be(e, n, t, r, i) {
  return r.filter ? qn(dn, e, n, t, r, i) : dn(e, n, t, r, i);
}
function dn(e, n, t, r, i) {
  (r.dereference ? M.stat : M.lstat)(n, (c, s) => {
    if (c) return i(c);
    if (s.isDirectory()) return Ar(s, e, n, t, r, i);
    if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return Cr(s, e, n, t, r, i);
    if (s.isSymbolicLink()) return Wr(e, n, t, r, i);
  });
}
function Cr(e, n, t, r, i, o) {
  return n ? Lr(e, t, r, i, o) : Vn(e, t, r, i, o);
}
function Lr(e, n, t, r, i) {
  if (r.overwrite)
    M.unlink(t, (o) => o ? i(o) : Vn(e, n, t, r, i));
  else return r.errorOnExist ? i(new Error(`'${t}' already exists`)) : i();
}
function Vn(e, n, t, r, i) {
  return typeof M.copyFile == "function" ? M.copyFile(n, t, (o) => o ? i(o) : zn(e, t, r, i)) : Rr(e, n, t, r, i);
}
function Rr(e, n, t, r, i) {
  const o = M.createReadStream(n);
  o.on("error", (c) => i(c)).once("open", () => {
    const c = M.createWriteStream(t, { mode: e.mode });
    c.on("error", (s) => i(s)).on("open", () => o.pipe(c)).once("close", () => zn(e, t, r, i));
  });
}
function zn(e, n, t, r) {
  M.chmod(n, e.mode, (i) => i ? r(i) : t.preserveTimestamps ? _r(n, e.atime, e.mtime, r) : r());
}
function Ar(e, n, t, r, i, o) {
  return n ? n && !n.isDirectory() ? o(new Error(`Cannot overwrite non-directory '${r}' with directory '${t}'.`)) : Gn(t, r, i, o) : Mr(e, t, r, i, o);
}
function Mr(e, n, t, r, i) {
  M.mkdir(t, (o) => {
    if (o) return i(o);
    Gn(n, t, r, (c) => c ? i(c) : M.chmod(t, e.mode, i));
  });
}
function Gn(e, n, t, r) {
  M.readdir(e, (i, o) => i ? r(i) : Yn(o, e, n, t, r));
}
function Yn(e, n, t, r, i) {
  const o = e.pop();
  return o ? Jr(e, o, n, t, r, i) : i();
}
function Jr(e, n, t, r, i, o) {
  const c = de.join(t, n), s = de.join(r, n);
  me.checkPaths(c, s, "copy", (u, m) => {
    if (u) return o(u);
    const { destStat: a } = m;
    Be(a, c, s, i, (l) => l ? o(l) : Yn(e, t, r, i, o));
  });
}
function Wr(e, n, t, r, i) {
  M.readlink(n, (o, c) => {
    if (o) return i(o);
    if (r.dereference && (c = de.resolve(process.cwd(), c)), e)
      M.readlink(t, (s, u) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? M.symlink(c, t, i) : i(s) : (r.dereference && (u = de.resolve(process.cwd(), u)), me.isSrcSubdir(c, u) ? i(new Error(`Cannot copy '${c}' to a subdirectory of itself, '${u}'.`)) : e.isDirectory() && me.isSrcSubdir(u, c) ? i(new Error(`Cannot overwrite '${u}' with '${c}'.`)) : Ur(c, t, i)));
    else
      return M.symlink(c, t, i);
  });
}
function Ur(e, n, t) {
  M.unlink(n, (r) => r ? t(r) : M.symlink(e, n, t));
}
var Br = jr;
const qr = U.fromCallback;
var Hn = {
  copy: qr(Br)
};
const mn = T, Kn = _, w = In, he = process.platform === "win32";
function Qn(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((t) => {
    e[t] = e[t] || mn[t], t = t + "Sync", e[t] = e[t] || mn[t];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Ze(e, n, t) {
  let r = 0;
  typeof n == "function" && (t = n, n = {}), w(e, "rimraf: missing path"), w.strictEqual(typeof e, "string", "rimraf: path should be a string"), w.strictEqual(typeof t, "function", "rimraf: callback function required"), w(n, "rimraf: invalid options argument provided"), w.strictEqual(typeof n, "object", "rimraf: options should be object"), Qn(n), hn(e, n, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < n.maxBusyTries) {
        r++;
        const c = r * 100;
        return setTimeout(() => hn(e, n, i), c);
      }
      o.code === "ENOENT" && (o = null);
    }
    t(o);
  });
}
function hn(e, n, t) {
  w(e), w(n), w(typeof t == "function"), n.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return t(null);
    if (r && r.code === "EPERM" && he)
      return Sn(e, n, r, t);
    if (i && i.isDirectory())
      return Pe(e, n, r, t);
    n.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return t(null);
        if (o.code === "EPERM")
          return he ? Sn(e, n, o, t) : Pe(e, n, o, t);
        if (o.code === "EISDIR")
          return Pe(e, n, o, t);
      }
      return t(o);
    });
  });
}
function Sn(e, n, t, r) {
  w(e), w(n), w(typeof r == "function"), t && w(t instanceof Error), n.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : t) : n.stat(e, (o, c) => {
      o ? r(o.code === "ENOENT" ? null : t) : c.isDirectory() ? Pe(e, n, t, r) : n.unlink(e, r);
    });
  });
}
function wn(e, n, t) {
  let r;
  w(e), w(n), t && w(t instanceof Error);
  try {
    n.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw t;
  }
  try {
    r = n.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw t;
  }
  r.isDirectory() ? De(e, n, t) : n.unlinkSync(e);
}
function Pe(e, n, t, r) {
  w(e), w(n), t && w(t instanceof Error), w(typeof r == "function"), n.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Vr(e, n, r) : i && i.code === "ENOTDIR" ? r(t) : r(i);
  });
}
function Vr(e, n, t) {
  w(e), w(n), w(typeof t == "function"), n.readdir(e, (r, i) => {
    if (r) return t(r);
    let o = i.length, c;
    if (o === 0) return n.rmdir(e, t);
    i.forEach((s) => {
      Ze(Kn.join(e, s), n, (u) => {
        if (!c) {
          if (u) return t(c = u);
          --o === 0 && n.rmdir(e, t);
        }
      });
    });
  });
}
function Xn(e, n) {
  let t;
  n = n || {}, Qn(n), w(e, "rimraf: missing path"), w.strictEqual(typeof e, "string", "rimraf: path should be a string"), w(n, "rimraf: missing options"), w.strictEqual(typeof n, "object", "rimraf: options should be object");
  try {
    t = n.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && he && wn(e, n, r);
  }
  try {
    t && t.isDirectory() ? De(e, n, null) : n.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return he ? wn(e, n, r) : De(e, n, r);
    if (r.code !== "EISDIR")
      throw r;
    De(e, n, r);
  }
}
function De(e, n, t) {
  w(e), w(n), t && w(t instanceof Error);
  try {
    n.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw t;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      zr(e, n);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function zr(e, n) {
  if (w(e), w(n), n.readdirSync(e).forEach((t) => Xn(Kn.join(e, t), n)), he) {
    const t = Date.now();
    do
      try {
        return n.rmdirSync(e, n);
      } catch {
      }
    while (Date.now() - t < 500);
  } else
    return n.rmdirSync(e, n);
}
var Gr = Ze;
Ze.sync = Xn;
const Yr = U.fromCallback, vn = Gr;
var Te = {
  remove: Yr(vn),
  removeSync: vn.sync
};
const Hr = U.fromCallback, Zn = T, bn = _, et = z, nt = Te, pn = Hr(function(n, t) {
  t = t || function() {
  }, Zn.readdir(n, (r, i) => {
    if (r) return et.mkdirs(n, t);
    i = i.map((c) => bn.join(n, c)), o();
    function o() {
      const c = i.pop();
      if (!c) return t();
      nt.remove(c, (s) => {
        if (s) return t(s);
        o();
      });
    }
  });
});
function En(e) {
  let n;
  try {
    n = Zn.readdirSync(e);
  } catch {
    return et.mkdirsSync(e);
  }
  n.forEach((t) => {
    t = bn.join(e, t), nt.removeSync(t);
  });
}
var Kr = {
  emptyDirSync: En,
  emptydirSync: En,
  emptyDir: pn,
  emptydir: pn
};
const Qr = U.fromCallback, tt = _, ce = T, rt = z, Xr = K.pathExists;
function Zr(e, n) {
  function t() {
    ce.writeFile(e, "", (r) => {
      if (r) return n(r);
      n();
    });
  }
  ce.stat(e, (r, i) => {
    if (!r && i.isFile()) return n();
    const o = tt.dirname(e);
    Xr(o, (c, s) => {
      if (c) return n(c);
      if (s) return t();
      rt.mkdirs(o, (u) => {
        if (u) return n(u);
        t();
      });
    });
  });
}
function br(e) {
  let n;
  try {
    n = ce.statSync(e);
  } catch {
  }
  if (n && n.isFile()) return;
  const t = tt.dirname(e);
  ce.existsSync(t) || rt.mkdirsSync(t), ce.writeFileSync(e, "");
}
var ei = {
  createFile: Qr(Zr),
  createFileSync: br
};
const ni = U.fromCallback, it = _, b = T, ot = z, gn = K.pathExists;
function ti(e, n, t) {
  function r(i, o) {
    b.link(i, o, (c) => {
      if (c) return t(c);
      t(null);
    });
  }
  gn(n, (i, o) => {
    if (i) return t(i);
    if (o) return t(null);
    b.lstat(e, (c) => {
      if (c)
        return c.message = c.message.replace("lstat", "ensureLink"), t(c);
      const s = it.dirname(n);
      gn(s, (u, m) => {
        if (u) return t(u);
        if (m) return r(e, n);
        ot.mkdirs(s, (a) => {
          if (a) return t(a);
          r(e, n);
        });
      });
    });
  });
}
function ri(e, n) {
  if (b.existsSync(n)) return;
  try {
    b.lstatSync(e);
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = it.dirname(n);
  return b.existsSync(r) || ot.mkdirsSync(r), b.linkSync(e, n);
}
var ii = {
  createLink: ni(ti),
  createLinkSync: ri
};
const Z = _, se = T, oi = K.pathExists;
function ci(e, n, t) {
  if (Z.isAbsolute(e))
    return se.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), t(r)) : t(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = Z.dirname(n), i = Z.join(r, e);
    return oi(i, (o, c) => o ? t(o) : c ? t(null, {
      toCwd: i,
      toDst: e
    }) : se.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), t(s)) : t(null, {
      toCwd: e,
      toDst: Z.relative(r, e)
    })));
  }
}
function si(e, n) {
  let t;
  if (Z.isAbsolute(e)) {
    if (t = se.existsSync(e), !t) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = Z.dirname(n), i = Z.join(r, e);
    if (t = se.existsSync(i), t)
      return {
        toCwd: i,
        toDst: e
      };
    if (t = se.existsSync(e), !t) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Z.relative(r, e)
    };
  }
}
var ui = {
  symlinkPaths: ci,
  symlinkPathsSync: si
};
const ct = T;
function ai(e, n, t) {
  if (t = typeof n == "function" ? n : t, n = typeof n == "function" ? !1 : n, n) return t(null, n);
  ct.lstat(e, (r, i) => {
    if (r) return t(null, "file");
    n = i && i.isDirectory() ? "dir" : "file", t(null, n);
  });
}
function fi(e, n) {
  let t;
  if (n) return n;
  try {
    t = ct.lstatSync(e);
  } catch {
    return "file";
  }
  return t && t.isDirectory() ? "dir" : "file";
}
var li = {
  symlinkType: ai,
  symlinkTypeSync: fi
};
const yi = U.fromCallback, st = _, te = T, ut = z, di = ut.mkdirs, mi = ut.mkdirsSync, at = ui, hi = at.symlinkPaths, Si = at.symlinkPathsSync, ft = li, wi = ft.symlinkType, vi = ft.symlinkTypeSync, $n = K.pathExists;
function pi(e, n, t, r) {
  r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, $n(n, (i, o) => {
    if (i) return r(i);
    if (o) return r(null);
    hi(e, n, (c, s) => {
      if (c) return r(c);
      e = s.toDst, wi(s.toCwd, t, (u, m) => {
        if (u) return r(u);
        const a = st.dirname(n);
        $n(a, (l, y) => {
          if (l) return r(l);
          if (y) return te.symlink(e, n, m, r);
          di(a, (f) => {
            if (f) return r(f);
            te.symlink(e, n, m, r);
          });
        });
      });
    });
  });
}
function Ei(e, n, t) {
  if (te.existsSync(n)) return;
  const i = Si(e, n);
  e = i.toDst, t = vi(i.toCwd, t);
  const o = st.dirname(n);
  return te.existsSync(o) || mi(o), te.symlinkSync(e, n, t);
}
var gi = {
  createSymlink: yi(pi),
  createSymlinkSync: Ei
};
const ve = ei, pe = ii, Ee = gi;
var $i = {
  // file
  createFile: ve.createFile,
  createFileSync: ve.createFileSync,
  ensureFile: ve.createFile,
  ensureFileSync: ve.createFileSync,
  // link
  createLink: pe.createLink,
  createLinkSync: pe.createLinkSync,
  ensureLink: pe.createLink,
  ensureLinkSync: pe.createLinkSync,
  // symlink
  createSymlink: Ee.createSymlink,
  createSymlinkSync: Ee.createSymlinkSync,
  ensureSymlink: Ee.createSymlink,
  ensureSymlinkSync: Ee.createSymlinkSync
}, ie;
try {
  ie = T;
} catch {
  ie = ze;
}
function Oi(e, n, t) {
  t == null && (t = n, n = {}), typeof n == "string" && (n = { encoding: n }), n = n || {};
  var r = n.fs || ie, i = !0;
  "throws" in n && (i = n.throws), r.readFile(e, n, function(o, c) {
    if (o) return t(o);
    c = yt(c);
    var s;
    try {
      s = JSON.parse(c, n ? n.reviver : null);
    } catch (u) {
      return i ? (u.message = e + ": " + u.message, t(u)) : t(null, null);
    }
    t(null, s);
  });
}
function Fi(e, n) {
  n = n || {}, typeof n == "string" && (n = { encoding: n });
  var t = n.fs || ie, r = !0;
  "throws" in n && (r = n.throws);
  try {
    var i = t.readFileSync(e, n);
    return i = yt(i), JSON.parse(i, n.reviver);
  } catch (o) {
    if (r)
      throw o.message = e + ": " + o.message, o;
    return null;
  }
}
function lt(e, n) {
  var t, r = `
`;
  typeof n == "object" && n !== null && (n.spaces && (t = n.spaces), n.EOL && (r = n.EOL));
  var i = JSON.stringify(e, n ? n.replacer : null, t);
  return i.replace(/\n/g, r) + r;
}
function Pi(e, n, t, r) {
  r == null && (r = t, t = {}), t = t || {};
  var i = t.fs || ie, o = "";
  try {
    o = lt(n, t);
  } catch (c) {
    r && r(c, null);
    return;
  }
  i.writeFile(e, o, t, r);
}
function Di(e, n, t) {
  t = t || {};
  var r = t.fs || ie, i = lt(n, t);
  return r.writeFileSync(e, i, t);
}
function yt(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e = e.replace(/^\uFEFF/, ""), e;
}
var ki = {
  readFile: Oi,
  readFileSync: Fi,
  writeFile: Pi,
  writeFileSync: Di
}, Ni = ki;
const On = U.fromCallback, ge = Ni;
var be = {
  // jsonfile exports
  readJson: On(ge.readFile),
  readJsonSync: ge.readFileSync,
  writeJson: On(ge.writeFile),
  writeJsonSync: ge.writeFileSync
};
const xi = _, Ti = z, Ii = K.pathExists, Fn = be;
function _i(e, n, t, r) {
  typeof t == "function" && (r = t, t = {});
  const i = xi.dirname(e);
  Ii(i, (o, c) => {
    if (o) return r(o);
    if (c) return Fn.writeJson(e, n, t, r);
    Ti.mkdirs(i, (s) => {
      if (s) return r(s);
      Fn.writeJson(e, n, t, r);
    });
  });
}
var ji = _i;
const Ci = T, Li = _, Ri = z, Ai = be;
function Mi(e, n, t) {
  const r = Li.dirname(e);
  Ci.existsSync(r) || Ri.mkdirsSync(r), Ai.writeJsonSync(e, n, t);
}
var Ji = Mi;
const Wi = U.fromCallback, W = be;
W.outputJson = Wi(ji);
W.outputJsonSync = Ji;
W.outputJSON = W.outputJson;
W.outputJSONSync = W.outputJsonSync;
W.writeJSON = W.writeJson;
W.writeJSONSync = W.writeJsonSync;
W.readJSON = W.readJson;
W.readJSONSync = W.readJsonSync;
var Ui = W;
const dt = T, Bi = _, qi = Un.copySync, mt = Te.removeSync, Vi = z.mkdirpSync, Pn = xe;
function zi(e, n, t) {
  t = t || {};
  const r = t.overwrite || t.clobber || !1, { srcStat: i } = Pn.checkPathsSync(e, n, "move");
  return Pn.checkParentPathsSync(e, i, n, "move"), Vi(Bi.dirname(n)), Gi(e, n, r);
}
function Gi(e, n, t) {
  if (t)
    return mt(n), Dn(e, n, t);
  if (dt.existsSync(n)) throw new Error("dest already exists.");
  return Dn(e, n, t);
}
function Dn(e, n, t) {
  try {
    dt.renameSync(e, n);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Yi(e, n, t);
  }
}
function Yi(e, n, t) {
  return qi(e, n, {
    overwrite: t,
    errorOnExist: !0
  }), mt(e);
}
var Hi = zi, Ki = {
  moveSync: Hi
};
const Qi = T, Xi = _, Zi = Hn.copy, ht = Te.remove, bi = z.mkdirp, eo = K.pathExists, kn = xe;
function no(e, n, t, r) {
  typeof t == "function" && (r = t, t = {});
  const i = t.overwrite || t.clobber || !1;
  kn.checkPaths(e, n, "move", (o, c) => {
    if (o) return r(o);
    const { srcStat: s } = c;
    kn.checkParentPaths(e, s, n, "move", (u) => {
      if (u) return r(u);
      bi(Xi.dirname(n), (m) => m ? r(m) : to(e, n, i, r));
    });
  });
}
function to(e, n, t, r) {
  if (t)
    return ht(n, (i) => i ? r(i) : Nn(e, n, t, r));
  eo(n, (i, o) => i ? r(i) : o ? r(new Error("dest already exists.")) : Nn(e, n, t, r));
}
function Nn(e, n, t, r) {
  Qi.rename(e, n, (i) => i ? i.code !== "EXDEV" ? r(i) : ro(e, n, t, r) : r());
}
function ro(e, n, t, r) {
  Zi(e, n, {
    overwrite: t,
    errorOnExist: !0
  }, (o) => o ? r(o) : ht(e, r));
}
var io = no;
const oo = U.fromCallback;
var co = {
  move: oo(io)
};
const so = U.fromCallback, ue = T, St = _, wt = z, uo = K.pathExists;
function ao(e, n, t, r) {
  typeof t == "function" && (r = t, t = "utf8");
  const i = St.dirname(e);
  uo(i, (o, c) => {
    if (o) return r(o);
    if (c) return ue.writeFile(e, n, t, r);
    wt.mkdirs(i, (s) => {
      if (s) return r(s);
      ue.writeFile(e, n, t, r);
    });
  });
}
function fo(e, ...n) {
  const t = St.dirname(e);
  if (ue.existsSync(t))
    return ue.writeFileSync(e, ...n);
  wt.mkdirsSync(t), ue.writeFileSync(e, ...n);
}
var lo = {
  outputFile: so(ao),
  outputFileSync: fo
};
(function(e) {
  e.exports = Object.assign(
    {},
    // Export promiseified graceful-fs:
    Ye,
    // Export extra methods:
    Un,
    Hn,
    Kr,
    $i,
    Ui,
    z,
    Ki,
    co,
    lo,
    K,
    Te
  );
  const n = ze;
  Object.getOwnPropertyDescriptor(n, "promises") && Object.defineProperty(e.exports, "promises", {
    get() {
      return n.promises;
    }
  });
})(jn);
var P = jn.exports;
const R = [];
for (let e = 0; e < 256; ++e)
  R.push((e + 256).toString(16).slice(1));
function yo(e, n = 0) {
  return (R[e[n + 0]] + R[e[n + 1]] + R[e[n + 2]] + R[e[n + 3]] + "-" + R[e[n + 4]] + R[e[n + 5]] + "-" + R[e[n + 6]] + R[e[n + 7]] + "-" + R[e[n + 8]] + R[e[n + 9]] + "-" + R[e[n + 10]] + R[e[n + 11]] + R[e[n + 12]] + R[e[n + 13]] + R[e[n + 14]] + R[e[n + 15]]).toLowerCase();
}
const ke = new Uint8Array(256);
let $e = ke.length;
function mo() {
  return $e > ke.length - 16 && (xt(ke), $e = 0), ke.slice($e, $e += 16);
}
const xn = { randomUUID: Tt };
function Oe(e, n, t) {
  var i;
  if (xn.randomUUID && !e)
    return xn.randomUUID();
  e = e || {};
  const r = e.random ?? ((i = e.rng) == null ? void 0 : i.call(e)) ?? mo();
  if (r.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, yo(r);
}
const ho = ".cortex", Q = () => `${Nt()}/${ho}`, So = (e) => {
  const n = /* @__PURE__ */ new Map();
  e.forEach((r) => {
    n.set(r.id, { ...r, children: [] });
  });
  const t = [];
  return e.forEach((r) => {
    if (r.documentParentId) {
      const i = n.get(r.documentParentId), o = n.get(r.id);
      i && o && i.children.push(o);
    } else
      t.push(n.get(r.id));
  }), t;
}, vt = async () => {
  const e = Q();
  if (await P.ensureDir(e), await wo()) {
    const t = `${e}/config.json`, r = await P.readFile(t, "utf-8"), i = JSON.parse(r);
    return So(i);
  } else
    return await vo();
}, wo = async () => {
  const e = Q();
  await P.ensureDir(e);
  const n = `${e}/config.json`;
  try {
    return await Ge.access(n).then(() => !0).catch(() => !1);
  } catch {
    return !1;
  }
}, vo = async () => {
  const e = Q();
  await P.ensureDir(e);
  const n = `${e}/config.json`;
  await P.writeFile(
    n,
    JSON.stringify([
      {
        id: "welcome",
        title: "Welcome",
        content: "Welcome to Cortex Docs",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ])
  );
  const t = `${e}/welcome.json`, r = _.join(
    process.env.APP_ROOT || process.cwd(),
    "lib",
    "constants",
    "welcome.json"
  );
  console.log("Creating welcome file at:", t), console.log("Reading from constants path:", r);
  try {
    const o = await Ge.readFile(r, "utf-8");
    await P.writeFile(t, o), console.log("Successfully created welcome.json file");
  } catch (o) {
    console.error("Error creating welcome.json:", o);
    const c = JSON.stringify([
      {
        type: "paragraph",
        content: "Welcome to Cortex Docs!"
      }
    ]);
    await P.writeFile(t, c), console.log("Created welcome.json with fallback content");
  }
  return await vt();
}, po = async (e) => {
  const { documentParentId: n, title: t = "New note" } = e, r = Q();
  await P.ensureDir(r);
  let i;
  n ? i = {
    id: Oe(),
    title: t,
    documentParentId: n,
    contentId: Oe(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : i = {
    id: Oe(),
    title: t,
    contentId: Oe(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const o = `${r}/config.json`, c = await P.readFile(o, "utf-8"), s = JSON.parse(c);
  s.push(i), await P.writeFile(o, JSON.stringify(s, null, 2));
  const u = `${r}/${i.id}.json`;
  return await P.writeFile(
    u,
    JSON.stringify(
      [
        {
          type: "paragraph",
          content: ""
        }
      ],
      null,
      2
    )
  ), i;
}, Eo = async (e) => {
  const { id: n } = e, t = Q();
  await P.ensureDir(t);
  try {
    const r = `${t}/config.json`, i = await P.readFile(r, "utf-8"), o = JSON.parse(i), c = go(o, n);
    c.push(n);
    const s = o.filter(
      (u) => !c.includes(u.id)
    );
    await P.writeFile(r, JSON.stringify(s, null, 2));
    for (const u of c) {
      const m = `${t}/${u}.json`;
      try {
        await Ge.unlink(m), console.log(`Deleted document file: ${u}.json`);
      } catch {
        console.log(`Document file ${u}.json not found, skipping deletion`);
      }
    }
    return !0;
  } catch (r) {
    return console.error("Error deleting document:", r), !1;
  }
}, go = (e, n) => {
  const t = [], r = (i) => {
    e.filter((c) => c.documentParentId === i).forEach((c) => {
      t.push(c.id), r(c.id);
    });
  };
  return r(n), t;
}, $o = async (e) => {
  const { id: n, updates: t } = e, r = Q();
  await P.ensureDir(r);
  try {
    const i = `${r}/config.json`, o = await P.readFile(i, "utf-8"), c = JSON.parse(o), s = c.findIndex((u) => u.id === n);
    return s !== -1 ? (c[s] = {
      ...c[s],
      ...t,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }, await P.writeFile(i, JSON.stringify(c, null, 2)), !0) : !1;
  } catch (i) {
    return console.error("Error updating document:", i), !1;
  }
}, Oo = async (e) => {
  const n = Q();
  await P.ensureDir(n);
  const { docId: t } = e, r = `${n}/${t}.json`, i = await P.readFile(r, "utf-8");
  return JSON.parse(i);
}, Fo = async (e) => {
  const n = Q();
  await P.ensureDir(n);
  const { docId: t, content: r } = e, i = `${n}/${t}.json`;
  try {
    return await P.writeFile(i, JSON.stringify(r, null, 2)), { success: !0 };
  } catch (o) {
    throw console.error("Error saving file content:", o), new Error("Failed to save file content");
  }
}, Po = async (e) => {
  const { query: n } = e, t = Q();
  await P.ensureDir(t);
  try {
    const r = `${t}/config.json`, i = await P.readFile(r, "utf-8"), o = JSON.parse(i), c = [], s = n.toLowerCase();
    for (const u of o) {
      if (u.title.toLowerCase().includes(s)) {
        c.push({ ...u, matchType: "title" });
        continue;
      }
      if (u.contentId)
        try {
          const m = `${t}/${u.id}.json`, a = await P.readFile(m, "utf-8"), l = JSON.parse(a);
          JSON.stringify(l).toLowerCase().includes(s) && c.push({ ...u, matchType: "content" });
        } catch {
          console.log(
            `Content file for ${u.id} not found, skipping content search`
          );
        }
    }
    return c.sort((u, m) => u.matchType === "title" && m.matchType === "content" ? -1 : u.matchType === "content" && m.matchType === "title" ? 1 : u.title.localeCompare(m.title)), c.map((u) => {
      const m = { ...u };
      return delete m.matchType, m;
    });
  } catch (r) {
    return console.error("Error searching documents:", r), [];
  }
}, pt = Y.dirname(Ft(import.meta.url));
process.env.APP_ROOT = Y.join(pt, "..");
const qe = process.env.VITE_DEV_SERVER_URL, Uo = Y.join(process.env.APP_ROOT, "dist-electron"), Et = Y.join(process.env.APP_ROOT, "dist"), Do = () => {
  const e = process.platform, n = process.env.APP_ROOT;
  switch (e) {
    case "win32":
      return Y.join(n, "public", "icons", "win", "icon.ico");
    case "darwin":
      return Y.join(n, "public", "icons", "mac", "icon.icns");
    case "linux":
    default:
      return Y.join(n, "public", "icons", "png", "256x256.png");
  }
}, ko = Do();
process.env.VITE_PUBLIC = qe ? Y.join(process.env.APP_ROOT, "public") : Et;
let p;
function Tn() {
  p = new Ve({
    width: 1200,
    height: 670,
    show: !1,
    autoHideMenuBar: !0,
    center: !0,
    title: "Cortex - Notes App",
    frame: !1,
    vibrancy: "under-window",
    visualEffectState: "active",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 10 },
    transparent: !0,
    // backgroundColor: "#00000000",
    icon: ko,
    webPreferences: {
      preload: Y.join(pt, "preload.mjs"),
      sandbox: !0,
      contextIsolation: !0
    }
  }), p.on("ready-to-show", () => {
    p == null || p.show();
  }), p.webContents.setWindowOpenHandler((e) => (Ot.openExternal(e.url), { action: "deny" })), p.webContents.on("did-finish-load", () => {
    p == null || p.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), G.handle("give-me-docs", async () => await vt()), G.handle("create-doc", async (e, n) => await po(n)), G.handle("delete-doc", async (e, n) => await Eo(n)), G.handle("update-doc", async (e, n) => await $o(n)), G.handle("get-file-content", async (e, n) => await Oo(n)), G.handle("save-file-content", async (e, n) => await Fo(n)), G.handle("search-documents", async (e, n) => await Po(n)), G.on("win:minimize", () => {
    p == null || p.minimize();
  }), G.on("win:maximize", async () => {
    (p == null ? void 0 : p.isMaximized()) ? p == null || p.unmaximize() : p == null || p.maximize();
  }), G.on("win:close", () => {
    p == null || p.close();
  }), qe ? p.loadURL(qe) : p.loadFile(Y.join(Et, "index.html"));
}
H.on("window-all-closed", () => {
  process.platform !== "darwin" && (H.quit(), p = null);
});
H.whenReady().then(() => {
  It.setAppUserModelId("com.electron"), H.on("browser-window-created", (e, n) => {
    _t.watchWindowShortcuts(n);
  }), Tn(), H.on("activate", function() {
    Ve.getAllWindows().length === 0 && Tn();
  });
});
export {
  Uo as MAIN_DIST,
  Et as RENDERER_DIST,
  qe as VITE_DEV_SERVER_URL
};
