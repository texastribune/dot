import requests
import os
import io
import base64
import urllib.parse

from flask import Flask, request, send_file, make_response
from flask_apscheduler import APScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from collections import Counter


app = Flask(__name__)
app.config['SCHEDULER_TIMEZONE'] = 'UTC'
scheduler = APScheduler(scheduler=BackgroundScheduler(timezone='UTC'), app=app)
scheduler.start()
store = Counter()
interval = int(os.environ.get('INTERVAL', 600))
endpoint = os.environ.get('ENDPOINT')


@app.route("/pixel.gif")
def pixel():
    """Records page views using query params as the key."""
    # Record View
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
    """Attempts to flush `store` to external API at given interval."""
    global store

    # Log `store`.
    for x in store:
        print(f"{store[x]}:\t{x}")

    # NO-OP if no `endpoint` or `store`.
    if not endpoint or not store:
        print("••• skipping flush •••")
        return

    # Clear `store`.
    data, store = store, Counter()

    # Attempt flush to `endpoint`. Reset `store` if failed.
    try:
        r = requests.post(endpoint, json=dict(store))
        r.raise_for_status()
        print("••• flushed •••")
    except Exception as e:
        print(f"••• flush failed: {e}")
        # Merge `data` back into `store`, which may have been updated.
        store += data
