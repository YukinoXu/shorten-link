const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

const userRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const urlRouter = require("./routes/urls");
app.use(userRouter);
app.use(loginRouter);
app.use(urlRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
