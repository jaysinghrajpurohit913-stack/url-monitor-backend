const MonitorModel = require('../models/monitor.model');
const check_url = require("../models/check.models");

const getmonitors = async(req,res)=>{

try{

    const monitors = await MonitorModel.find({
        userId:req.user.userId
    }).lean();


    const result = await Promise.all(

        monitors.map(async monitor=>{

            const latestCheck = await check_url
            .findOne({
                monitorid:monitor._id
            })
            .sort({
                checkedAt:-1
            });

            return{
                ...monitor,
                latestCheck
            };

        })

    );


    res.json({
        success:true,
        data:result
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

}


const deleteAllMonitor = async(req,res)=>{

try{

    const monitors = await MonitorModel.find({
        userId:req.user.userId
    });

    

    const monitorIds = monitors.map(
        monitor => monitor._id
    );


    await check_url.deleteMany({
        monitorid:{
            $in:monitorIds
        }
    });


    await MonitorModel.deleteMany({
        userId:req.user.userId
    });
     // Reset count
     await UserModel.findByIdAndUpdate(
            req.user.userId,
            {
                $set: { count: 0 }
            }
        );


    res.json({
        success:true
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

}


const deleteMonitor = async(req,res)=>{

try{

    await UserModel.findByIdAndUpdate(
    req.user.userId,
    {
        $inc:{ count:-1 }
    }
);
    const monitor = await MonitorModel.findOneAndDelete({
        _id:req.params.id,
        userId:req.user.userId
    });

    if(monitor){

        await check_url.deleteMany({
            monitorid:monitor._id
        });

    }


    res.json({
        success:true
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
    getmonitors,
    deleteAllMonitor,
    deleteMonitor,
}