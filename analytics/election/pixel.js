(function () {
  var win = window;

  if (!win.ttDotTracked) {
    var doc = document;
    var e = encodeURIComponent;
    var attr = 'data-dot-contest';
    var loc = win.location;
    var currentScript = doc.querySelector('script[' + attr + ']');
    var scriptSrcParts = currentScript.src.split('/');

    var img = new win.Image(1, 1);
    var imgSrc = scriptSrcParts[0] + '//' + scriptSrcParts[2] + '/pixel.gif?';
    var domain = e(loc.hostname);
    var contest = e(currentScript.getAttribute(attr) || '');

    imgSrc += 'domain=' + domain + '&';
    imgSrc += 'contest=' + contest;

    img.src = imgSrc;
    win.ttDotTracked = true;
  }
})();
