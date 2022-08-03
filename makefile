# Set application runtime environment variables
INTERVAL=5
ENDPOINT=https://jsonplaceholder.typicode.com/posts

# Set the host port for the dev container
HOST_PORT=8000

dev: build
	docker run \
		--rm -it \
		--name dot-container \
		-p ${HOST_PORT}:8888 \
		-v "$$(pwd)/src:/usr/src/app" \
			-e FLASK_ENV=development \
			-e FLASK_APP=app \
			-e INTERVAL=${INTERVAL} \
			-e ENDPOINT=${ENDPOINT} \
		dot

build:
	docker build -t dot ./src


ping:
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?a" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?b=x" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?b=x" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null
	curl -v "http://localhost:${HOST_PORT}/pixel.gif?c=y&d=z" -o /dev/null

# Terraform commands for working/developing infrastructure locally
## format terraform code
terraform/format:
	terraform fmt --recursive infrastructure
## initialize terraform, installs plugins & connects to remote backend
terraform/init:
	terraform -chdir=infrastructure init
## speculative plan to show locally what would happen on terraform apply
terraform/plan:
	terraform -chdir=infrastructure plan
