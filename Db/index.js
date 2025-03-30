const mongoose = require("mongoose");
const connectToDB = () => {
  mongoose
    .connect(
      "mongodb+srv://anandt607:bzTFmWWVs4uLQtq9@cluster0.x0vrg1o.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
};
module.exports = connectToDB;
