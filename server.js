const express = require('express')//Talks to Api
const cors = require('cors')//talks to react frontend
// const session = require("express-session")
//Intialzing variables
const app = express();
const port = 8000;

const cookieParser = require('cookie-parser');//So server can  understand the cookie info coming from client
require('dotenv').config();//Gets info from .env

//Use json and form information and cors
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// const oneDay = 1000 * 60 * 60 * 24;
// app.use(
//     session({
//         secret: "secretkeyofsession",
//         saveUninitialized: true,
//         cookie: { maxAge: oneDay },
//         resave: false,
//     })
// )

require('./server/config/mongoose.config')//Connects to Config file


require('./server/routes/user.routes')(app)//Connects to Routes file


app.listen(port, () => console.log(`Listening to Port: ${port}`))