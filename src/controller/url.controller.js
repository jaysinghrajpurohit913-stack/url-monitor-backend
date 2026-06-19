const axios = require('axios');
const user_url = require('../models/check.models');
const MonitorModel = require('../models/monitor.model');

const UrlValidator = async (req, res , next)=>{
    
    const {url} =  req.body;

    // checking is something coming in url or not 
    if(!url){
        return res.status(400).json({
         message: "URL is required",
          });
    }


    // now check is this url entered is valid or not
    try {

    const normalizedUrl = new URL(url).href;
    // res.json({
    //   message: "Valid URL",
    // });
    const existingMonitor = await MonitorModel.findOne({
    userId: req.user.userId,
    url
    });

if (existingMonitor) {
    return res.status(400).json({
        success: false,
        message: "URL already being monitored"
    });
}

    // checking is this url exist in real 
    const response = await axios.get(url, {
    timeout:5000,// wait 5 sec if not endtimeout
    validateStatus: () => true // so not get error for  401 and other as it consider only sucess as 200-299
    });


    const Monitor  = await MonitorModel.create({
        url : normalizedUrl,
        userId: req.user.userId,
       
    });

    req.userUrl = Monitor;
    // if(status >= 200 && status < 400) {

    // }
    // res.json(response.status);    // 200 OK
    // 301 Redirect
    // 404 Not Found
    // 500 Server Error
    // 503 Service Unavailable


    next();

    }catch(err){
    //     const user  = await user_url.create({
    //     url,
    //     status : null,
    //     responseTime :null ,
    //     errorCode : err.code,
    //     errorMessage:err.message,
    //     isUp : false
    // });

    // req.userUrl = user;
    return res.status(400).json({
        name: err.message
    });
    }
}

module.exports = UrlValidator;