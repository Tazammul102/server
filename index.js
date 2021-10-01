const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
require("./db");
const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(express.json());
const host = process.env.HOST_NAME;

app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Server Running at http://${host}:${port}`);
});
