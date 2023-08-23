const router1=require("./userRoutes")
const router2=require("./adminRoutes")

const routes=(app)=>{

    // User Routes--------------------------------------------
    app.use('/user',router1)

    // Admin Routes--------------------------------------------
	app.use('/admin',router2)
}

module.exports=routes