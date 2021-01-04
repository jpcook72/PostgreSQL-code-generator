pg-visualizer is a database scema tool that can be paired with pg-auto-write (node module) to auto-generate the PostgreSQL code for modelling the database.

Go to https://pg-visualizer.herokuapp.com/ and save a database model schema.

pg-auto-write is intended for use with Sequelize. 
pg-auto-write returns a database-syncing function that can be used with your 6-digit schema code to set-up your database instance.

The datsabase-syncing function returns a promise.

Example code to initialize application that uses pg-auto-write:
```
const express = require("express")
const {DBsync} = require('pg-auto-write')
const Sequelize = require('sequelize');

const db = new Sequelize(`postgres://localhost:5432/fake-project`, {
    logging: false,
    });

const app = express();
app.use(express.json());

const init = async() => {
    try {
        await DBsync(db)
        const port = process.env.PORT || 8081;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex);
    }
};

init();
```
