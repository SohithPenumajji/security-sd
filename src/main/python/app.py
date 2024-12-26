from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import logging
import re

app = Flask(__name__)

# Secret key for session management
app.secret_key = 'your_secret_key'

# Enable logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['user_database']  # Database name
users_collection = db['users']  # Collection name

def is_safe_input(input_string):
    # Basic pattern to detect XSS attempts
    xss_pattern = re.compile(r'<script>|<\/script>|on\w+=|javascript:', re.IGNORECASE)
    return not xss_pattern.search(input_string)

def is_safe_input2(intput_string):
    
    sql_injection = re.compile(r"(?i)\b(select|union|insert|update|delete|drop|alter|create|--|;|#|')\b", re.IGNORECASE)
    return not sql_injection.search(input_string)

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('index'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = ""
    if request.method == 'POST':
        logging.debug(f"Form data received: {request.form}")

        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            error_message = "Please fill in both fields."
            return render_template('login.html', error_message=error_message)

        # Check if the username exists in the database
        user = users_collection.find_one({'username': username})

        if user and check_password_hash(user['password'], password):
            session['username'] = username
            return redirect(url_for('index'))
        else:
            error_message = "Invalid credentials, please try again."

    return render_template('login.html', error_message=error_message)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error_message = ""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            error_message = "Please fill in both fields."
            return render_template('signup.html', error_message=error_message)

        # Hash the password before storing it
        hashed_password = generate_password_hash(password)

        # Check if the username already exists
        if users_collection.find_one({'username': username}):
            error_message = "Username already exists."
            return render_template('signup.html', error_message=error_message)

        # Insert the new user into the database
        users_collection.insert_one({'username': username, 'password': hashed_password})
        return redirect(url_for('login'))

    return render_template('signup.html', error_message=error_message)

@app.route('/index')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    return render_template('index.html', username=username)

@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove user from session
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
