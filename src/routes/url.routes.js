const express =  require('express');
const routes = express.Router();

const UrlValidator = require('../controller/url.controller');
const auth  = require('../Auth/user.auth');
const {getmonitors , deleteAllMonitor , deleteMonitor} = require('../controller/crud.controller');

routes.post('/monitor' , auth ,UrlValidator ,(req , res ) =>{
    res.json({
        response: req.userUrl
    });
})

routes.get('/monitors', auth , getmonitors); // read 
routes.post('/deletemonitorall', auth , deleteAllMonitor ); // delete
routes.post('/monitor/:id' , auth ,deleteMonitor );




module.exports = routes;