const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { validate, validateQuery, orderSchemas, querySchemas } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authenticateToken, validate(orderSchemas.create), async (req, res) => {
  try {
    // Verify stock availability for all items
    for (const item of req.body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}`
        });
      }
    }

    // Create order
    const orderData = {
      ...req.body,
      userId: req.user._id
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Update product stock
    for (const item of req.body.items) {
      await Product.updateStock(item.productId, item.quantity, 'decrease');
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', authenticateToken, validateQuery(querySchemas.pagination), async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      status: req.query.status
    };

    const result = await Order.getByUserId(req.user._id, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search
    };

    const result = await Order.getAll(options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @route   GET /api/orders/statistics
// @desc    Get order statistics (Admin only)
// @access  Private (Admin)
router.get('/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await Order.getStatistics(startDate, endDate);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Track order by order number
// @access  Public
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findByOrderNumber(req.params.orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Return limited tracking information
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt
    };

    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticateToken, requireAdmin, validate(orderSchemas.updateStatus), async (req, res) => {
  try {
    const { status, note } = req.body;
    const updatedOrder = await Order.updateStatus(req.params.id, status, note);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// @route   PUT /api/orders/:id/payment-status
// @desc    Update payment status (Admin only)
// @access  Private (Admin)
router.put('/:id/payment-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;

    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const updatedOrder = await Order.updatePaymentStatus(req.params.id, paymentStatus, paymentId);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

// @route   PUT /api/orders/:id/tracking
// @desc    Add tracking information (Admin only)
// @access  Private (Admin)
router.put('/:id/tracking', authenticateToken, requireAdmin, validate(orderSchemas.addTracking), async (req, res) => {
  try {
    const { trackingNumber, estimatedDelivery } = req.body;
    const updatedOrder = await Order.addTracking(req.params.id, trackingNumber, estimatedDelivery);

    res.json({
      success: true,
      message: 'Tracking information added successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Add tracking error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to add tracking information'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { reason } = req.body;
    const cancelledOrder = await Order.cancel(req.params.id, reason);

    // Restore product stock
    for (const item of order.items) {
      await Product.updateStock(item.productId, item.quantity, 'increase');
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel order'
    });
  }
});

module.exports = router;