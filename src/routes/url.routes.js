const express =  require('express');
const routes = express.Router();

const UrlValidator = require('../controller/url.controller');
const auth  = require('../Auth/user.auth');

routes.post('/url' , auth ,UrlValidator ,(req , res ) =>{
    res.json({
        response: req.userUrl
    });
})




module.exports = routes;