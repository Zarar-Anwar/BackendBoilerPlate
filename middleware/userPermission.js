const jwt   =require("jsonwebtoken")
const db = require("../model/connection")
const User=db.user

//Checking User Permission MiddleWares

const userPermission=async(req,res,next)=>{
    let token
    const {authorization}=req.headers
    if(authorization && authorization.startsWith('Bearer'))
    {
  try {
      
      token=authorization.split(" ")[1]
      const {userId}=jwt.verify(token,process.env.JwtKey)

      req.user=await User.findById(userId).select('-password')

      
  } catch (error) {
    res.status(404).send({message:"Unauthorization token not Found"})
  }
    }
    next()
}


module.exports= userPermission