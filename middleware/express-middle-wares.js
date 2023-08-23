const cors = require("cors");
const express = require("express");
const middlewares=(app)=>{
    
    // Allow Access MiddleWares-----------------------------------------------------------------------
    app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	  });
    
    // Cors Access MiddleWares-------------------------------------------------------------------------
	app.use(cors({
		origin: 'http://localhost:3000', // Replace with your frontend domain
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the HTTP methods you're using
		allowedHeaders: ['Content-Type', 'Authorization'], // Add the headers you're using
	  }));
    
    // Data Access MiddleWares-------------------------------------------------------------------------
	app.use(express.json({ limit: '100mb' }));
	app.use(express.urlencoded({ limit: '100mb', extended: true }));
}

module.exports=middlewares