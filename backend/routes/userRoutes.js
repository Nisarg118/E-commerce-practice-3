const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST api/users/register
//@desc Register a new user
//@access Public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    //Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    //Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "40h",
      },
      (err, token) => {
        if (err) throw err;
        // send the user and token in response
        res.status(201).send({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log("Error in register user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route POST api/users/login
//@desc Login a new user
//@access Public

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Crdentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    //Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    //Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "40h",
      },
      (err, token) => {
        if (err) throw err;
        // send the user and token in response
        res.send({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log("Error in login user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route GET api/users/profile
//@desc Get Logged in user's profile
//@access Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log("Error in fetching user profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
