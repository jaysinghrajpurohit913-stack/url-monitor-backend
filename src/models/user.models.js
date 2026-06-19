const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        trim:true,
        lowecase:true,
        unique: [true,"Its not available"],
        minlength:[3,"Username must be atleast 3 character long "]

    },
    Email : {
        type: String,
        required : true,
        unique : [true,"Its not available"],
        trim:true,
        lowecase:true,
        unique: true,
    },
    password :{
        type: String,
        required : true,
        trim:true,
        minlength:[3,"Username must be atleast 5 character long "],
    }
})

const UserModel = mongoose.model('users',userSchema);
module.exports = UserModel;