const db = require("../model/connection/connection");
const bcrypt=require('bcrypt')
const User=db.user
const commonPasswords=['123456','abcdef','password','passwords']
const jwt=require('jsonwebtoken')


// Users Logics

class userController {

  // User Registration
 
  static Registration = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email: email } });
  
    if (user) {
      res.status(404).send({ message: "Email Already Exist" });
    } else {
      if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
  
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email)) {
            res.status(400).send({ message: "Invalid email format" });
          } else if (password.length < 6) {
            res.status(400).send({ message: "Password should be at least 6 characters long" });
          } else if (commonPasswords.includes(password.toLowerCase())) {
            res.status(400).send({ message: "Password is too Common" });
          } else if (!(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(password))) {
            res.status(400).send({ message: "Password should not be just numeric or simple letters" });
          } else {
            await User.create({
              name: name,
              email: email,
              password: hashPassword,
            });
            const saveUser = await User.findOne({ where: { email: email } });
            const token = jwt.sign({ userId: saveUser.id }, process.env.JwtKey, { expiresIn: '5d' });
            res.send({ "status": "Success", "msg": "Register SuccessFully", "token": token });
          }
        } else {
          res.status(404).send({ message: "Password and Password Confirmation do not match" });
        }
      } else {
        res.status(404).send({ message: "All Fields are Required" });
      }
    }
  }

//  Authenticating USer Login 

static Login = async (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    try {
      const user = await User.findOne({ where: { email: email } });
      
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          const token = jwt.sign({ userId: user.dataValues.id }, process.env.JwtKey, { expiresIn: "5d" });
          res.send({ user: user.dataValues, token: token });
        } else {
          res.status(401).send({ message: "Invalid email or password" });
        }
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  } else {
    res.status(400).send({ message: "All fields are required" });
  }
};
 

// Resetting USers PAssword Forget Password 

static resetpasswordemail=async(req,res)=>{
  const {email}=req.body
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)){
    res.status(400).send({ message: "Invalid email format" });
  }else{
    if(email){
      const user=await User.findOne({where:{email:email}})
      if(user){
        const secret=user.dataValues.id+process.env.JwtKey
        const token =jwt.sign({userId:user.dataValues.id},secret,{expiresIn:"15min"} )
        const link=`http://localhost:3000/reset/password/${user.dataValues.id}/${token}`
        const info={
          from:process.env.EMAIL_FROM,
          to:user.dataValues.email,
          subject:"Zaala Society Password Reset Email :",
          html:`<h1><a href=${link}>Click me</a> to  Reset Your Password :</h1>`
        }
        try {
          res.send({"status":"Success",message:"Reset Email Send Please check Your Email in Spum Box:"})
          await transporter.sendMail(info)
        } catch (error) {
          
          res.status(404).send({message:"Error While Sending Email"})
        }
      }else{
        res.status(404).send({message:"Email did Not found "})
      }
    }else{
      res.status(404).send({message:"All Fields Are Required"})
    }
  }
  }

  // Updating User Password 
  
  static passwordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await User.findOne({ where: { id: id } });
    const new_token = user.id + process.env.JwtKey;
  
    try {
      const checking = jwt.verify(token, new_token);
      
      if (checking) {
        if (password && password_confirmation) {
          if (password == password_confirmation) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            
            // Update the user's password in the database
            try {
              await User.update({ password: hashPassword }, { where: { id: id } });
              res.send({ "status": "Success", "msg": "Password Reset Successfully:" });
            } catch (error) {
              res.status(500).send({ message: "Error updating password" });
            }
          } else {
            res.status(400).send({ message: "Password and Password Confirmation do not Match" });
          }
        } else {
          res.status(400).send({ message: "All Fields are Required" });
        }
      } else {
        res.status(400).send({ message: "Token Did not Matched" });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(400).send({ message: "Token has expired" });
      } else {
        res.status(400).send({ message: "Invalid token" });
      }
    }
  };
  
}


  

module.exports=userController