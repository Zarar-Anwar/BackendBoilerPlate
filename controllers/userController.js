const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.user;
const jwt = require("jsonwebtoken");
const {
  validate_email,
  hashedPassword,
  validate_password,
  genToken,
  sendMail,
} = require("../config/validators");
const transporter = require("../config/emailconfig");

// Users Logics

class userController {
  // Getting All Users

  static getObject = async (req, res) => {
    const users = await User.findAll();
    if (users) {
      res.send(users);
    } else {
      res.send({ message: "No objects available" });
    }
  };

  // Getting Specific User

  static specificObject = async (req, res) => {
    const { id } = req.params;
    if (id) {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        res.send(user.dataValues);
      } else {
        res.send({ message: "Object not Found" });
      }
    } else {
      res.send({ message: "Required Assentials" });
    }
  };

  // Deleting Specific User

  static deleteObject = async (req, res) => {
    const { id } = req.params;
    if (id) {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        await User.destroy({ where: { id: id } });
        res.send({ message: "Object Deleted SuccessFully" });
      } else {
        res.send({ message: "Object not Found" });
      }
    } else {
      res.send({ message: "Required Assentials" });
    }
  };

  // Update User

  static updateObject = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (id && name) {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        await User.update({ name: name }, { where: { id: id } });
        res.send({ message: "Object  Updated" });
      } else {
        res.send({ message: "Object not Found" });
      }
    } else {
      res.send({ message: "Required Assentials" });
    }
  };

  // Creating User

  static createObject = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      res.status(400).send({ message: "Email Already Exists" });
    } else {
      if (name && email && password) {
        const Password = await hashedPassword(password);
        if (!validate_email(email)) {
          res.status(400).send({ message: "Invalid email format" });
        } else if (password.length < 6) {
          res.status(400).send({
            message: "Password should be at least 6 characters long",
          });
        } else if (validate_password(password)) {
          res.status(400).send({ message: "Password is too common" });
        } else {
          await User.create({
            name: name,
            email: email,
            password: Password,
          });
          const saveUser = await User.findOne({ where: { email: email } });
          const token = await genToken(saveUser.dataValues.id);

          // sending Verification Email
          try {
            const linker = await sendMail(saveUser.dataValues); // Assuming this returns mailOptions

            // Use transporter to send the email
            transporter.sendMail(linker, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
                res
                  .status(500)
                  .send({ message: "Error Occurred While Sending Email" });
              } else {
                const token = genToken(saveUser.dataValues.id);
                res.status(201).send({
                  message: "Mail Sent to you. Please Check to Verify Email",
                  token: token,
                });
              }
            });
          } catch (error) {
            console.error("Error preparing email content:", error);
            res
              .status(500)
              .send({ message: "Error Occurred. Please Try Again" });
          }
        }
      } else {
        res.status(400).send({ message: "All Fields are Required" });
      }
    }
  };

  // Verifying Gmail

  static verifyGmail = async (req, res) => {
    const { id, token } = req.params;
    if (id && token) {
      const user = await User.findOne({ where: { id: id } });
      const new_token = user.id + process.env.JwtKey;
      try {
        const checking = jwt.verify(token, new_token);
        if (checking) {
          await User.update({ isEmailVerified: true }, { where: { id: user.dataValues.id } });
          res.status(200).send({ message: "Email Verified" });
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
    } else {
      res
        .status(404)
        .send({ message: "Something Went Wrong PLease Try Agian" });
    }
  };

   //  Authenticating USer Login

   static userLogin = async (req, res) => {
    const { email, password } = req.body;
 console.log(email)
    if (email && password) {
      try {
        const user = await User.findOne({ where: { email: email } });
        if(user.dataValues.isEmailVerified){

        if (user) {
          const isMatch = await validate_password(password)
          console.log(isMatch)
          if (isMatch) {
            const token = jwt.sign(
              { userId: user.dataValues.id },
              process.env.JwtKey,
              { expiresIn: "5d" }
            );
            res.send({ message:"Login Successfully" });
          } else {
            res.status(401).send({ message: "Invalid email or password" });
          }
        } else {
          res.status(404).send({ message: "User not found" });
        }
      }else{
        res.status(400).send({message:"Email is not Verified"})
      }
      } catch (error) {
        res.status(500).send({ message: "Internal server error" });
      }
    } else {
      res.status(400).send({ message: "All fields are required" });
    }
  };








  

  // Boiler plate Code

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
            res.status(400).send({
              message: "Password should be at least 6 characters long",
            });
          } else if (commonPasswords.includes(password.toLowerCase())) {
            res.status(400).send({ message: "Password is too Common" });
          } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(password)) {
            res.status(400).send({
              message: "Password should not be just numeric or simple letters",
            });
          } else {
            await User.create({
              name: name,
              email: email,
              password: hashPassword,
            });
            const saveUser = await User.findOne({ where: { email: email } });
            const token = genToken(saveUser.dataValues.id);
            res.send({
              status: "Success",
              msg: "Register SuccessFully",
              token: token,
            });
          }
        } else {
          res.status(404).send({
            message: "Password and Password Confirmation do not match",
          });
        }
      } else {
        res.status(404).send({ message: "All Fields are Required" });
      }
    }
  };

 

  // Resetting USers PAssword Forget Password

  static resetpasswordemail = async (req, res) => {
    const { email } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      res.status(400).send({ message: "Invalid email format" });
    } else {
      if (email) {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
          const linker = sendMail(user.dataValues);
          try {
            await transporter.sendMail(linker);
            res.send({
              status: "Success",
              message: "Reset Email Send Please check Your Email in Spum Box:",
            });
          } catch (error) {
            res.status(404).send({ message: "Error While Sending Email" });
          }
        } else {
          res.status(404).send({ message: "Email did Not found " });
        }
      } else {
        res.status(404).send({ message: "All Fields Are Required" });
      }
    }
  };

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
              await User.update(
                { password: hashPassword },
                { where: { id: id } }
              );
              res.send({
                status: "Success",
                msg: "Password Reset Successfully:",
              });
            } catch (error) {
              res.status(500).send({ message: "Error updating password" });
            }
          } else {
            res.status(400).send({
              message: "Password and Password Confirmation do not Match",
            });
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

module.exports = userController;
