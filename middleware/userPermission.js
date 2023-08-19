const jwt   =require("jsonwebtoken");
const db = require("../models");
const User=db.user

//Checking User Permission MiddleWares

const userPermission = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(" ")[1];
      const { userId } = jwt.verify(token, process.env.JwtKey);
      req.user = await User.findOne({where:{id:userId}});
      next(); 
    } catch (error) {
      res.status(401).send({ message: "Unauthorized: Invalid or expired token" });
    }
  } else {
    next(); 
  }
};

module.exports= userPermission