# UniBlog

## API's:

## User API:

### 1. `POST /register`

__Request__

- the request parameters are json 
```json
{
    "username": "johnDoe",
    "password": "testPassword",
    "email": "john.doe@csu.fullerton.edu",
    "firstname": "John",
    "lastname": "Doe"
}
```

__Response__

- On Success, we will receive 200.
```
{
    "message": "OTP sent successfully",
    "status": "success"
}
```

- You will receive 400 in case below errors:
1. User Already exists.
2. Invalid email address.(including non college email id)
3. username contains special characters

### 2. `GET /verify_email`

- Get the OTP from the email and use it here along with the emailID you entered to register

__RequestBody__

```json
{
  "email": "<email_id>",
  "token": <OTP>
}
```

__Response__

- On Success, we will receive 200.
```
{
    "message": "Your email is verified.",
}
```

- On error, you will receive 400.
```
{
    "message": "Invalid Verification email or Code",
}
```

### 3. `POST /login`

__Request__

- the request parameters are json 
``` json
{
    "username": "johnDoe",
    "password": "testPassword"
}
```

__ResponseBody__
- On success, we will receive 200
```
{
    "username": <username>,
    "user_id": <user_id>,
    "email": <email>,
    "message": "Logged in successfully !",
    "token": "<jwt token>"
}
```

__ResponseHeader__
```json
{
  "Cookie": "jwt=<jwt_token>"
}
```

- On error, we will receive 403 `{'WWW-Authenticate': 'Basic realm: "Authentication Failed"'}`
```
{
    "message": "Incorrect username / password !"
}
```




### All Below API's needed JWT Authentication

### 4. `POST /logout`

- Needs jwt token for logout and it will invalidate the jwt after logout
__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- On success, We will get 200
```
{
    "message": "Logout successful"
}
```

- On error, we will get 401 - invalid token
```
{
    "message": "Invalid token"
}
```

### 5. `GET /getUser`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- On success, We will get 200 with the below `JSON` response body
```json
{
    "username": "johnDoe",
    "email": "john.doe@csu.fullerton.edu",
    "firstname": "John",
    "lastname": "Doe",
    "is_admin": "False",
    "profile_picture": ""
}
```

- On error, we will get either 401 Unauthenticated, or 404 not found


### 6. `POST /upload_profile_picture`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Request Body__

- Body should be of type `form-data`
```
{
    "photo": <FileType>
}
```

__Response__

- On Success, we will get 200.
```json
{
    "message": "File uploaded successfully",
    "status": "success"
}
```

- On error, we will get 401 Unauthenticated, 404 user not found error, 400 No file selected error


### 7. `GET /get_profile_picture`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- We will receive the profile image with 200 status.
- On error, we will receive 401 Unauthenticated, 404 user not found errors.

## Admin API:

### 8. `POST /create_department`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__RequestBody__

```json
{
    "department_name": "Computer Science",
    "description": "Computer Science",
    "degree_type": "M.S."
}
```

__Response__

- On success, we will get 201

- Error Codes:
- 1. `400: Department name and degree type are required`.
  2. `400: department name already exist`
  3. `400: Department name must contain only characters and no more than one space between the words!`
  4. `401: user is not Admin`


### 9. `POST /create_course`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__RequestBody__

```json
{
    "course_name": "Project",
    "description": "Project Test",
    "department_id": 1
}
```

__Response__

- On success, we will get 201

- Error Codes:
- 1. `400: Course name and degree type are required`.
  2. `400: Course name already exist`
  3. `400: Course name must contain only characters and numbers!`
  4. `400: Department doesn't exist`
  5. `401: user is not Admin`



### 10. `GET /get_departments`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- On Success, we will get 200 with the response below

```json
{
    "departments": [
        {
            "courses": [
                {
                    "course_id": 1,
                    "course_name": "Project"
                }
            ],
            "department_id": 1,
            "department_name": "Computer Science"
        },
        {
            "courses": [
                {
                    "course_id": 2,
                    "course_name": "Computer Architecture"
                }
            ],
            "department_id": 3,
            "department_name": "Computer Engineering"
        }
    ]
}
```


### 10. `GET /get_single_department/<department_id>`

- It will take the department_id as url parameter

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- On Success, we will get 200 with the response below
- Below is response for department_id=1

```json
{
    "departments": [
        {
            "courses": [
                {
                    "course_id": 1,
                    "course_name": "Project"
                }
            ],
            "department_id": 1,
            "department_name": "Computer Science"
        }
    ]
}
```

## Blog API:

### 11. `POST /create_post`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__RequestBody__

```json
{
    "department_id": 1,
    "course_id": 1,
    "title": "Recent research in Computer Architecture",
    "content": "One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture."
}
```

__Response__

- On Success, we will get 200
- On Error:
- 1. `404: user not found`
  2. `404: department not found`
  3. `404: course not found`


### 12. `GET /get_posts`

- Returns the posts based on latest date added.

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

```json
{
    "posts": [
        {
            "comments": [],
            "content": "Testing this blog",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Thu, 30 Nov 2023 04:00:20 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 5,
            "likes": [],
            "title": "Test Blog",
            "user_id": 13,
            "username": "JohnTest"
        },
        {
            "comments": [
                {
                    "text": "Interesting Article",
                    "user_id": 13
                },
                {
                    "text": "Interesting Article",
                    "user_id": 12
                }
            ],
            "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 4,
            "likes": [
                {
                    "user_id": 13
                },
                {
                    "user_id": 12
                }
            ],
            "title": "recent research in Computer Architecture",
            "user_id": 13,
            "username": "JohnTest"
        },
        {
            "comments": [],
            "content": "Computer architecture refers to the design and organization of a computer system, encompassing its hardware components and their interrelationships. It defines the system's structure, functionality, and the way in which the hardware components interact to execute instructions and handle data. Key elements of computer architecture include the central processing unit (CPU), memory hierarchy, input/output systems, and interconnection networks. Computer architects design these components to optimize performance, power efficiency, and overall system reliability. They also consider factors like instruction set architecture, addressing modes, and data representation. Computer architecture is fundamental to understanding how computers operate at a low level and is crucial for both hardware designers and software developers in creating efficient and effective computing systems.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:13:32 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 3,
            "likes": [],
            "title": "What is Computer Architecture?",
            "user_id": 12,
            "username": "VaishnaviTest"
        },
        {
            "comments": [],
            "content": "Writing a project report is a structured process that requires clarity, precision, and a systematic approach. Start by outlining the report, including sections such as an introduction, literature review, methodology, findings, discussion, and conclusion. Clearly define the project's objectives, scope, and significance in the introduction. The literature review should provide a comprehensive overview of existing research related to your project. Detail your research methods in the methodology section, explaining your approach, data collection, and analysis techniques. Present your findings objectively, using tables, charts, or graphs to enhance clarity. In the discussion, interpret your results and relate them to your project's objectives. End with a conclusion that summarizes key findings and their implications. Ensure your report is well-organized, free of grammatical errors, and follows the prescribed format and citation style. Including an executive summary at the beginning can provide a quick overview for readers. Regularly revise and edit your report for coherence and accuracy. Following these steps will help you create a comprehensive and well-presented project report.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:53:08 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 2,
            "likes": [],
            "title": "How to write project report",
            "user_id": 12,
            "username": "VaishnaviTest"
        },
        {
            "comments": [],
            "content": "Choosing a compelling and relevant topic for your final year project is crucial, as it sets the tone for your academic exploration and contributes to your learning experience. Consider topics that align with your interests, career goals, and the latest trends in your field of study. Whether it's in computer science, engineering, social sciences, or any other discipline, aim for a project that challenges you intellectually and allows you to apply the knowledge and skills you've acquired throughout your academic journey. Look for areas with gaps in research or emerging technologies that spark your curiosity. Collaborating with industry partners or addressing real-world problems can also add practical value to your project. Ultimately, selecting a final year project topic that excites you and has the potential for meaningful contributions will not only enhance your academic portfolio but also make the journey towards graduation more rewarding.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:47:21 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 1,
            "likes": [],
            "title": "Topics for final year project",
            "user_id": 12,
            "username": "VaishnaviTest"
        }
    ]
}
```

### 13. `GET /get_posts_by_department/<department_name>`

- Returns the posts based on department_name with latest date added.

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__ 

```json
{
    "posts": [
        {
            "comments": [],
            "content": "Writing a project report is a structured process that requires clarity, precision, and a systematic approach. Start by outlining the report, including sections such as an introduction, literature review, methodology, findings, discussion, and conclusion. Clearly define the project's objectives, scope, and significance in the introduction. The literature review should provide a comprehensive overview of existing research related to your project. Detail your research methods in the methodology section, explaining your approach, data collection, and analysis techniques. Present your findings objectively, using tables, charts, or graphs to enhance clarity. In the discussion, interpret your results and relate them to your project's objectives. End with a conclusion that summarizes key findings and their implications. Ensure your report is well-organized, free of grammatical errors, and follows the prescribed format and citation style. Including an executive summary at the beginning can provide a quick overview for readers. Regularly revise and edit your report for coherence and accuracy. Following these steps will help you create a comprehensive and well-presented project report.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:53:08 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 2,
            "likes": [],
            "title": "How to write project report",
            "user_id": 12,
            "username": "VaishnaviTest"
        },
        {
            "comments": [],
            "content": "Choosing a compelling and relevant topic for your final year project is crucial, as it sets the tone for your academic exploration and contributes to your learning experience. Consider topics that align with your interests, career goals, and the latest trends in your field of study. Whether it's in computer science, engineering, social sciences, or any other discipline, aim for a project that challenges you intellectually and allows you to apply the knowledge and skills you've acquired throughout your academic journey. Look for areas with gaps in research or emerging technologies that spark your curiosity. Collaborating with industry partners or addressing real-world problems can also add practical value to your project. Ultimately, selecting a final year project topic that excites you and has the potential for meaningful contributions will not only enhance your academic portfolio but also make the journey towards graduation more rewarding.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:47:21 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 1,
            "likes": [],
            "title": "Topics for final year project",
            "user_id": 12,
            "username": "VaishnaviTest"
        }
    ]
}
```


### 14. `GET /get_posts_by_course/<department_name>/<course_name>`

- Returns the posts based on department_name and course_name with latest date added.

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__ 

```json
{
    "posts": [
        {
            "comments": [],
            "content": "Writing a project report is a structured process that requires clarity, precision, and a systematic approach. Start by outlining the report, including sections such as an introduction, literature review, methodology, findings, discussion, and conclusion. Clearly define the project's objectives, scope, and significance in the introduction. The literature review should provide a comprehensive overview of existing research related to your project. Detail your research methods in the methodology section, explaining your approach, data collection, and analysis techniques. Present your findings objectively, using tables, charts, or graphs to enhance clarity. In the discussion, interpret your results and relate them to your project's objectives. End with a conclusion that summarizes key findings and their implications. Ensure your report is well-organized, free of grammatical errors, and follows the prescribed format and citation style. Including an executive summary at the beginning can provide a quick overview for readers. Regularly revise and edit your report for coherence and accuracy. Following these steps will help you create a comprehensive and well-presented project report.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:53:08 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 2,
            "likes": [],
            "title": "How to write project report",
            "user_id": 12,
            "username": "VaishnaviTest"
        },
        {
            "comments": [],
            "content": "Choosing a compelling and relevant topic for your final year project is crucial, as it sets the tone for your academic exploration and contributes to your learning experience. Consider topics that align with your interests, career goals, and the latest trends in your field of study. Whether it's in computer science, engineering, social sciences, or any other discipline, aim for a project that challenges you intellectually and allows you to apply the knowledge and skills you've acquired throughout your academic journey. Look for areas with gaps in research or emerging technologies that spark your curiosity. Collaborating with industry partners or addressing real-world problems can also add practical value to your project. Ultimately, selecting a final year project topic that excites you and has the potential for meaningful contributions will not only enhance your academic portfolio but also make the journey towards graduation more rewarding.",
            "course": {
                "course_name": "CPSC589 Final Project",
                "id": 1
            },
            "created_at": "Mon, 27 Nov 2023 21:47:21 GMT",
            "department": {
                "department_name": "Computer Science",
                "id": 1
            },
            "id": 1,
            "likes": [],
            "title": "Topics for final year project",
            "user_id": 12,
            "username": "VaishnaviTest"
        }
    ]
}
```


### 15. `GET /get_my_posts`

- Returns the posts based on the user found in the jwt token

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__ 

```json
{
    "posts": [
        {
            "comments": [],
            "content": "Testing this blog",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Thu, 30 Nov 2023 04:00:20 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 5,
            "likes": [],
            "title": "Test Blog",
            "user_id": 13,
            "username": "JohnTest"
        },
        {
            "comments": [
                {
                    "text": "Interesting Article",
                    "user_id": 13
                },
                {
                    "text": "Interesting Article",
                    "user_id": 12
                }
            ],
            "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 4,
            "likes": [
                {
                    "user_id": 13
                },
                {
                    "user_id": 12
                }
            ],
            "title": "recent research in Computer Architecture",
            "user_id": 13,
            "username": "JohnTest"
        }
    ]
}
```


### 16 `GET /get_single_post/<post_id>`

- Returns the posts based on the user found in the jwt token

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__ 

```json
{
    "post": {
        "comments": [
            {
                "text": "Interesting Article",
                "user_id": 13
            },
            {
                "text": "Interesting Article",
                "user_id": 12
            }
        ],
        "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
        "course": {
            "course_name": "CPSC489 Computer Architecture",
            "id": 2
        },
        "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
        "department": {
            "department_name": "Computer Engineering",
            "id": 3
        },
        "id": 4,
        "likes": [
            {
                "user_id": 13
            },
            {
                "user_id": 12
            }
        ],
        "title": "recent research in Computer Architecture",
        "user_id": 13,
        "username": "JohnTest"
    }
}
```

### 16. `PUT /edit_post/<post_id>`


__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__RequestBody__

```json
{
            "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
            "course_id": "2",
            "department_id": "3",
            "title": "recent research in Computer Architecture",
            "user_id": 13

}
```

__ResponseBody__

- On Success, we will get 200.
```json
{
    "post": {
        "comments": [
            {
                "text": "Interesting Article",
                "user_id": 13
            },
            {
                "text": "Interesting Article",
                "user_id": 12
            }
        ],
        "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
        "course": {
            "course_name": "CPSC489 Computer Architecture",
            "id": 2
        },
        "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
        "department": {
            "department_name": "Computer Engineering",
            "id": 3
        },
        "id": 4,
        "likes": [
            {
                "user_id": 13
            },
            {
                "user_id": 12
            }
        ],
        "title": "recent research in Computer Architecture",
        "user_id": 13,
        "username": "JohnTest"
    }
}
```

### 17. `POST /like_post/<post_id>`
- This will like the given post
__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__
- On success, we will get 201

```json
{
    "message": "Blog post liked successfully"
}
```

### 18. `POST /like_post/<post_id>`

- the same API will unlike if its already been liked by user

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__
- On success, we will get 200

```json
{
    "message": "Like deleted successfully"
}
```

### 19. `POST /add_comment/<post_id>`

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__RequestBody__

```json
{
  "text": "<comment_text>"
}
```

__Response__
- On Success, we will get 201
```json
{
    "message": "Comment added successfully"
}
```


### 20. `GET /search/<search_queey>`

- Search the post by search query

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```


__Response__
- On Success, we will get 200
- It will return array of posts.
```json
{
    "posts": [
        {
            "comments": [],
            "content": "Computer architecture refers to the design and organization of a computer system, encompassing its hardware components and their interrelationships. It defines the system's structure, functionality, and the way in which the hardware components interact to execute instructions and handle data. Key elements of computer architecture include the central processing unit (CPU), memory hierarchy, input/output systems, and interconnection networks. Computer architects design these components to optimize performance, power efficiency, and overall system reliability. They also consider factors like instruction set architecture, addressing modes, and data representation. Computer architecture is fundamental to understanding how computers operate at a low level and is crucial for both hardware designers and software developers in creating efficient and effective computing systems.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:13:32 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 3,
            "likes": [],
            "title": "What is Computer Architecture?",
            "user_id": 12,
            "username": "VaishnaviTest"
        },
        {
            "comments": [],
            "content": "***One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 4,
            "likes": [],
            "title": "recent research in Computer Architecture",
            "user_id": 13,
            "username": "JohnTest"
        }
    ]
}
```


### 21. `POST /save_post/<blog_id>`

- Saves the post for reading later
- It takes Blog Id as input as url parameter to the API



__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

- On Success, it will return 201.

```json
{
    "message": "Blog added to reading list successfully"
}
```

- Following errors are handled:
- User and Blog should exist otherwise it throws 404.


### 22. `GET /reading_list`

- Return saved blogs for the user.

__RequestHeader__
```
{
"Authorization": "Bearer <jwtToken>"
}
```

__Response__

```json
{
    "saved_blogs": [
        {
            "comments": [
                {
                    "text": "Interesting Article",
                    "user_id": 13
                },
                {
                    "text": "Interesting Article",
                    "user_id": 12
                }
            ],
            "content": "One significant trend is the exploration of novel architectures to enhance performance and energy efficiency. Researchers are investigating the potential of emerging technologies, such as quantum computing and neuromorphic computing, to revolutionize traditional architectures. Moreover, there is a continued emphasis on designing architectures that can effectively handle the increasing demand for specialized workloads, including artificial intelligence and machine learning tasks. Additionally, there is ongoing research in the development of secure and resilient architectures to address the growing concerns regarding cybersecurity in modern computing systems. For the latest and more detailed information, I recommend checking recent conference proceedings, journals, or the websites of leading institutions conducting research in computer architecture.",
            "course": {
                "course_name": "CPSC489 Computer Architecture",
                "id": 2
            },
            "created_at": "Mon, 27 Nov 2023 22:56:37 GMT",
            "department": {
                "department_name": "Computer Engineering",
                "id": 3
            },
            "id": 4,
            "likes": [
                {
                    "user_id": 13
                },
                {
                    "user_id": 12
                }
            ],
            "title": "recent research in Computer Architecture",
            "user_id": 13,
            "username": "JohnTest"
        }
    ]
}
```
