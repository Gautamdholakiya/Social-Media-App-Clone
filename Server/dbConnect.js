const mongoose = require("mongoose");

module.exports = async (req, res) => {
  const mongoUri =
    "mongodb+srv://gautam:TsNNKYwdKtxMn1hf@cluster0.sw6mrs8.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(
      mongoUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("MONGODB ATLAS Connect Sucessfully");
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
