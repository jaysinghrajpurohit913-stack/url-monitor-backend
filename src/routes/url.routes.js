const express =  require('express');
const routes = express.Router();

const UrlValidator = require('../controller/url.controller');
const auth  = require('../Auth/user.auth');
const  {getmonitors,
    deleteAllMonitor,
    deleteMonitor,
    toggleMonitor,
    getMonitorStats} = require('../controller/crud.controller');
const {getMonitorChecks} = require('../controller/check.controller');

routes.post('/monitor' , auth ,UrlValidator); // create monitor and 1st check

routes.get('/monitors', auth , getmonitors); // read
routes.get('/deletemonitorall', auth , deleteAllMonitor ); // delete
routes.get('/monitor/:id' , auth ,deleteMonitor );



routes.get('/monitors/:id',auth,getMonitorChecks); // give all checks of related monitor
routes.patch('/monitors/:id/toggle',auth, toggleMonitor); // pause or resume monitor
routes.get('/monitors/:id/stats',auth,getMonitorStats);
module.exports = routes;