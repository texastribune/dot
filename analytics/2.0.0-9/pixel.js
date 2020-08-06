(function () {
  var win = window;

  if (!win.ttDotTracked) {
    var doc = document;
    var e = encodeURIComponent;
    var attr = 'data-dot-token';
    var loc = win.location;
    var currentScript =
      doc.currentScript || doc.querySelector('script[' + attr + ']');
    var scriptParts = currentScript.getAttribute('src').split('/');

    var domain = e(loc.hostname);
    var version = e(scriptParts[scriptParts.length - 2]);
    var token = e(currentScript.getAttribute(attr) || '');
    var referrer = e(doc.referrer);

    var img = new win.Image(1, 1);
    var src = currentScript.getAttribute('data-dot-url') + '/pixel.gif?';
    src += 'domain=' + domain + '&';
    src += 'version=' + version + '&';
    src += 'token=' + token;

    if (referrer) {
      src += '&' + 'referrer=' + referrer;
    }

    img.src = src;

    win.ttDotTracked = true;
  }
})();
