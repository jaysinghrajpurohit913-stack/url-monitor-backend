const MonitorModel = require('../models/monitor.model');


const getmonitors   =  async (req , res )=>{
     try {

        const monitors = await MonitorModel.find({
            userId: req.user.userId
        });

        res.json({
            success: true,
            data: monitors
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const deleteAllMonitor  =  async (req , res )=>{
     try {

        const monitors = await MonitorModel.findByIdAndDelete({
            userId: req.user.userId
        });

        res.json({
            success: true,
            data: monitors
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}



module.exports = {
    getmonitors,
    deleteAllMonitor

}