# travel-commerce

## install

` yarn`
or
`npm i`

All variables are set in `.env` file and to start server use `yarn dev` or `npm run dev`

Once server is live, head to frontend. [https://github.com/pranaysalve/travel-ecommerce-frontend](https://github.com/pranaysalve/travel-ecommerce-frontend)

## Login Creation

Use Postman or any other API Tool.

1. Add New Post Request in POSTMAN with this URL http://localhost:8000/api/v1/users/login

and pass following data as body

```
{
	"email": "pranaysalve24@gmail.com",
	"password": "root1234"
}

```
2. You will receive some data in response like this
```
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmFkMTlkMzg3NmQxNzRjMTYzMmI2NyIsImlhdCI6MTY5ODE0ODc1MSwiZXhwIjoxNzAwNzQwNzUxfQ.o06UyyfELbz7ntcCuOLGoipQQmIivE9YtmY4PA2LDtY",
    "data": {
        "user": {
            "_id": "652ad19d3876d174c1632b67",
            "name": "Pranay Salve",
            "email": "pranaysalve24@gmail.com",
            "photo": "default.jpg",
            "role": "user",
            "__v": 0
        }
    }
}
```
the token value you need to copy into frontend project file in the util folder with file name ```api.ts``` it contains variable as 
```
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmFkMTlkMzg3NmQxNzRjMTYzMmI2NyIsImlhdCI6MTY5NzkyMzYyNCwiZXhwIjoxNzAwNTE1NjI0fQ.0DVM7FomEcxFgecvS3Iz6Ocv0JAFUq4-4J5gHgHBpT0";
  
  ```

you have to replace token that you receive in the backend project using postman in the frontend project in api.ts file.

This will bypass the login neccessity to access frontend application without logging in. This will result in same way as it will behave while user is logged in. 