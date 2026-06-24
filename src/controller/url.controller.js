const axios = require('axios');
const UserModel = require('../models/user.models');
const MonitorModel = require('../models/monitor.model');
const check_url = require('../models/check.models');

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
    url:normalizedUrl
    });

if (existingMonitor) {
    return res.status(400).json({
        success: false,
        message: "URL already being monitored"
    });
}

    // checking is this url exist in real 
    const start = Date.now();
    const response = await axios.get(normalizedUrl, {
    timeout:5000,// wait 5 sec if not endtimeout
    validateStatus: () => true // so not get error for  401 and other as it consider only sucess as 200-299
    });
    const responseTime = Date.now() - start;

   const user = await UserModel.findOneAndUpdate(
  {
    _id: req.user.userId,
    count: { $lt: 10 }
  },
  {
    $inc: { count: 1 }
  },
  {
     returnDocument: 'after'
  }
);

    if (!user) {
      return res.status(400).json({
       message: "Count limit reached (max 10)"
     });
    }

        const Monitor  = await MonitorModel.create({
        url : normalizedUrl, 
        userId: req.user.userId,
       
    });

    req.userUrl = Monitor; 

    const check = await check_url.create({
    url: normalizedUrl,
    status: response.status,
    responseTime,
    isUp: response.status < 400,
    monitorid: Monitor._id
});
    

return res.status(201).json({
    success:true,
    monitor:{
        id: Monitor._id,
        url: Monitor.url
    },
    latestCheck:{
        status: check.status,
        responseTime: check.responseTime,
        isUp: check.isUp
    }
});
    
    // res.json(response.status);    // 200 OK
    // 301 Redirect
    // 404 Not Found
    // 500 Server Error
    // 503 Service Unavailable



    }catch(err){

    await Check_url.create({
    url: normalizedUrl,
    status: null,
    responseTime: null,
    isUp:false,
    errorCode: err.code,
    errorMessage: err.message,
    monitorid: monitor._id
  });

  res.status(201).json({
    success:true,
    monitor:{
        id: monitor._id,
        url: monitor.url
    },
    latestCheck:{
        isUp:false,
        errorCode:err.code,
        errorMessage:err.message
    }
});

}
}

module.exports = UrlValidator;