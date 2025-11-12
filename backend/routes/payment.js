const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST /api/payment/process
// @desc    Process mock payment (for development)
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod, cardDetails } = req.body;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock validation - in real scenario, this would validate with payment gateway
    const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate

    if (isPaymentSuccessful) {
      // Update order status
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentDetails = {
          transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`,
          paymentMethod: paymentMethod,
          status: 'success',
        };
        await order.save();

        res.json({
          success: true,
          message: 'Payment processed successfully',
          transactionId: order.paymentDetails.transactionId,
          order,
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Payment failed. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// @route   POST /api/payment/validate-card
// @desc    Validate card details (mock)
// @access  Private
router.post('/validate-card', protect, async (req, res) => {
  try {
    const { cardNumber, cvv, expiry } = req.body;

    // Mock validation
    if (cardNumber && cardNumber.length >= 16 && cvv && cvv.length === 3 && expiry) {
      res.json({ valid: true, message: 'Card details validated' });
    } else {
      res.status(400).json({ valid: false, message: 'Invalid card details' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Validation failed' });
  }
});

module.exports = router;
