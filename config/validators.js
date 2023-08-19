const validator = require("validator");
const zxcvbn = require("zxcvbn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const commonPasswords = ["123456", "abcdef", "password", "passwords"];

// Validating Email

const validate_email = (value) => {
  return validator.isEmail(value);
};

// Validating Password

const validate_password = (value) => {
  if (/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value)) {
    return false;
  }

  if (commonPasswords.includes(value)) {
    return false;
  }

  const passwordStrength = zxcvbn(value);
  return passwordStrength.score >= 6;
};

// Hashing Password

const hashedPassword = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(value, salt);
  return hashPassword;
};

// Generating Token

const genToken = async (value) => {
  const token = jwt.sign({ userId: value }, process.env.JwtKey, {
    expiresIn: "5d",
  });
  return token
};

// Sending Email to User

const sendMail=async(value)=>{
  const secret = value.id + process.env.JwtKey;
  const token = jwt.sign({ userId: value.id }, secret, {
    expiresIn: "15min",
  });
  const link = `http://localhost:5000/user/verify/email/${value.id}/${token}`;
  const info = {
    from: process.env.EMAIL_FROM,
    to: value.email,
    subject: "Zaala Society Verification of  Email :",
    html: `<h1><a href=${link}>Click me</a> to  Verify your Email:</h1>`,
  };
  return info
}


module.exports = { sendMail,validate_email, validate_password, hashedPassword,genToken};
