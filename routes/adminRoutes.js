const express=require('express')
const updatepassword = require('../middleware/updatepassword')
const AdminControllers = require('../controllers/adminController')
const adminRouter=express.Router()

adminRouter.post('/user/login',AdminControllers.Login)



module.exports=adminRouter