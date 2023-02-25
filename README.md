# Innovorder API Test

This project is a simple RESTful API built with NestJS, designed to test an user login/register system and research of an OpenFoodFacts API in an authorized route. This README will provide instructions on how to deploy the application using Docker.

## Prerequisites

- Docker installed on your machine

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/hiririri/Innovorder-api-test.git
cd Innovorder-api-test/back-end
```

2. Build and start the docker containers:

```bash
## This command will build the docker image and run the containers: 
## e2e test container;
## production container.
## Wait until the build finish.
docker-compose up --build -d
```

3. Rerun the e2e test pre-built

```bash
## This command will run the e2e test on user's terminal and print all the test result.
docker-compose up --no-recreate e2e
```

4. Test the following apis using api test tools such as Postman.

```javascript
Base url = 'localhost:3000/api/v1'
```

To login GET request
- /login
```json
{
    "username":"aaa@gmail.com",
    "password":"qwe"
}
```

To registe POST request
- /register
```json
{
    "username":"aaa@gmail.com",
    "password":"qwe"
}
```

To update PATCH request (with the token given by login session)
- /users
```json
{
    "username":"ccc@gmail.com",
    "password":"123"
}
```

To get a food product POST request (with the token given by login session)
- /product/1=
```json
{
    "code": "123123"
}
```

To delete an user DELETE request (with the token given by login session)
- /users
```json
{
    "username":"ccc@gmail.com"
}
```
