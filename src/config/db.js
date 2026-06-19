const mongoose  = require('mongoose');

async function connectiontoDB(){
  try {

        await mongoose.connect(process.env.MONGO_URL);

        console.log("DB CONNECTED");

    } catch (err) {

        console.error("MONGO ERROR");
        console.error(err);

    }
}

module.exports = connectiontoDB;