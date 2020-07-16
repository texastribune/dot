(function () {
  var win = window;

  if (!win.ttDotTracked) {
    var doc = document;
    var e = encodeURIComponent;
    var attr = 'data-dot-token';
    var loc = win.location;
    var currentScript =
      doc.currentScript || doc.querySelector('script[' + attr + ']');
    var domain = e(loc.hostname);
    var token = e(currentScript.getAttribute(attr) || '');
    var img = new win.Image(1, 1);
    var src = currentScript.getAttribute('data-dot-url') + '/pixel.gif?';

    src += 'domain=' + domain + '&';
    src += 'token=' + token;

    img.src = src;
    win.ttDotTracked = true;
  }
})();
