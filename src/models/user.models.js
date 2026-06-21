const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        trim:true,
       lowercase:true,
        minlength:[3,"Username must be atleast 3 character long "]

    },
    Email : {
        type: String,
        required : true,
        unique : [true,"Its not available"],
        trim:true,
       lowercase:true,
    },
    password :{
        type: String,
        required : true,
        trim:true,
        minlength:[3,"Username must be atleast 5 character long "],
    },
    count:{
        type: Number,
        default : 0  // for number of  monitor
    }
})

const UserModel = mongoose.model('users',userSchema);
module.exports = UserModel;