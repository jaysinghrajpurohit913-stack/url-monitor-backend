const cron = require('node-cron');
const MonitorModel = require('../models/monitor.model');
const axios  = require('axios');
const check_url = require('../models/check.models');

const checkurl  = async(req , res ) =>{
    //  * * * * * * => S M H D W Y
    cron.schedule('0 */10 * * * *', async() => {
        const monitors = await MonitorModel.find({
            active:true
            });
        
        await Promise.all(
                monitors.map(async monitor => {
                
        const url  = monitor.url;
        const start = Date.now();
        const response = await axios.get(url, {
        timeout:5000,// wait 5 sec if not endtimeout
        validateStatus: () => true // so not get error for  401 and other as it consider only sucess as 200-299
        });
        const end = Date.now();

        const responseTime = end - start;
        const status = response.status;
        let isUp = false;

        if(status>=200 && status<299){
            isUp = true;
        }
         
        const user  = await check_url.create({
                url,
                status ,
                responseTime ,
                isUp,
                monitorid:monitor._id
        });

        // console.log(`response ${user} of ${monitor} `);

                    // check url
                   })
        )

    //     for (monitor in monitors){

    //     const url  = monitors[monitor].url;

    //     const start = Date.now();
    //     const response = await axios.get(url, {
    //     timeout:5000,// wait 5 sec if not endtimeout
    //     validateStatus: () => true // so not get error for  401 and other as it consider only sucess as 200-299
    //     });
    //     const end = Date.now();

    //     const responseTime = end - start;
    //     const status = response.status;
    //     let isUp = false;

    //     if(status>=200 && status<299){
    //         isUp = true;
    //     }
         
    //     const user  = await check_url.create({
    //             url,
    //             status ,
    //             responseTime ,
    //             isUp,
    //             monitorid:monitors[monitor]._id
    //     });

    //     console.log(`response ${user} of ${monitors[monitor]} `);

    // };

    })
   
        
    // checking is this url exist in real 
    
    }

       
    
    



module.exports = checkurl;