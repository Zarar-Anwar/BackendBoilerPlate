const db = require("../model/connection/connection");
const Admin=db.admin
const bcrypt=require('bcrypt')


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
          try {
            const user = await Admin.findOne({ where: { email: email } });
            
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
       
    

}


module.exports=AdminControllers