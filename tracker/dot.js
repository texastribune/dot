/* global window, document */
/* eslint-disable no-underscore-dangle */

export default function dotTracker() {
  const win = window;
  const isDev = process.env.NODE_ENV === 'development';

  if (!win._ttDotTracked) {
    const doc = document;
    const e = encodeURIComponent;
    const attr = 'data-tt-canonical';
    const loc = win.location;
    const url = e(`${loc.protocol}//${loc.host}${loc.pathname}`);
    const ref = e(doc.referrer);
    const query = e(loc.search);
    const currentScript =
      doc.currentScript || doc.querySelector(`script[${attr}]`);
    const canonical = e(currentScript.getAttribute(attr) || '');
    const img = new win.Image(1, 1);
    const scriptLocation = isDev ? '' : 'https://dot.texastribune.org';

    img.src = `${scriptLocation}/dot.gif?url=${url}&ref=${ref}&query=${query}&canonical=${canonical}`;
    win._ttDotTracked = true;
  }
}
