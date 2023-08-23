const bcrypt=require('bcrypt')
const db = require('../models')
const { genToken } = require('../config/validators')
const Admin=db.admin


//ADMIN LOGICS

class AdminControllers{

    //Should Removed this Code when Production
    // Creating Admin

    static createAdmin=async(req,res)=>{
        const password='zalazala'
        const salt=bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const admin=await Admin.create({
            name:"Admin",
            email:"adminZaala@exarth.com",
            password:hashedPassword
        })
        res.send("Admin Created")
    }

    //Authenticating Admin Login

    static adminLogin = async (req, res) => {
        const { email, password } = req.body;
        
        if (email && password) {
            const user = await Admin.findOne({ where: { email: email } });
            
            if (user) {
              const isMatch = await bcrypt.compare(password, user.password);
      
              if (isMatch) {
                const token = genToken(user.dataValues)
                res.send({ user: user.dataValues, token: token });
              } else {
                res.status(401).send({ message: "Invalid email or password" });
              }
            } else {
              res.status(404).send({ message: "User not found" });
            }
        } else {
          res.status(400).send({ message: "All fields are required" });
        }
      };
       
    

}


module.exports=AdminControllers