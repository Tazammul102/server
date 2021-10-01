const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

// ROUTE 1: Register User And Store Data in Database : No Login Required

router.post("/register", async (req, res) => {
  const { email, name, phone, password, cpassword } = req.body;
  try {
    if (!email || !name || !phone || !password || !cpassword) {
      return res.json({ error: "Please Fill All Details Correctly" });
    }
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "Email Already Exist" });
    }
    if (password !== cpassword) {
      return res.status(400).json({ error: "Password Doesn't Match" });
    }
    let salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(password, salt);
    const user = new Users({ name, email, phone, password: secPass });
    user.save();
    res.send(user);
  } catch (error) {
    res.send("Internal Server Error");
  }
});

// ROUTE 2: Login User into Database : No Login Required

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({ error: "Please Fill All Details Correctly" });
    }
    const users = await Users.findOne({ email });
    if (!users) {
      return res.status(400).json({ error: "Invalid Credentials" });
    } else {
      const comparePassword = await bcrypt.compare(password, users.password);
      if (!comparePassword) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else {
        const data = {
          user: {
            id: users.id,
          },
        };
        const token = jwt.sign(data, process.env.JWT_SERET_KEY);
        res.json({ token });
      }
    }
  } catch (error) {
    res.send("Internal Server Error");
  }
});

router.get("/listallusers", async (req, res) => {
  const users = await Users.find();
  res.json(users);
});
router.get("/usersdetail", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await Users.findById(userId).select("-password");
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/detele/:id", async (req, res) => {
  const id = req.params.id;
  // const users = await Users.find();
  const user = await Users.findByIdAndDelete(id);
  res.json(user);
});

module.exports = router;
