CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image TEXT,
    is_admin BOOLEAN,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    verification_token varchar(50),
    email_verified boolean
);

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255),
    description TEXT,
    degree_type VARCHAR(50)
);


CREATE TABLE course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255),
    description TEXT,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE blog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    department_id INT,
    course_id INT,
    title VARCHAR(500),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (department_id) REFERENCES department(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);


CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blog_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (blog_id) REFERENCES blog(id)
);

CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blog_id INT,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (blog_id) REFERENCES blog(id)
);

CREATE TABLE readingList (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blog_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (blog_id) REFERENCES blog(id)
);

