const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { error } = require("../Utills/responseWrapper");
module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(error(401, "Authentication header is required"));
  }

  const accesstoken = req.headers.authorization.split(" ")[1];
  console.log(accesstoken);

  try {
    const decode = jwt.verify(accesstoken, process.env.ACESS_TOKEN_KEY);

    req._id = decode._id;

    const user = await User.findById(req._id);

    if (!user) {
      return res.send(error(404, "User Not Found"));
    }
    next();
  } catch (e) {
    console.log(e);
    return res.send(error(401, "Invalid Token Key"));
  }
};
