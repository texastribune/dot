!(function (t) {
  function e(n) {
    if (r[n]) return r[n].exports;
    var o = (r[n] = { i: n, l: !1, exports: {} });
    return t[n].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
  }
  var r = {};
  (e.m = t),
    (e.c = r),
    (e.d = function (t, r, n) {
      e.o(t, r) ||
        Object.defineProperty(t, r, {
          configurable: !1,
          enumerable: !0,
          get: n,
        });
    }),
    (e.n = function (t) {
      var r =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return e.d(r, 'a', r), r;
    }),
    (e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (e.p = '/'),
    e((e.s = 'Kati'));
})({
  Kati: function (t, e, r) {
    'use strict';
    Object.defineProperty(e, '__esModule', { value: !0 });
    var n = r('shOH');
    Object(n.a)();
  },
  shOH: function (t, e, r) {
    'use strict';
    function n() {
      var t = window;
      if (!t._ttDotTracked) {
        var e = document,
          r = encodeURIComponent,
          n = 'data-tt-canonical',
          o = t.location,
          c = r(o.protocol + '//' + o.host + o.pathname),
          a = r(e.referrer),
          u = r(o.search),
          i = e.currentScript || e.querySelector('script[' + n + ']'),
          s = r(i.getAttribute(n) || '');
        (new t.Image(1, 1).src =
          'https://dot.texastribune.org/dot.gif?url=' +
          c +
          '&ref=' +
          a +
          '&query=' +
          u +
          '&canonical=' +
          s),
          (t._ttDotTracked = !0);
      }
    }
    e.a = n;
  },
});
//# sourceMappingURL=dot.min.55eef7d282ec435600d1.js.map
