require('dotenv').config();
const app = require('./src/app');
const connectiontoDB = require('./src/config/db');
connectiontoDB();

const checkurl = require('./src/controller/check.controller');
checkurl();





app.listen(process.env.Port , ()=>{
    console.log(`server is running ${process.env.Port}`);
})