require('./config/config');
require('./models/db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");
const rtsIndex = require('./router/index.router');

var app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// // Passport config
require("./config/passport")(passport);
app.use('/api', rtsIndex);

//error handle
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

//start server
app.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));