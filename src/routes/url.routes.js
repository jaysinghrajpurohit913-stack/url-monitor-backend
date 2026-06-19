const express =  require('express');
const routes = express.Router();

const UrlValidator = require('../controller/url.controller');
const auth  = require('../Auth/user.auth');
const {getmonitors} = require('../controller/check.controller');

routes.post('/url' , auth ,UrlValidator ,(req , res ) =>{
    res.json({
        response: req.userUrl
    });
})

routes.get('/monitors' , getmonitors);




module.exports = routes;