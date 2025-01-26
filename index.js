const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const emailRoutes = require("./Routes/emailRoutes/index");
require("./Cron/index");
dotenv.config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

const port = 8000;

// Connect to MongoDB
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

app.get("/", (req, res) => {
  res.send("working now");
});

// Use Routes
app.use("/api", emailRoutes);

app.listen(port, () => {
  console.log(`Server is Live on the  ${port}  🚀`);
});
