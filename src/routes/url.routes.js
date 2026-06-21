const express =  require('express');
const routes = express.Router();

const UrlValidator = require('../controller/url.controller');
const auth  = require('../Auth/user.auth');
const {getmonitors , deleteAllMonitor , deleteMonitor} = require('../controller/crud.controller');

const {getMonitorChecks} = require('../controller/check.controller');

routes.post('/monitor' , auth ,UrlValidator ,(req , res ) =>{ // creator of routes 
    res.json({
        response: req.userUrl
    });
})

routes.get('/monitors', auth , getmonitors); // read 
routes.post('/deletemonitorall', auth , deleteAllMonitor ); // delete
routes.post('/monitor/:id' , auth ,deleteMonitor );


routes.get( '/monitor/:id/checks', auth, getMonitorChecks); // get the all check of specific url



module.exports = routes;