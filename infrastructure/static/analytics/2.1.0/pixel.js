(function () {
  var win = window;

  if (!win.ttDotTracked) {
    var doc = document;
    var e = encodeURIComponent;
    var attr = 'data-dot-token';
    var loc = win.location;
    var currentScript =
      doc.currentScript || doc.querySelector('script[' + attr + ']');
    var scriptSrcParts = currentScript.src.split('/');

    var img = new win.Image(1, 1);
    var imgSrc = scriptSrcParts[0] + '//' + scriptSrcParts[2] + '/pixel.gif?';
    var domain = e(loc.hostname);
    var token = e(currentScript.getAttribute(attr) || '');

    imgSrc += 'domain=' + domain + '&';
    imgSrc += 'token=' + token;

    img.src = imgSrc;
    win.ttDotTracked = true;
  }
})();
