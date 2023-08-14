const express=require('express')
const userController=require('../controllers/userController')
const updatepassword = require('../middleware/updatepassword')
const userRouter=express.Router()

userRouter.post('/user/registration',userController.Registration)

userRouter.post('/user/login',userController.Login)

userRouter.post("/reset/password/email",userController.resetpasswordemail)

userRouter.post("/reset/password/:id/:token",userController.passwordReset)



module.exports=userRouter