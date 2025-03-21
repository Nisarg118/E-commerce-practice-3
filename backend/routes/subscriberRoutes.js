const express = require("express");
const Subscriber = require("../models/Subscriber");
const router = express.Router();

//@route POST api/subscribe
//@desc Handle newsletter subscription
//@access Public

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
    }

    //Check if the email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      res.status(400).json({ message: "Email is already subscribed" });
    }

    //Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: "Successfully subscribed to the news" });
  } catch (error) {
    console.log("Error in subscribe", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
