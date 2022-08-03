import requests
import os
import io
import base64
import urllib.parse
import logging

from flask import Flask, request, send_file, make_response
from flask_apscheduler import APScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from collections import Counter

# https://stackoverflow.com/questions/42257942/using-flask-apscheduler-with-gunicorn
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')
logger= logging.getLogger(__name__)


app = Flask(__name__)
app.config['SCHEDULER_TIMEZONE'] = 'UTC'
scheduler = APScheduler(scheduler=BackgroundScheduler(timezone='UTC'), app=app)
scheduler.start()
store = Counter()
interval = int(os.environ.get('INTERVAL', 600))
endpoint = os.environ.get('ENDPOINT')


logger.info("INTERVAL: %s seconds", interval)


@app.route("/pixel.gif")
def pixel():
    """Records page views using query params as the key."""
    # Record View
    logger.info("*INFO get request*")

    key = urllib.parse.urlencode(request.args)
    store[key] += 1

    # Generate GIF
    response = make_response(
        send_file(
            # https://stackoverflow.com/questions/6018611/smallest-data-uri-image-possible-for-a-transparent-image
            io.BytesIO(base64.b64decode(
                "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")),
            mimetype='image/gif',
        )
    )

    # Bust Cache
    # https://stackoverflow.com/questions/49547/how-do-we-control-web-page-caching-across-all-browsers
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response


@scheduler.task('interval', id='flush', seconds=interval)
def flush():
    logger.debug("FLUSH function started...")
    """Attempts to flush `store` to external API at given interval."""
    global store

    # Log `store`.
    for x in store:
        logger.info(f"{store[x]}:\t{x}")

    # NO-OP if no `endpoint` or `store`.
    if not endpoint or not store:
        logger.info("••• skipping flush •••")
        return

    # Clear `store`.
    data, store = store, Counter()

    # Attempt flush to `endpoint`. Reset `store` if failed.
    try:
        r = requests.post(endpoint, json=dict(store))
        r.raise_for_status()
        logger.info("••• flushed •••")
    except Exception as e:
        logger.info(f"••• flush failed: {e}")
        # Merge `data` back into `store`, which may have been updated.
        store += data

#  When gunicorn is running as the startup command,
#  this conditional is coming back false and not being 
#  run.  Commenting out for now to avoid confusion
#  about whether or not this is running/being used.
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host='0.0.0.0', port=port, debug=True)