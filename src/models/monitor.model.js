const mongoose = require('mongoose');

const MonitorSchema = new mongoose.Schema({
    url: {
        type : String,
        required : true,
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
    },
    interval:{
        type : Number,
        default : 300
    },
    active:{
        type:Boolean,
        default:true
    },
    lastCheckedAt:{
        type : Date,
        default : null
    },
    nextCheckedAt:{
        type:Date,
        default: () => new Date(Date.now() + 300 * 1000)
    }
    
})

const MonitorModel = mongoose.model('monitors' , MonitorSchema);
module.exports = MonitorModel;