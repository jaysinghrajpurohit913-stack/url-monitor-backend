const express =  require('express');
const route = express.Router();
const {UserInput , UserLogin} = require('../controller/user.controller');

route.post('/user/signup', UserInput,(req , res ) =>{
    res.send({
      message : "signup done"
    })

})

route.post('/user/login' , UserLogin , (req , res)=>{
    res.send({
      message : "login done"
    })
})




module.exports = route;