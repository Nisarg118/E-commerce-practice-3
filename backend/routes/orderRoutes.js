const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/orders/my-orders
//@desc Get logged-in user's orders
//@access private

router.get("/my-orders", protect, async (req, res) => {
  try {
    //Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.log("Error in  my-orders", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//@route POST /api/orders/:id
//@desc Get order-details by ID
//@access private

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //Return the full order details
    return res.json(order);
  } catch (error) {
    console.log("Error in getting order by ID", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
