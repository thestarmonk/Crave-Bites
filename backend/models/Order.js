const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'], default: 'Placed' },
    paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    address: {
        type: { type: String, default: 'Home' },
        street: String,
        landmark: String,
        city: String,
        pincode: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
