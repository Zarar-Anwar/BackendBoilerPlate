const express=require('express')
const AdminControllers = require('../controllers/adminController')
const adminPermission = require('../middleware/adminPermission')
const adminRouter=express.Router()

adminRouter.post('/admin/login',AdminControllers.adminLogin)

adminRouter.get('/create/admin',adminPermission,AdminControllers.adminLogin)


module.exports=adminRouter