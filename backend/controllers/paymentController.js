const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                order.razorpayPaymentId = razorpay_payment_id;
                order.razorpayOrderId = razorpay_order_id;
                await order.save();
                res.json({ status: 'success', message: 'Payment verified successfully' });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
};
