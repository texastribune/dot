(function () {
  var win = window;

  if (!win.ttDotTracked) {
    var doc = document;
    var e = encodeURIComponent;
    var attr = 'data-dot-token';
    var loc = win.location;
    var currentScript =
      doc.currentScript || doc.querySelector('script[' + attr + ']');
    var url = e(loc.protocol + '//' + loc.host + loc.pathname);
    var token = e(currentScript.getAttribute(attr) || '');
    var img = new win.Image(1, 1);
    var src = currentScript.getAttribute('data-dot-url') + '/pixel.gif?';

    src += 'url=' + url + '&';
    src += 'token=' + token;

    img.src = src;
    win.ttDotTracked = true;
  }
})();
