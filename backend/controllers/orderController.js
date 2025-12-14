import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";


//Place Order COD :/api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    //Calculate Amount using Items

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge(2%)
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Place Order COD :/api/order/razorpay

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    //Calculate Amount using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge(2%)
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Initialize Razorpay
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
 ; // return in rupees
    const amountPaise = Math.round(amount * 100);
    const options = {
      amount: amountPaise, // amount in paise
      currency: "INR",
      receipt: order._id.toString(),
      payment_capture: 1,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.json({ success: true, data: { orderId: order._id, razorpayOrder } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment signature: /api/order/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      return res.json({ success: true, message: "Payment verified" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//Get Orders By User Id : /api/order/user

export const getUserOrders = async (req, res) => {
  try {
   // const { userId } = req.body;
    
    const userId = req.userId || req.body?.userId;
    const orders = await Order.find({
      userId,
      $or: [
        {
          paymentType: "COD",
        },
        { isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders(for seller/Admin): /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
   // const { userId } = req.body;
     const userId = req.userId || req.body?.userId;
    const orders = await Order.find({
      $or: [
        {
          paymentType: "COD",
        },
        { isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
