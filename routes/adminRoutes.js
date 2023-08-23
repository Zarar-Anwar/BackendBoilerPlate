const express=require('express')
const AdminControllers = require('../controllers/adminController')
const adminPermission = require('../middleware/adminPermission')
const adminRouter=express.Router()

adminRouter.get('/create/admin',adminPermission,AdminControllers.adminLogin)

adminRouter.post('/login',AdminControllers.adminLogin)


module.exports=adminRouter