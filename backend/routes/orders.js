const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  [
    protect,
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('shippingAddress.address').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    try {
      // Verify all books exist and have sufficient stock
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const book = await Book.findById(item.book);

        if (!book) {
          return res.status(404).json({ 
            message: `Book not found: ${item.book}` 
          });
        }

        if (book.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${book.title}` 
          });
        }

        // Calculate total
        totalAmount += book.price * item.quantity;

        orderItems.push({
          book: book._id,
          title: book.title,
          price: book.price,
          quantity: item.quantity,
        });

        // Update book stock
        book.stock -= item.quantity;
        await book.save();
      }

      // Create order
      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
      });

      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.book');

      res.status(201).json(populatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/orders
// @desc    Get logged in user orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user owns this order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/all/admin
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/all/admin', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status, trackingDetails } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    if (trackingDetails !== undefined) {
      order.trackingDetails = trackingDetails;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order (User)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered orders' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;