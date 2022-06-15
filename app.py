import requests
import argparse
import io
import base64
import urllib.parse

from flask import Flask, request, send_file, make_response
from flask_apscheduler import APScheduler
from collections import Counter

app = Flask(__name__)
scheduler = APScheduler()
store = Counter()
parser = argparse.ArgumentParser()
parser.add_argument('-i', '--interval', type=int,
                    default=600, help='interval (in seconds) between each flush.')
parser.add_argument('-e', '--endpoint', required=True,
                    help='the endpoint which will accept flushed data.')
args = parser.parse_args()


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


@scheduler.task('interval', id='flush', seconds=args.interval)
def flush():
    """Attempts to flush `store` to external API at given interval."""
    global store

    # NO-OP if no `endpoint` or `store`.
    if not args.endpoint or not store:
        return

    # Clear/Log `store`.
    data, store = store, Counter()
    for x in data:
        print(f"{data[x]}:\t{x}")

    # Attempt flush to `endpoint`. Reset `store` if failed.
    try:
        r = requests.post(args.endpoint, json=dict(store))
        r.raise_for_status()
        print("••• flushed •••")
    except Exception as e:
        print(f"••• flush failed: {e}")
        # Merge `data` back into `store`, which may have been updated.
        store += data


if __name__ == '__main__':
    print(f"••• endpoint: {args.endpoint}")
    print(f"••• interval: {args.interval} seconds")
    scheduler.start()
    app.run()
