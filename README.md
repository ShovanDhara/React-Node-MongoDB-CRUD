# React NodeJS MongoDB CRUD application with JWT Authentication

C&W IPL Application is a Meanstack App for IPL all season's matches and team status with detail report

## Installation

Use npm package manager for installing packages from package.json file present both in root and server level

```bash
npm install
```

Start MongoDB Server and import both CSV files with below command

```bash
mongoimport -d skillathronCW -c matches --type csv --file matches.csv --headerline
mongoimport -d skillathronCW -c deliveries --type csv --file deliveries.csv --headerline
```

To start Express Server - Navigate to server/ folder

```bash
npm start
```

To start application - In root level

```bash
npm start
```
Then type localhost:8001 to run the application in your favorite browser.

## Application flow

After installation register with valid user data and login.


