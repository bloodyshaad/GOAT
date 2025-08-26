const { ObjectId } = require('mongodb');
const database = require('../config/database');

class Order {
  constructor(orderData) {
    this.userId = new ObjectId(orderData.userId);
    this.orderNumber = orderData.orderNumber || this.generateOrderNumber();
    this.items = orderData.items.map(item => ({
      productId: new ObjectId(item.productId),
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      size: item.size,
      color: item.color,
      image: item.image
    }));
    this.subtotal = parseFloat(orderData.subtotal);
    this.tax = parseFloat(orderData.tax) || 0;
    this.shipping = parseFloat(orderData.shipping) || 0;
    this.discount = parseFloat(orderData.discount) || 0;
    this.total = parseFloat(orderData.total);
    this.currency = orderData.currency || 'USD';
    
    // Shipping Information
    this.shippingAddress = {
      firstName: orderData.shippingAddress.firstName,
      lastName: orderData.shippingAddress.lastName,
      email: orderData.shippingAddress.email,
      phone: orderData.shippingAddress.phone,
      address: orderData.shippingAddress.address,
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      zipCode: orderData.shippingAddress.zipCode,
      country: orderData.shippingAddress.country
    };

    // Billing Information (optional, defaults to shipping)
    this.billingAddress = orderData.billingAddress || this.shippingAddress;

    // Payment Information
    this.paymentMethod = orderData.paymentMethod;
    this.paymentStatus = orderData.paymentStatus || 'pending';
    this.paymentId = orderData.paymentId;

    // Order Status
    this.status = orderData.status || 'pending';
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    }];

    // Tracking
    this.trackingNumber = orderData.trackingNumber;
    this.estimatedDelivery = orderData.estimatedDelivery;

    // Timestamps
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GOAT-${timestamp.slice(-6)}${random}`;
  }

  // Save order to database
  async save() {
    try {
      const db = database.getDb();
      const result = await db.collection('orders').insertOne(this);
      return { ...this, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  // Find order by ID
  static async findById(id) {
    try {
      const db = database.getDb();
      return await db.collection('orders').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  // Find order by order number
  static async findByOrderNumber(orderNumber) {
    try {
      const db = database.getDb();
      return await db.collection('orders').findOne({ orderNumber });
    } catch (error) {
      throw error;
    }
  }

  // Get orders by user ID
  static async getByUserId(userId, options = {}) {
    try {
      const db = database.getDb();
      const { page = 1, limit = 10, status } = options;
      const skip = (page - 1) * limit;

      let query = { userId: new ObjectId(userId) };
      if (status) query.status = status;

      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('orders').countDocuments(query);

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all orders (admin)
  static async getAll(options = {}) {
    try {
      const db = database.getDb();
      const { 
        page = 1, 
        limit = 20, 
        status, 
        paymentStatus,
        startDate,
        endDate,
        search 
      } = options;
      const skip = (page - 1) * limit;

      let query = {};
      
      if (status) query.status = status;
      if (paymentStatus) query.paymentStatus = paymentStatus;
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'shippingAddress.email': { $regex: search, $options: 'i' } },
          { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
          { 'shippingAddress.lastName': { $regex: search, $options: 'i' } }
        ];
      }

      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('orders').countDocuments(query);

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  static async updateStatus(id, status, note = '') {
    try {
      const db = database.getDb();
      const order = await Order.findById(id);
      
      if (!order) {
        throw new Error('Order not found');
      }

      const statusUpdate = {
        status,
        timestamp: new Date(),
        note
      };

      const result = await db.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            updatedAt: new Date()
          },
          $push: {
            statusHistory: statusUpdate
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Order not found');
      }

      return await Order.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus, paymentId = null) {
    try {
      const db = database.getDb();
      const updateData = {
        paymentStatus,
        updatedAt: new Date()
      };

      if (paymentId) {
        updateData.paymentId = paymentId;
      }

      const result = await db.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Order not found');
      }

      return await Order.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Add tracking information
  static async addTracking(id, trackingNumber, estimatedDelivery = null) {
    try {
      const db = database.getDb();
      const updateData = {
        trackingNumber,
        updatedAt: new Date()
      };

      if (estimatedDelivery) {
        updateData.estimatedDelivery = new Date(estimatedDelivery);
      }

      const result = await db.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Order not found');
      }

      return await Order.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get order statistics
  static async getStatistics(startDate = null, endDate = null) {
    try {
      const db = database.getDb();
      let matchStage = {};

      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const stats = await db.collection('orders').aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            processingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]).toArray();

      return stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Cancel order
  static async cancel(id, reason = '') {
    try {
      const order = await Order.findById(id);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (['shipped', 'delivered'].includes(order.status)) {
        throw new Error('Cannot cancel order that has been shipped or delivered');
      }

      return await Order.updateStatus(id, 'cancelled', reason);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;