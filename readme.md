![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### EP - Course Assignment

E-commerce site back-end with an admin front-end panel

## Installation

To install and run the web application locally, follow these steps:

1. Clone repository
```bash
git clone https://github.com/noroff-backend-1/jan23-ft-ep1-LienSimen
```

2. Navigate to project
```bash
cd jan23-ft-ep1-LienSimen
```

3. Install npm packages
```bash
npm install
```

4. Create .env file with the following:
```bash
ADMIN_USERNAME = "Admin from mySQL workbench"
ADMIN_PASSWORD = "Password from MySQL workbench"
DATABASE_NAME = "Database from mySQL workbench"
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
HOST = "localhost"
JWT_SECRET="node in terminal and type 'require('crypto').randomBytes(64).toString('hex')' to create a good secret"
```

5. Start the application.
```bash
npm start
```

6. Open a web browser and navigate to http://localhost:3000/doc and navigate to init at the bottom and execute to initialize database

7. Navigate to http://localhost:3000/admin and login with the admin credentials from the task
```bash
Username: Admin
Password: P@ssword2023
```

## REFERENCES

https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event

https://getbootstrap.com/docs/5.3/

https://swagger.io/docs/

https://beautifier.io/

https://stackoverflow.com/questions/34817617/should-jwt-be-stored-in-localstorage-or-cookie

https://codepen.io/AllThingsSmitty/pen/MmxxOz/

https://getbootstrap.com/docs/4.0/components/modal/

https://www.tabnine.com/code/javascript/functions/sequelize/Sequelize/close

https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/

https://nodejs.org/api/crypto.html#crypto_crypto

https://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto

## Node Version

v20.9.0

## Plugins

Axios
Jsonwebtoken
Mysql2
Sequelize
Bootstrap
Dotenv
Jest
Supertest
Swagger-autogen
Swagger-ui-express
Dev:
Sequelize-cli

<details>
  <summary>Click here to show Grade + Feedback</summary>
  
  ![image](https://github.com/LienSimen/Backend-Development-Exam-Project/assets/122803724/d0f61b8c-27a6-468c-96c7-360300930520)
</details>
