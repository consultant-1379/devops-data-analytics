# Use the official Python image as the base image
FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/python:3.9.4-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /usr/src/app

RUN pip install poetry

COPY poetry.lock pyproject.toml /usr/src/app/

# We turn off virtual env as not needed inside the container
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-dev

# Copy the Django project files to the working directory
COPY ./oris/backend/djangoDoda/ /usr/src/app/

# Expose port 3000 to allow communication to/from server
EXPOSE 3000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:3000"]
