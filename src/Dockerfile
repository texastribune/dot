FROM python:3-alpine

WORKDIR /usr/src/app

# Flask default port runs on 5000
# EXPOSE for documentation, or to run "docker run -P..." to automatically map to an open host port
EXPOSE 5000

# Install requirements
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy Application Files
COPY ./ .

# Start Flask App
CMD [ "flask", "run", "--host=0.0.0.0"]