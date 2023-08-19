const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
//Admin Checking Permission Middle Ware

const adminPermission = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { userId } = jwt.verify(token, process.env.JwtKey);

      req.user = await User.findOne({ where: { id: userId } }).select(
        "-password"
      );
    } catch (error) {
      res.status(404).send({ message: "Unauthorization token not Found" });
    }
  }
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(404).send({ message: "Unauthorization" });
  }
};


module.exports = adminPermission;
