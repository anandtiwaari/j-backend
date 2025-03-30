const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const emailRoutes = require("./Routes/emailRoutes/index");
const connectToDB = require("./Db/index");
const authRoutes = require("./Routes/emailRoutes/authRoutes");
require("./Cron/index");
dotenv.config();
const cors = require("cors");
const validateToken = require("./Middleware/validateToken");

const app = express();
app.use(bodyParser.json());

app.use(cors());

const port = 8000;
connectToDB();
app.get("/", (req, res) => {
  res.send("working now");
});

// Use Routes
app.use("/api", emailRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is Live on the  ${port}  🚀`);
});
