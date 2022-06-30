# Set application runtime environment variables
INTERVAL=5
ENDPOINT=https://jsonplaceholder.typicode.com/posts

# Set the host port for localdev to be configurable if a certain port is in use already (5000 on macs, the default for flask, seems to be used by Apple)
HOST_PORT=5001

dev: build
	docker run \
		--rm -it \
		--name dot-container \
		-p ${HOST_PORT}:5000 \
		-v "$$(pwd):/usr/src/app" \
			-e FLASK_ENV=development \
			-e FLASK_APP=app \
			-e INTERVAL=${INTERVAL} \
			-e ENDPOINT=${ENDPOINT} \
		dot

build:
	docker build -t dot .


ping:
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?a" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?b=x" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?b=x" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null