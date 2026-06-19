const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({
    url : {
        type: String,
        required : true,
        trim:true,
        index: true
    },
    status : {
        type: Number,
    },
    responseTime : {
        type: Number,
    },
    isUp:{
        type: Boolean,
         required : true,
    },
    errorCode:{
        type: String,
        default : null
    },
    errorMessage:{
        type: String,
        default : null
    },
    checkedAt: {
    type: Date,
    default: Date.now(),
    expires:"1d"
    },
    monitorid:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "monitors"
    }
    
})

const check_url = mongoose.model('checks',UrlSchema);
module.exports = check_url;