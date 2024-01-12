# Selling books application

## Description
This is a simple application for selling books. It have a simple interface and a simple database. The application is written in Python.

## Installation & running
To install the application you need to download the repository and install the requirements. To do this, run the following commands in the terminal:
```
git clone https://github.com/mm3906078/bookshelf.git
cd bookshelf
docker compose up -d
```

If you don't have docker, you can install it by following the instructions on the official website: https://docs.docker.com/get-docker/

If you don't want to use docker, you can install the application using the following commands:
```
git clone https://github.com/mm3906078/bookshelf.git
cd bookshelf
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Setup env file
You need to create a .env file in the root directory of the project. Like this:
```
POSTGRES_PASSWORD=backend-pass
POSTGRES_USER=backend
POSTGRES_DB=bookshelf
POSTGRES_PORT=5432
POSTGRES_HOST=127.0.0.1
TOKEN_SECRET=fake-secret
```
if you using docker, you need to change `POSTGRES_HOST` value to from `127.0.0.1` to `postgres`.

## Usage
You can acsess the application swagger by following link: http://localhost:5000/apidocs/.

## Development
```
docker compose up -d --force-recreate --no-deps --build
```
