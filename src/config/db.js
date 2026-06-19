const mongoose  = require('mongoose');

async function connectiontoDB(){
   await mongoose.connect(process.env.MONGO_URL).then(()=>{
            console.log(" DB IS CONNECTED ");
        })
}

module.exports = connectiontoDB;