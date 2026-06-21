const cron = require('node-cron');
const MonitorModel = require('../models/monitor.model');
const axios  = require('axios');
const check_url = require('../models/check.models');

const checkurl = () => {
    // Runs every 10 minutes
    cron.schedule('0 */10 * * * *', async () => {
        try {
            const monitors = await MonitorModel.find({
                active: true
            });

            await Promise.all(
                monitors.map(async (monitor) => {
                    try {
                        const start = Date.now();

                        const response = await axios.get(monitor.url, {
                            timeout: 5000,
                            validateStatus: () => true
                        });

                        const responseTime = Date.now() - start;

                        await check_url.create({
                            url: monitor.url,
                            status: response.status,
                            responseTime,
                            isUp:
                                response.status >= 200 &&
                                response.status < 300,
                            monitorid: monitor._id
                        });

                        await MonitorModel.findByIdAndUpdate(
                            monitor._id,
                            {
                                lastCheckedAt: new Date(),
                                nextCheckedAt: new Date(
                                    Date.now() +
                                        monitor.interval * 1000
                                )
                            }
                        );
                    } catch (err) {
                        console.error(
                            `Failed checking ${monitor.url}:`,
                            err.message
                        );

                        await check_url.create({
                            url: monitor.url,
                            status: null,
                            responseTime: null,
                            isUp: false,
                            errorCode: err.code || null,
                            errorMessage: err.message,
                            monitorid: monitor._id
                        });

                        await MonitorModel.findByIdAndUpdate(
                            monitor._id,
                            {
                                lastCheckedAt: new Date(),
                                nextCheckedAt: new Date(
                                    Date.now() +
                                        monitor.interval * 1000
                                )
                            }
                        );
                    }
                })
            );
        } catch (err) {
            console.error('Cron Job Error:', err);
        }
    });
};

       
    
const getMonitorChecks = async(req,res)=>{

try{

    const monitor = await MonitorModel.findOne({
        _id:req.params.id,
        userId:req.user.userId
    });

    if(!monitor){

        return res.status(404).json({
            success:false,
            message:"Monitor not found"
        });

    }


    const checks = await check_url.find({
        monitorid:req.params.id
    })
    .sort({
        checkedAt:-1
    });


    res.json({
        success:true,
        data:checks
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

}



module.exports = {
    checkurl,
    getMonitorChecks
};