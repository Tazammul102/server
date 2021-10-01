const mongoose = require("mongoose");

const DB = process.env.DB;

mongoose.connect(DB, async (err) => {
  if (err) throw err;
  console.log("conncted to db");
});
