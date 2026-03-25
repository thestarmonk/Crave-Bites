const Order = require('../models/Order');

exports.addOrderItems = async (req, res) => {
    const {
        items,
        address,
        paymentMethod,
        totalAmount,
        taxAmount,
        deliveryCharges,
        discountAmount
    } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        try {
            const order = new Order({
                userId: req.user._id,
                items,
                address,
                paymentMethod,
                totalAmount,
                taxAmount,
                deliveryCharges,
                discountAmount,
                paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending' // Initial state
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.orderStatus = req.body.orderStatus || order.orderStatus;
            if (req.body.paymentStatus) {
                order.paymentStatus = req.body.paymentStatus;
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.productId');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Only allow cancellation if not Out for Delivery or Delivered
        const restrictedStatuses = ['Out for delivery', 'Delivered', 'Cancelled'];
        if (restrictedStatuses.includes(order.orderStatus)) {
            return res.status(400).json({ message: `Cannot cancel order at ${order.orderStatus} stage` });
        }

        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
