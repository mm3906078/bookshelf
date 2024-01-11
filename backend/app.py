#!/usr/bin/env python3
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json, random
import uuid
import logging
import psycopg2
import datetime
import tokenlib
import os
from flasgger import Swagger, LazyJSONEncoder
from flasgger import swag_from
from dotenv import load_dotenv

# Check if environment variables are not set import them from .env file
if not os.getenv("POSTGRES_USER") and not os.getenv(
        "POSTGRES_PASSWORD") and not os.getenv(
            "POSTGRES_HOST") and not os.getenv(
                "POSTGRES_PORT") and not os.getenv("POSTGRES_DB"):
    dotenv_path = os.path.join(os.getcwd(), '../.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)

app = Flask(__name__)
CORS(app)

app.json_encoder = LazyJSONEncoder

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Bookstore API",
        "description": "API Documentation for Bookstore",
        "contact": {
            "name": "Mohammad Reza Mollasalehi",
            "email": "info@mrsalehi.info",
            "url": "https://info@mrsalehi.info",
        },
        "version": "1.0",
        "basePath": "http://localhost:5000",
    },
    "schemes": ["http"],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": 'Enter your token'
        }
    }
}

swagger_config = {
    "headers": [
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', "GET, POST"),
    ],
    "specs": [{
        "endpoint": 'apispec',
        "route": '/apispec.json',
        "rule_filter": lambda rule: True,
        "model_filter": lambda tag: True,
    }],
    "static_url_path":
    "/flasgger_static",
    "swagger_ui":
    True,
    "specs_route":
    "/apidocs/",
}
swagger = Swagger(app, template=swagger_template, config=swagger_config)

level = logging.DEBUG
logging_format = "[%(levelname)s] %(asctime)s - %(message)s"
logging.basicConfig(level=level, format=logging_format)

TOKEN_SECRET = os.getenv("TOKEN_SECRET")


def db_connect():
    try:
        connection = psycopg2.connect(user=os.getenv("POSTGRES_USER"),
                                      password=os.getenv("POSTGRES_PASSWORD"),
                                      host=os.getenv("POSTGRES_HOST"),
                                      port=os.getenv("POSTGRES_PORT"),
                                      database=os.getenv("POSTGRES_DB"))

        cursor = connection.cursor()
        logging.info("Connected to PostgreSQL database!")
    except (Exception, psycopg2.Error) as error:
        logging.error("Error while connecting to PostgreSQL", error)

    return connection, cursor


def db_disconnect(cursor, connection):
    if (connection):
        cursor.close()
        connection.close()
        logging.info("PostgreSQL connection is closed")


def create_user_table():
    connection, cursor = db_connect()
    try:
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS users (uuid varchar PRIMARY KEY, email varchar, password varchar, role varchar, name varchar, family varchar, address varchar);"
        )
        logging.info("Table users created successfully!")
        connection.commit()
        db_disconnect(cursor, connection)
        return True
    except (Exception, psycopg2.Error) as error:
        logging.error("Error while creating table users", error)
        db_disconnect(cursor, connection)
        return False


def create_books_table():
    connection, cursor = db_connect()
    try:
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS books (book_id varchar PRIMARY KEY, title varchar, author varchar, year varchar, genre varchar);"
        )
        logging.info("Table books created successfully!")
        connection.commit()
        db_disconnect(cursor, connection)
        return True
    except (Exception, psycopg2.Error) as error:
        logging.error("Error while creating table books", error)
        db_disconnect(cursor, connection)
        return False


def order_book_table():
    connection, cursor = db_connect()
    try:
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS orders (order_id varchar PRIMARY KEY, book_id varchar, user_id varchar, order_date varchar);"
        )
        logging.info("Table orders created successfully!")
        connection.commit()
        db_disconnect(cursor, connection)
        return True
    except (Exception, psycopg2.Error) as error:
        logging.error("Error while creating table orders", error)
        db_disconnect(cursor, connection)
        return False


def create_comments_table():
    connection, cursor = db_connect()
    try:
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS comments (book_id varchar, user_id varchar, comment varchar);"
        )
        logging.info("Table comments created successfully!")
        connection.commit()
        db_disconnect(cursor, connection)
        return True
    except (Exception, psycopg2.Error) as error:
        logging.error("Error while creating table comments", error)
        db_disconnect(cursor, connection)
        return False


def db_init():
    # Create user table
    if create_user_table():
        # Create books table
        if create_books_table():
            # Create orders table
            if order_book_table():
                # Create comments table
                if create_comments_table():
                    return True


@swag_from("docs/users/signup.yml")
@app.route('/users/signup', methods=['POST'])
def signup():
    request_data = request.get_json()
    # Check if email and password are provided
    if not ('email' in request_data and 'password' in request_data):
        return "Email and password are required!", 400
    # Get name, family, email, password, address from request
    if 'firstName' in request_data:
        name = request_data['firstName']
    else:
        name = None
    if 'lastName' in request_data:
        family = request_data['lastName']
    else:
        family = None
    email = request_data['email']
    password = request_data['password']
    if 'address' in request_data:
        address = request_data['address']
    else:
        address = None
    if 'role' in request_data:
        if request_data['role'] == 'admin':
            role = 'admin'
        elif request_data['role'] == 'user':
            role = 'user'
        else:
            return "Role can be either admin or user!", 400

    #Generate uuid
    user_id = str(uuid.uuid4())

    # Connect to database
    connection, cursor = db_connect()

    # check if user exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email, ))
    user = cursor.fetchone()
    if user:
        # Get user_id from database
        cursor.execute("SELECT uuid FROM users WHERE email = %s", (email, ))
        user_id = cursor.fetchone()[0]
        db_disconnect(cursor, connection)
        return user_id, 409
    else:
        # Insert user to database
        cursor.execute("INSERT INTO users VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       (user_id, email, password, role, name, family, address))
        connection.commit()
        db_disconnect(cursor, connection)
        result = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "name": name,
            "family": family,
            "address": address
        }
        return result, 200


@swag_from("docs/users/login.yml")
@app.route('/users/login', methods=['POST'])
def login():
    request_data = request.get_json()
    # Check if email and password are provided
    if not ('email' in request_data and 'password' in request_data):
        return "Email and password are required!", 400
    # Get email and password from request
    email = request_data['email']
    password = request_data['password']

    # Connect to database
    connection, cursor = db_connect()

    # check if user exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email, ))
    user = cursor.fetchone()
    if user:
        # Get password from database
        cursor.execute("SELECT password FROM users WHERE email = %s",
                       (email, ))
        db_password = cursor.fetchone()[0]
        if db_password == password:
            # Get user_id from database
            cursor.execute("SELECT uuid FROM users WHERE email = %s",
                           (email, ))
            user_id = cursor.fetchone()[0]
            db_disconnect(cursor, connection)
            # Generate token
            token = tokenlib.make_token({'user_id': user_id},
                                        secret=TOKEN_SECRET)
            return {"token": token, "user_id": user_id}, 200
        else:
            db_disconnect(cursor, connection)
            return "Wrong password!", 401
    else:
        db_disconnect(cursor, connection)
        return "User not found!", 404


@swag_from("docs/users/list.yml")
@app.route('/users/list', methods=['GET'])
def list_users():
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
        connection, cursor = db_connect()
        cursor.execute("SELECT role FROM users WHERE uuid = %s", (user_id, ))
        role = cursor.fetchone()[0]
        if role != 'admin':
            db_disconnect(cursor, connection)
            return "Only admin can list users!", 403
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Get all users from database
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    db_disconnect(cursor, connection)
    result = []
    for user in users:
        result.append({
            "user_id": user[0],
            "email": user[1],
            "role": user[3],
            "name": user[4],
            "family": user[5],
            "address": user[6]
        })
    return result, 200


@swag_from("docs/books/search.yml")
@app.route('/books/search', methods=['POST'])
def search_books():
    request_data = request.get_json()
    args = {}
    # Check the query parameters
    if 'title' in request_data:
        title = request_data['title']
        args["title"] = title
    if 'author' in request_data:
        author = request_data['author']
        args["author"] = author
    if 'year' in request_data:
        year = request_data['year']
        args["year"] = year
    if 'genre' in request_data:
        genre = request_data['genre']
        args["genre"] = genre

    logging.info(args)

    # Connect to database
    connection, cursor = db_connect()

    # Get books from database if query parameters are provided
    if len(args) > 0:
        cursor.execute(
            "SELECT * FROM books WHERE " + " AND ".join("{} = %s".format(k)
                                                        for k in args.keys()),
            list(args.values()))
        books = cursor.fetchall()
        db_disconnect(cursor, connection)
        return books, 200
    else:
        # Get all books from database
        cursor.execute("SELECT * FROM books")
        books = cursor.fetchall()
        db_disconnect(cursor, connection)
        return books, 200


@swag_from("docs/books/list.yml")
@app.route('/books/list', methods=['GET'])
def list_books():
    # Connect to database
    connection, cursor = db_connect()

    # Get all books from database
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    db_disconnect(cursor, connection)
    result = []
    for book in books:
        result.append({
            "book_id": book[0],
            "title": book[1],
            "author": book[2],
            "year": book[3],
            "genre": book[4]
        })
    return result, 200


@swag_from("docs/books/add.yml")
@app.route('/books/add', methods=['POST'])
def add_book():
    request_data = request.get_json()
    # Check if title, author, year and genre are provided
    if not ('title' in request_data and 'author' in request_data
            and 'year' in request_data and 'genre' in request_data):
        return "Title, author, year and genre are required!", 400
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    # Get title, author, year and genre from request
    title = request_data['title']
    author = request_data['author']
    year = request_data['year']
    genre = request_data['genre']
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
        connection, cursor = db_connect()
        cursor.execute("SELECT role FROM users WHERE uuid = %s", (user_id, ))
        role = cursor.fetchone()[0]
        if role != 'admin':
            db_disconnect(cursor, connection)
            return "Only admin can add books!", 403
    except:
        return "Invalid token!", 401

    #Generate uuid
    book_id = str(uuid.uuid4())

    # Connect to database
    connection, cursor = db_connect()

    # Insert book to database
    cursor.execute("INSERT INTO books VALUES (%s, %s, %s, %s, %s)",
                   (book_id, title, author, year, genre))
    connection.commit()
    db_disconnect(cursor, connection)
    result = {
        "book_id": book_id,
        "title": title,
        "author": author,
        "year": year,
        "genre": genre
    }
    return result, 200


@swag_from("docs/books/delete.yml")
@app.route('/books/delete/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
        connection, cursor = db_connect()
        cursor.execute("SELECT role FROM users WHERE uuid = %s", (user_id, ))
        role = cursor.fetchone()[0]
        if role != 'admin':
            db_disconnect(cursor, connection)
            return "Only admin can delete books!", 403
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Delete book from database
    cursor.execute("DELETE FROM books WHERE book_id = %s", (book_id, ))
    connection.commit()
    db_disconnect(cursor, connection)
    result = {"book_id": book_id}
    return result, 200


@swag_from("docs/books/order.yml")
@app.route("/books/order/<book_id>", methods=['POST'])
def order_book(book_id):
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Get current date in timestamp
    now = datetime.datetime.now().timestamp()

    #Generate uuid
    order_id = str(uuid.uuid4())

    # Connect to database
    connection, cursor = db_connect()

    # Insert order to database
    cursor.execute("INSERT INTO orders VALUES (%s, %s, %s, %s)",
                   (order_id, book_id, user_id, now))
    connection.commit()
    db_disconnect(cursor, connection)
    result = {
        "order_id": order_id,
        "book_id": book_id,
        "user_id": user_id,
        "order_date": now
    }
    return result, 200


@swag_from("docs/orders/list_all.yml")
@app.route("/orders/list_all", methods=['GET'])
def list_all_orders():
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
        connection, cursor = db_connect()
        cursor.execute("SELECT role FROM users WHERE uuid = %s", (user_id, ))
        role = cursor.fetchone()[0]
        if role != 'admin':
            db_disconnect(cursor, connection)
            return "Only admin can list all orders!", 403
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Get all orders from database
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    db_disconnect(cursor, connection)
    result = []
    for order in orders:
        result.append({
            "order_id": order[0],
            "book_id": order[1],
            "user_id": order[2],
            "order_date": order[3]
        })
    return result, 200


@swag_from("docs/orders/list.yml")
@app.route("/orders/list", methods=['GET'])
def list_my_orders():
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Get all orders from database
    cursor.execute("SELECT * FROM orders WHERE user_id = %s", (user_id, ))
    orders = cursor.fetchall()
    db_disconnect(cursor, connection)
    result = []
    for order in orders:
        result.append({
            "order_id": order[0],
            "book_id": order[1],
            "user_id": order[2],
            "order_date": order[3]
        })
    return result, 200


@swag_from("docs/orders/delete.yml")
@app.route("/orders/delete/<order_id>", methods=['DELETE'])
def delete_order(order_id):
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Check if order exists
    cursor.execute("SELECT * FROM orders WHERE order_id = %s", (order_id, ))
    order = cursor.fetchone()
    if not order:
        db_disconnect(cursor, connection)
        return "Order not found!", 404

    # Delete order from database
    cursor.execute("DELETE FROM orders WHERE order_id = %s", (order_id, ))
    connection.commit()
    db_disconnect(cursor, connection)
    return order_id, 200


@swag_from("docs/comments/add.yml")
@app.route("/comments/add/<book_id>", methods=['POST'])
def add_comment(book_id):
    request_data = request.get_json()
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']
    # Check if comment is provided
    if not 'comment' in request_data:
        return "Comment is required!", 400

    # Get comment from request
    comment = request_data['comment']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Check if book exists
    connection, cursor = db_connect()
    cursor.execute("SELECT * FROM books WHERE book_id = %s", (book_id, ))
    book = cursor.fetchone()
    if not book:
        db_disconnect(cursor, connection)
        return "Book not found!", 404

    # Check if comment exists
    cursor.execute(
        "SELECT * FROM comments WHERE book_id = %s AND user_id = %s",
        (book_id, user_id))
    comment = cursor.fetchone()
    if comment:
        db_disconnect(cursor, connection)
        return "Comment already exists!", 409

    # Connect to database
    connection, cursor = db_connect()

    # Insert comment to database
    cursor.execute("INSERT INTO comments VALUES (%s, %s, %s)",
                   (book_id, user_id, comment))
    connection.commit()
    db_disconnect(cursor, connection)
    return book_id, 200


@swag_from("docs/comments/list.yml")
@app.route("/comments/list/<book_id>", methods=['GET'])
def list_comments(book_id):
    # Connect to database
    connection, cursor = db_connect()

    # Get all comments from database
    cursor.execute("SELECT * FROM comments WHERE book_id = %s", (book_id, ))
    comments = cursor.fetchall()
    db_disconnect(cursor, connection)
    result = []
    for comment in comments:
        result.append({
            "book_id": comment[0],
            "user_id": comment[1],
            "comment": comment[2]
        })
    return result, 200


@swag_from("docs/comments/delete.yml")
@app.route("/comments/delete/<book_id>", methods=['DELETE'])
def delete_comment(book_id):
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Connect to database
    connection, cursor = db_connect()

    # Check if comment exists
    cursor.execute("SELECT * FROM comments WHERE book_id = %s", (book_id, ))
    comment = cursor.fetchone()
    if not comment:
        db_disconnect(cursor, connection)
        return "Comment not found!", 404

    # Delete comment from database
    cursor.execute("DELETE FROM comments WHERE book_id = %s", (book_id, ))
    connection.commit()
    db_disconnect(cursor, connection)
    return book_id, 200


@swag_from("docs/comments/update.yml")
@app.route("/comments/update/<book_id>", methods=['PUT'])
def update_comment(book_id):
    request_data = request.get_json()
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']
    # Check if comment is provided
    if not 'comment' in request_data:
        return "Comment is required!", 400

    # Get comment from request
    comment = request_data['comment']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        user_id = data['user_id']
    except:
        return "Invalid token!", 401

    # Check if book exists
    connection, cursor = db_connect()
    cursor.execute("SELECT * FROM books WHERE book_id = %s", (book_id, ))
    book = cursor.fetchone()
    if not book:
        db_disconnect(cursor, connection)
        return "Book not found!", 404

    # Check if comment exists
    cursor.execute(
        "SELECT * FROM comments WHERE book_id = %s AND user_id = %s",
        (book_id, user_id))
    comment = cursor.fetchone()
    if not comment:
        db_disconnect(cursor, connection)
        return "Comment not found!", 404

    # Connect to database
    connection, cursor = db_connect()

    # Update comment in database
    cursor.execute(
        "UPDATE comments SET comment = %s WHERE book_id = %s AND user_id = %s",
        (comment, book_id, user_id))
    connection.commit()
    db_disconnect(cursor, connection)
    return book_id, 200


@swag_from("docs/comments/admin_delete.yml")
@app.route("/comments/admin_delete", methods=['DELETE'])
def admin_delete_comment():
    request_data = request.get_json()
    # Check if token is provided in request header
    if not 'Authorization' in request.headers:
        return "Token is required!", 400
    token = request.headers['Authorization']
    # Check if book_id and user_id are provided
    if not ('book_id' in request_data and 'user_id' in request_data):
        return "Book_id and user_id are required!", 400

    # Get book_id and user_id from request
    book_id = request_data['book_id']
    user_id = request_data['user_id']

    # Check if token is valid and user is admin
    try:
        data = tokenlib.parse_token(token, secret=TOKEN_SECRET)
        admin_id = data['user_id']
        connection, cursor = db_connect()
        cursor.execute("SELECT role FROM users WHERE uuid = %s", (admin_id, ))
        role = cursor.fetchone()[0]
        if role != 'admin':
            db_disconnect(cursor, connection)
            return "Only admin can delete comments!", 403
    except:
        return "Invalid token!", 401

    # Check if book exists
    connection, cursor = db_connect()
    cursor.execute("SELECT * FROM books WHERE book_id = %s", (book_id, ))
    book = cursor.fetchone()
    if not book:
        db_disconnect(cursor, connection)
        return "Book not found!", 404

    # Check if comment exists
    cursor.execute(
        "SELECT * FROM comments WHERE book_id = %s AND user_id = %s",
        (book_id, user_id))
    comment = cursor.fetchone()
    if not comment:
        db_disconnect(cursor, connection)
        return "Comment not found!", 404

    # Connect to database
    connection, cursor = db_connect()

    # Delete comment from database
    cursor.execute("DELETE FROM comments WHERE book_id = %s AND user_id = %s",
                   (book_id, user_id))
    connection.commit()
    db_disconnect(cursor, connection)
    return book_id, 200


if __name__ == '__main__':
    if db_init():
        app.run(debug=True)
