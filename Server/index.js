const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const connectDB = require("./dbConnect");
const authRouter = require("./Router/authRouter");
const postRouter = require("./Router/postRouter");
const userRouter = require("./Router/userRouter");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dm8ko4b2g",
  api_key: "816112386183861",
  api_secret: "n1KeQkhbIlnkgycUlFpZGpUKAmQ",
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", //FRONTEND SERVER LINK
  })
);
//MIDDLEWARE
app.use(express.json({ limit: "1gb" }));
app.use(morgan("common"));
app.use(cookieParser());

const PORT = process.env.PORT || 4001;

//mongoose username and password
// const user = gautam;
// const password = TsNNKYwdKtxMn1hf;

app.use("/auth", authRouter);
app.use("/postapi", postRouter);
app.use("/user", userRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`listing on port number ${PORT}`);
});
