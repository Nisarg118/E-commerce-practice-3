const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

//@route GET api/admin/users
//@desc Get all admin users
//@access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log("Error in getting admin users", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route POST api/admin/users
//@desc Add a new user(Admin only)
//@access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in adding user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route PUT api/admin/users/:id
//@desc Update user info(Admin only)
//@access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }

    const updatedUser = await user.save();

    return res.status(201).json(updatedUser);
  } catch (error) {
    console.log("Error in updating users", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route DELETE api/admin/users/:id
//@desc Delete a user
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      return res.json({ message: "User deleted" });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in deleting users", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
