# PostgreSQL code-generator

PostgreSQL code-generator is a database schema design tool that can be paired with [pg-auto-write](https://github.com/jpcook72/pg-auto-write) (npm module) to auto-generate the PostgreSQL code for modeling the database. Here is a [video example](https://www.youtube.com/watch?v=r2XFSdZUbB4&feature=youtu.be).

## Using the app

Go to https://pg-visualizer.herokuapp.com/ (NOTE: the Heroku settings need to be updated-- this link does not work right now) and save a database model schema.

In your app, install pg-auto-write.
```
npm install pg-auto-write
```

Note: pg-auto-write is intended for use with Sequelize. It returns a database-syncing function that can be used with your 6-digit schema code to set-up your database instance.

The datsabase-syncing function returns a promise.

Example code to initialize application that uses pg-auto-write:
```
const express = require('express')
const {DBsync} = require('pg-auto-write')
const Sequelize = require('sequelize');

const db = new Sequelize(`postgres://localhost:5432/fake-project`, {
    logging: false,
});

const app = express();
app.use(express.json());

const schemaCode = 'ABC123'

const init = async() => {
    try {
        await DBsync(db, schemaCode)
        const port = process.env.PORT || 8080;
        app.listen(port);
    }
    catch(err){
        console.log(err);
    }
};

init();
```

## Local installation of schema tool

node v15.14.0
react v16.13.1

Getting project running locally:

```
npm install
```

Build the js files and start the local server:

```
npm run start:dev
```

App defaults to run on port 8080 - [localhost:8080](http://localhost:8080)

## App testing

Tests (Jest, React Testing Library) for the schema tool are located in [client/tests](https://github.com/jpcook72/PostgreSQL-code-generator/tree/master/client/__tests__)

Tests (Jest) for the npm module are located in [test.js](https://github.com/jpcook72/pg-auto-write/blob/master/test.js)

Run tests:
```
npm run test
```

## Technologies Used

TypeScript, JavaScript, Node, Express, React, Jest, React Testing Library


## To-Do List

1. Allow table-relationship arrow to change positioning on the table (both head and tail)

2. Allow many-to-many relationships between tables

3. Add more field features (i.e. default value)
