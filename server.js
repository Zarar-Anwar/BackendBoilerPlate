const  dotenv=require( 'dotenv')
dotenv.config()

const  express=require( 'express')

const router1=require("./routes/adminRoutes")
const router2=require("./routes/userRoutes")

const   cors=require( 'cors')
const bodyParser = require('body-parser');

// Connection file of Database

const connection = require ("./model/connection/connection")



const app=express()
const path = require('path');


// Use when Adding React Build to Server File
app.use(express.static(path.join(__dirname, 'build')));


// Add when to show images from here to React
app.use(express.static(path.join(__dirname, 'public')));

// Handle all remaining routes and send the React app's entry HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const port=process.env.PORT 
	
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	  });
	  app.use(cors({
		origin: 'http://localhost:3000', // Replace with your frontend domain
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the HTTP methods you're using
		allowedHeaders: ['Content-Type', 'Authorization'], // Add the headers you're using
	  }));
	app.use(express.json({ limit: '100mb' }));
	app.use(express.urlencoded({ limit: '100mb', extended: true }));



	// Routes
	app.use('/',router1)
	app.use('/',router2)

app.listen(port,()=>{
    console.log(`The Server is Running at http://localhost:${port}`)
})