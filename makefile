build:
	python app.py -i 5 -e https://jsonplaceholder.typicode.com/posts

ping:
	curl http://127.0.0.1:5000/pixel.gif?a -s -o /dev/null
	curl http://127.0.0.1:5000/pixel.gif?b=x -s -o /dev/null
	curl http://127.0.0.1:5000/pixel.gif?b=x -s -o /dev/null
	curl "http://127.0.0.1:5000/pixel.gif?c=y&d=z" -s -o /dev/null
	curl "http://127.0.0.1:5000/pixel.gif?c=y&d=z" -s -o /dev/null
	curl "http://127.0.0.1:5000/pixel.gif?c=y&d=z" -s -o /dev/null