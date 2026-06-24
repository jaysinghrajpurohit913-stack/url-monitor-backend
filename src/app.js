const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const cors = require('cors');
app.use(cors({

  origin:  ["https://url-monitor-frontend-q15erg6l7.vercel.app"],

  credentials: true
}));

const routes = require('./routes/url.routes');
const route = require('./routes/user.log');

app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// for url  input
app.use('/' , routes); // /url
app.use('/' , route);

app.get('/' ,(req , res)=>{
    res.send("HEY ITS RUNNING")
})





module.exports = app;
