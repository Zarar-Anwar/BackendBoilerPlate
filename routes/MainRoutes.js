const router1=require("./adminRoutes")
const router2=require("./userRoutes")

const routes=(app)=>{

    // User Routes--------------------------------------------
    app.use('/user',router1)

    // Admin Routes--------------------------------------------
	app.use('/admin',router2)
}

module.exports=routes