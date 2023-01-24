const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, sucess } = require("../Utills/responseWrapper");
const clodinary = require("cloudinary").v2;

//SIGNUP CONTROLLER
const signupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.send(error(400, "All Field Are Required"));
    }

    const olduser = await User.findOne({ email });

    if (olduser) {
      // return res.status(400).send("User is Alredy present");
      return res.send(error(400, "User is Alredy present"));
    }

    const hashpassword = await bcrypt.hash(password, 10);

    // const cloudeImg = await clodinary.uploader.upload(dpimage, {
    //   folder: "userDp",
    // });

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      // avatar: {
      //   publicId: cloudeImg.public_id,
      //   url: cloudeImg.url,
      // },
    });

    return res.send(
      sucess(200, {
        user,
      })
    );
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(404).send("All Field Are Required");.
      return res.send(error(400, "All Field Are Required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      // return res.status(404).send("User not register");
      return res.send(error(400, "User not register"));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // return res.status(403).send("Password not matched");
      return res.send(error(400, "Password not matched"));
    }

    const accessToken = generalAccessToken({
      _id: user._id,
    });

    const refreshToken = generalRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.json(sucess(200, { accessToken }));
  } catch (e) {
    console.log(error(500, e.message));
  }
};
//LOGOUT CONTROLLER
const logOutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(sucess(200, "User Logout succesfully"));
  } catch (e) {
    return res.send(error(501, e.message));
  }
};
//REFRESH TOKEN CONTROLLER
const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token Required");
    return res.send(error(401, "Refresh token Required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.ACESS_REFRESH_KEY
    );

    const _id = decoded._id;
    // console.log(_id);
    const accessToken = generalAccessToken({ _id });

    return res.send(sucess(200, { accessToken }));
  } catch (e) {
    // console.log(error);
    // return res.send("Invalid Refresh Token");
    return res.send(error(400, "Enter refresh token"));
  }
};

//ACCESSE TOKEN
const generalAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACESS_TOKEN_KEY, {
    expiresIn: "1y",
  });
  return token;
};

const generalRefreshToken = (data) => {
  const token = jwt.sign(data, process.env.ACESS_REFRESH_KEY, {
    expiresIn: "1y",
  });
  return token;
};

module.exports = {
  signupController,
  loginController,
  refreshTokenController,
  logOutController,
};
