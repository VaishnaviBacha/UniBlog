from flask import Flask, jsonify, request, abort, flash, send_file, session, make_response
from flask_mail import Mail, Message
from flask_uploads import UploadSet, configure_uploads, IMAGES
from datetime import datetime, timedelta
from functools import wraps
from flask_cors import CORS
import pymysql
import re
import random
import os
import jwt

app = Flask(__name__)

CORS(app, supports_credentials=True)

# Mail Settings
app.config.update(dict(
    MAIL_DEFAULT_SENDER="noreply@flask.com",
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=465,
    MAIL_USE_TLS=False,
    MAIL_USE_SSL=True,
    MAIL_DEBUG=False,
    MAIL_USERNAME="uniblog.cpsc589@gmail.com",
    MAIL_PASSWORD="mhjy tmtg galm ohbr",
))

mail = Mail(app)

# Configuration for file uploads
photos = UploadSet('photos', IMAGES)
app.config[
    'UPLOADED_PHOTOS_DEST'] = '/Users/akshaymarewar/Documents/CSUF/SEM 4/FINAL PROJECT/UniBlog/uploads'  # Temporary local storage
configure_uploads(app, photos)

app.config["SECRET_KEY"] = 'af8d0c819f19479bb50f8e28c4b17f2c'

verify_email_link = "http://127.0.0.1:5000/verify_email/"

# To connect MySQL database
conn = pymysql.connect(
    host='database-1.ctx7bbuvyr6m.us-west-1.rds.amazonaws.com',
    user='admin',
    password="admin123",
    db='uniblog',
    cursorclass=pymysql.cursors.DictCursor
)
db = conn.cursor()

# Maintain a set of invalidated tokens (blacklist)
invalid_tokens = set()


# We are validating JWT token for APIs
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            data = request.headers["Authorization"]
            token = str.replace(str(data), "Bearer ", "")  # Extracting token
        if not token:
            if "Cookie" in request.headers:
                data = request.headers["Cookie"]
                token = str.replace(data.split(";")[0], "jwt=", "")  # Extracting token

        if not token:
            return make_response(jsonify({'Alert!': 'token is missing', 'statusCode': 401}),
                                 401)  # HTTP Status code 401 unauthorized

        # Check if the token is in the blacklist
        if token in invalid_tokens:
            return jsonify({'message': 'Invalid token'}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])  # decoding payload from token
            current_user = payload['username']
        except:
            return make_response(jsonify({'Alert!': 'Token is invalid', 'statusCode': 401}), 401)
        return func(current_user, *args, **kwargs)

    return decorated


@app.route('/getUser', methods=['GET'])
@token_required
def get_user(username):
    db.execute(
        'SELECT id, username, email, firstname, lastname, is_admin, profile_image FROM user WHERE username = % s',
        (username,))
    user = db.fetchone()
    conn.commit()

    if not user:
        return jsonify({"message": "User not found", "status": "error"}), 404

    user_info = {
        "id": user['id'],
        "username": user['username'],
        "profile_picture": None,  # Placeholder for the profile picture
        "firstname": user['firstname'],
        "lastname": user['lastname'],
        "is_admin": user['is_admin']
    }

    if user['profile_image']:
        file_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], user['profile_image'])

        # Check if the file exists
        if os.path.isfile(file_path):
            user_info["profile_picture"] = f"/get_profile_picture/{username}"

    return jsonify(user_info), 200


@app.route('/get_profile_picture', methods=['GET'])
@token_required
def get_profile_picture(username):
    db.execute('SELECT profile_image FROM user WHERE username = % s',
               (username,))
    user = db.fetchone()
    conn.commit()

    if not user or not user['profile_image']:
        return jsonify({"message": "User not found or profile picture not available", "status": "error"}), 400

    # Build the absolute file path
    file_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], user['profile_image'])

    # Check if the file exists
    if os.path.isfile(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"message": "Profile picture not found", "status": "error"}), 400


@app.route('/register', methods=['GET', 'POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    if request.method == 'POST' and username and password and email and firstname and lastname:
        print('reached')

        db.execute('SELECT * FROM user WHERE username = %s OR email = %s', (username, email))
        user = db.fetchone()
        print(user)
        conn.commit()

        # domain = re.search('@*?\.', email)

        if user:
            return abort(400, {'message': 'User already exist !'})
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return abort(400, {'message': 'Invalid email address !'})
        elif not re.match(r'^[A-Za-z0-9]+$', username):
            return abort(400, {'message': 'name must contain only characters and numbers !'})
        #        elif not domain.group() == "@csu.fullerton.edu":
        #            return abort(400, {'message': 'Invalid email address !'})

        verification_token = str(random.randint(100000, 999999))
        db.execute(
            'INSERT INTO user (username, password, email, firstname, lastname, is_admin, verification_token) VALUES (%s, %s, %s, %s, %s, %s, %s)',
            (username, password, email, firstname, lastname, False, verification_token))

        msg = Message('Verify Your Email', recipients=[email])
        msg.body = f'Your OTP is: {verification_token}'
        conn.commit()
        mail.send(msg)
        return jsonify({"message": "OTP sent successfully", "status": "success"}), 200

    elif request.method == 'POST':
        return abort(400, {'message': 'Please fill out the form !'})


@app.route('/verify_email', methods=['GET'])
def verify_email():
    data = request.get_json()

    email = data.get('email')
    token = data.get('token')

    if email and token:
        db.execute('SELECT * FROM user WHERE verification_token = %s and email = %s', (token, email))
        user = db.fetchone()
        print(user)
        conn.commit()

        if not user:
            return abort(400, {'message': 'Invalid Verification email or Code'})

        if not user['email_verified']:
            db.execute('UPDATE user SET email_verified = %s where username = %s', (True, user['username']))
            conn.commit()
            flash('Your email has been successfully verified!', 'success')
        else:
            flash('Your email is already verified.', 'info')

        return jsonify({'message': 'Your email is verified.'}), 200
    else:
        return jsonify({'message': 'Missing email or token'}), 400


@app.route('/upload_profile_picture', methods=['POST'])
@token_required
def upload_profile_picture(username):
    db.execute('SELECT * FROM user WHERE username = %s', (username,))
    user = db.fetchone()
    print(user)
    conn.commit()

    if not user:
        return jsonify({"message": "User not found", "status": "error"}), 404

    if 'photo' in request.files:
        photo = request.files['photo']

        if photo.filename == '':
            return jsonify({"message": "No file selected", "status": "error"}), 400

        if photo and photos.file_allowed(photo, photo.filename):
            # Save the file locally
            filename = photos.save(photo)

            db.execute('UPDATE user SET profile_image = %s where username = %s', (filename, user['username']))
            conn.commit()

            return jsonify({"message": "File uploaded successfully", "status": "success"}), 200
        else:
            return jsonify({"message": "Invalid file format", "status": "error"}), 400
    else:
        return jsonify({"message": "No file part in the request", "status": "error"}), 400


# To Login Users with Username and Password
@app.route('/')
@app.route('/login', methods=['POST'])
def login():
    msg = ''
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if request.method == 'POST' and username and password:
        db.execute('SELECT * FROM user WHERE username = %s AND password = %s', (username, password,))
        conn.commit()
        user = db.fetchone()
        if user:
            session['loggedin'] = True
            # Here we are creating JWT for Login
            token = jwt.encode({
                'username': username,
                'expiration': str(datetime.utcnow() + timedelta(minutes=30))
            }, app.config['SECRET_KEY'])

            msg = 'Logged in successfully !'

            user_info = {
                "username": username,
                "user_id": user.get('id'),
                "is_admin": user.get('is_admin'),
                "email": user.get('email'),
                "token": token,
                "msg": msg
            }
            response = make_response(jsonify(user_info), 200)
            response.set_cookie('jwt', token, samesite='None', secure=True)  # This solved Cookie samesite error on frontend
            return response
        else:
            msg = 'Incorrect username / password !'
            return make_response({'message': msg}, 403, {'WWW-Authenticate': 'Basic realm: "Authentication Failed"'})
    elif request.method == 'POST':
        return abort(400, {'message': 'Please fill out the form !'})


@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization').split()[1]  # Extract the token from the Authorization header
    if token:
        # Add the token to the blacklist
        invalid_tokens.add(token)
        return jsonify({'message': 'Logout successful'}), 200
    else:
        return jsonify({'message': 'Invalid token'}), 401


# Example: Route to create a new blog post
@app.route('/create_post', methods=['POST'])
@token_required
def create_post(username):
    data = request.get_json()

    department_id = data.get('department_id')
    course_id = data.get('course_id')
    title = data.get('title')
    content = data.get('content')

    if not department_id or not course_id or not title or not content:
        return jsonify({'message': 'All fields are required'}), 400

    db.execute('SELECT * FROM user WHERE username = %s', (username,))
    user = db.fetchone()
    conn.commit()

    db.execute(
        'INSERT INTO blog (user_id, department_id, course_id, title, content) VALUES (%s, %s, %s, %s, %s)',
        (user.get('id'), department_id, course_id, title, content))

    conn.commit()

    return jsonify({'message': 'Blog post created successfully'}), 201


@app.route('/edit_post/<post_id>', methods=['PUT'])
@token_required
def edit_post(username, post_id):
    data = request.get_json()

    department_id = data.get('department_id')
    course_id = data.get('course_id')
    title = data.get('title')
    content = data.get('content')

    if not department_id or not course_id or not title or not content:
        return jsonify({'message': 'All fields are required'}), 400

    try:
        with conn.cursor() as cursor:
            # Check if the blog post with the given ID exists
            cursor.execute('SELECT * FROM blog WHERE id = %s', (post_id,))
            existing_post = cursor.fetchone()

            if not existing_post:
                return jsonify({'message': 'Blog post not found'}), 404

            db.execute('SELECT * FROM user WHERE username = %s', (username,))
            user = db.fetchone()
            conn.commit()

            if existing_post.get('user_id') != user.get('id'):
                return jsonify({'message': 'You can not edit the posts'}), 400

            # Update the blog post
            cursor.execute(
                'UPDATE blog SET user_id = %s, department_id = %s, course_id = %s, title = %s, content = %s WHERE id = %s',
                (user.get('id'), department_id, course_id, title, content, post_id))

            conn.commit()

            return single_post_response(post_id)

    except Exception as e:
        return jsonify({'message': f'Error updating blog post: {str(e)}'}), 500


def posts_response(posts):
    post_list = []

    for post in posts:
        db.execute('SELECT user_id FROM likes WHERE blog_id = %s', post['id'])
        conn.commit()
        likes = db.fetchall()

        db.execute('SELECT * FROM comment WHERE blog_id = %s', post['id'])
        conn.commit()
        comments = db.fetchall()

        db.execute('SELECT id, department_name FROM department WHERE id=%s', post['department_id'])
        conn.commit()
        department = db.fetchone()

        db.execute('SELECT id, course_name FROM course WHERE id=%s', post['course_id'])
        conn.commit()
        course = db.fetchone()

        db.execute('SELECT username FROM user WHERE id=%s', post['user_id'])
        conn.commit()
        user = db.fetchone()

        post_info = {
            'id': post['id'],
            'title': post['title'],
            'content': post['content'],
            'department': {'id': department['id'], 'department_name': department['department_name']},
            'course': {'id': course['id'], 'course_name': course['course_name']},
            'likes': [{'user_id': like['user_id']} for like in likes],
            'comments': [{'user_id': comment['user_id'], 'text': comment['comment_text']} for comment in comments],
            'created_at': post['created_at'],
            'user_id': post['user_id'],
            'username': user['username']
        }

        post_list.append(post_info)

    return post_list


@app.route('/get_posts', methods=['GET'])
@token_required
def get_posts(username):
    db.execute('SELECT * FROM blog ORDER BY created_at desc ')
    conn.commit()
    posts = db.fetchall()

    post_list = posts_response(posts)
    return jsonify({'posts': post_list}), 200


@app.route('/get_posts_by_department/<department_id>', methods=['GET'])
@token_required
def get_posts_by_department(username, department_id):
    db.execute('SELECT * FROM blog WHERE department_id = %s ORDER BY created_at desc ', department_id)
    conn.commit()
    posts = db.fetchall()

    post_list = posts_response(posts)
    return jsonify({'posts': post_list}), 200


@app.route('/get_posts_by_course/<department_id>/<course_id>', methods=['GET'])
@token_required
def get_posts_by_course(username, department_id, course_id):
    db.execute('SELECT * FROM blog WHERE department_id = %s AND course_id = %s ORDER BY created_at desc ',
               (department_id, course_id))
    conn.commit()
    posts = db.fetchall()

    post_list = posts_response(posts)
    return jsonify({'posts': post_list}), 200


@app.route('/get_my_posts', methods=['GET'])
@token_required
def get_my_blogs(username):
    db.execute(
        'SELECT * FROM blog WHERE user_id IN (SELECT id FROM user WHERE username = %s) ORDER BY created_at desc ',
        username)
    conn.commit()
    posts = db.fetchall()

    post_list = posts_response(posts)
    return jsonify({'posts': post_list}), 200


@app.route('/get_single_post/<post_id>', methods=['GET'])
@token_required
def get_single_post(username, post_id):
    return single_post_response(post_id)


def single_post_response(post_id):
    db.execute('SELECT * FROM blog WHERE id=%s', post_id)
    conn.commit()
    post = db.fetchone()

    db.execute('SELECT * FROM likes WHERE blog_id = %s', post['id'])
    conn.commit()
    likes = db.fetchall()

    db.execute('SELECT * FROM comment WHERE blog_id = %s', post['id'])
    conn.commit()
    comments = db.fetchall()

    db.execute('SELECT id, department_name FROM department WHERE id=%s', post['department_id'])
    conn.commit()
    department = db.fetchone()

    db.execute('SELECT id, course_name FROM course WHERE id=%s', post['course_id'])
    conn.commit()
    course = db.fetchone()

    db.execute('SELECT username FROM user WHERE id=%s', post['user_id'])
    conn.commit()
    user = db.fetchone()

    post_info = {
        'id': post['id'],
        'title': post['title'],
        'content': post['content'],
        'department': {'id': department['id'], 'department_name': department['department_name']},
        'course': {'id': course['id'], 'course_name': course['course_name']},
        'likes': [{'user_id': like['user_id']} for like in likes],
        'comments': [{'user_id': comment['user_id'], 'text': comment['comment_text']} for comment in comments],
        'created_at': post['created_at'],
        'user_id': post['user_id'],
        'username': user['username']
    }
    return jsonify({'post': post_info}), 200


@app.route('/create_department', methods=['POST'])
@token_required
def create_department(username):
    db.execute('SELECT is_admin FROM user WHERE username = %s', username)
    conn.commit()
    user = db.fetchone()

    if not user['is_admin']:
        return jsonify({'message': 'User is not Admin'}), 401

    data = request.get_json()

    department_name = data.get('department_name').strip()
    description = data.get('description')
    degree_type = data.get('degree_type')

    if not re.match(r'^(\w+\s)*\w+$', department_name):
        return jsonify({
            'message': 'Department name must contain only characters and no more than one space between the words!'}), 400

    if not department_name or not degree_type:
        return jsonify({'message': 'Department name and degree type are required'}), 400

    db.execute(
        'SELECT * FROM department WHERE department_name like %s',
        department_name)
    conn.commit()
    department = db.fetchone()

    if department:
        return jsonify({'message': 'Department name already exists!'}), 400

    db.execute(
        'INSERT INTO department (department_name, description, degree_type) VALUES (%s, %s, %s)',
        (department_name, description, degree_type))
    conn.commit()

    return jsonify({'message': 'Department created successfully'}), 201


# Example: Route to create a new course
@app.route('/create_course', methods=['POST'])
@token_required
def create_course(username):
    db.execute('SELECT is_admin FROM user WHERE username = %s', username)
    conn.commit()
    user = db.fetchone()

    if not user['is_admin']:
        return jsonify({'message': 'User is not Admin'}), 401

    data = request.get_json()

    course_name = data.get('course_name').strip()
    description = data.get('description')
    department_id = data.get('department_id')

    if not course_name or not department_id:
        return jsonify({'message': 'Course name and department ID are required'}), 400

    if not re.match(r'^[A-Za-z0-9\s]+$', course_name):
        return jsonify({'message': 'Course name must contain only characters and numbers'}), 400

    db.execute(
        'SELECT * FROM department WHERE id like %s',
        department_id)
    conn.commit()
    department = db.fetchone()

    if not department:
        return jsonify({'message': 'Department name doesn\'t exists!'}), 400

    db.execute(
        'SELECT * FROM course WHERE course_name like %s',
        course_name)
    conn.commit()
    course = db.fetchone()

    if course:
        return jsonify({'message': 'Course name already exist exists!'}), 400

    db.execute(
        'INSERT INTO course (course_name, description, department_id) VALUES (%s, %s, %s)',
        (course_name, description, department_id))
    conn.commit()

    return jsonify({'message': 'Course created successfully'}), 201


# Example: Route to get all departments and their courses
@app.route('/get_departments', methods=['GET'])
@token_required
def get_departments(username):
    db.execute('SELECT * FROM department')
    conn.commit()
    departments = db.fetchall()

    departments_list = []

    for department in departments:
        db.execute('SELECT * FROM course WHERE department_id = %s', department['id'])
        conn.commit()
        courses = db.fetchall()
        department_info = {
            'department_id': department['id'],
            'department_name': department['department_name'],
            'courses': [{'course_id': course.get('id'), 'course_name': course.get('course_name')} for course in courses]
        }
        departments_list.append(department_info)

    return jsonify({'departments': departments_list}), 200


@app.route('/search', methods=['GET'])
@token_required
def get_search_by_title(username):
    data = request.get_json()

    title = data.get('search_query').strip().lower()
    if title:
        args = ['%' + title + '%']
        db.execute('SELECT * FROM blog WHERE title like %s', args)
        conn.commit()
        posts = db.fetchall()

        post_list = posts_response(posts)
        return jsonify({'posts': post_list}), 200


@app.route('/get_single_department/<department_id>', methods=['GET'])
@token_required
def get_single_department(username, department_id):
    db.execute('SELECT * FROM department where id=%s', department_id)
    conn.commit()
    department = db.fetchone()

    db.execute('SELECT * FROM course WHERE department_id = %s', department['id'])
    conn.commit()
    courses = db.fetchall()

    department_info = {
        'department_id': department['id'],
        'department_name': department['department_name'],
        'courses': [{'course_id': course['id'], 'course_name': course['course_name']} for course in courses]
    }

    return jsonify({'department': department_info}), 200


@app.route('/like_post/<post_id>', methods=['POST'])
@token_required
def like_post(username, post_id):
    db.execute('SELECT id FROM user WHERE username=%s', username)
    conn.commit()
    user = db.fetchone()

    try:
        with conn.cursor() as cursor:
            # Check if the blog post with the given ID exists
            cursor.execute('SELECT * FROM blog WHERE id = %s', (post_id,))
            existing_post = cursor.fetchone()

            if not existing_post:
                return jsonify({'message': 'Blog post not found'}), 404

            # Check if the user has already liked the blog post
            cursor.execute('SELECT * FROM likes WHERE user_id = %s AND blog_id = %s', (user.get('id'), post_id))
            existing_like = cursor.fetchone()

            if existing_like:
                # If found like delete the like
                cursor.execute('DELETE FROM likes WHERE user_id = %s AND blog_id = %s', (user.get('id'), post_id))
                return jsonify({'message': 'Like deleted successfully'}), 200
            else:
                # Like the blog post
                cursor.execute('INSERT INTO likes (user_id, blog_id) VALUES (%s, %s)', (user.get('id'), post_id))

        conn.commit()
        return jsonify({'message': 'Blog post liked successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Error liking blog post: {str(e)}'}), 500


@app.route('/add_comment/<post_id>', methods=['POST'])
@token_required
def add_comment(username, post_id):
    data = request.get_json()
    text = data.get('text')

    db.execute('SELECT id FROM user WHERE username=%s', username)
    conn.commit()
    user = db.fetchone()

    try:
        with conn.cursor() as cursor:
            # Check if the blog post with the given ID exists
            cursor.execute('SELECT * FROM blog WHERE id = %s', (post_id,))
            existing_post = cursor.fetchone()

            if not existing_post:
                return jsonify({'message': 'Blog post not found'}), 404

            # Add the comment to the comments table
            cursor.execute('INSERT INTO comment (user_id, blog_id, comment_text) VALUES (%s, %s, %s)',
                           (user.get('id'), post_id, text))

        conn.commit()
        return jsonify({'message': 'Comment added successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Error adding comment: {str(e)}'}), 500


if __name__ == "__main__":
    app.run(debug=True)
