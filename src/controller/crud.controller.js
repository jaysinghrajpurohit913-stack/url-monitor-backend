const MonitorModel = require('../models/monitor.model');
const check_url = require("../models/check.models");
const UserModel = require("../models/user.models");

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
            }).lean();

           return {
         monitorId: monitor._id,
         url: monitor.url,
        active: monitor.active,

        latestCheck: latestCheck
        ? {
            isUp: latestCheck.isUp,
            status: latestCheck.status,
            responseTime: latestCheck.responseTime,
            checkedAt: latestCheck.checkedAt
          }
        : null
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

    const monitor = await MonitorModel.findOneAndDelete({
        _id:req.params.id,
        userId:req.user.userId
    });

    if(!monitor){
        return res.status(404).json({
            success:false,
            message:"Monitor not found"
        });
    }

    await check_url.deleteMany({
        monitorid:monitor._id
    });

    await UserModel.findByIdAndUpdate(
        req.user.userId,
        {
            $inc:{ count:-1 }
        }
    );

    res.json({
        success:true,
        message:"Monitor deleted successfully"
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

}

const toggleMonitor = async(req,res)=>{

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

    monitor.active = !monitor.active;

    // if(monitor.active){
    //     monitor.nextCheckedAt = new Date();
    // }

    await monitor.save();

    res.json({
        success:true,
        active:monitor.active,
        message: monitor.active
            ? "Monitor resumed"
            : "Monitor paused"
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

}

const getMonitorStats = async(req,res)=>{

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

    const totalChecks = await check_url.countDocuments({
        monitorid:req.params.id
    });

    const successfulChecks = await check_url.countDocuments({
        monitorid:req.params.id,
        isUp:true
    });

    const failedChecks =
        totalChecks - successfulChecks;

    const uptimePercentage =
        totalChecks === 0
        ? 0
        : Number(
            (
                (successfulChecks / totalChecks) * 100
            ).toFixed(2)
        );

    res.json({
        success:true,
        stats:{
            totalChecks,
            successfulChecks,
            failedChecks,
            uptimePercentage
        }
    });

}
catch(err){

    res.status(500).json({
        success:false,
        message:err.message
    });

}

};

module.exports = {
    getmonitors,
    deleteAllMonitor,
    deleteMonitor,
    toggleMonitor,
    getMonitorStats
}