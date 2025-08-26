const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required()
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    price: Joi.number().positive().required(),
    originalPrice: Joi.number().positive().optional(),
    category: Joi.string().required(),
    subcategory: Joi.string().optional(),
    brand: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    sizes: Joi.array().items(Joi.string()).optional(),
    colors: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().integer().min(0).required(),
    sku: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    isFeatured: Joi.boolean().optional(),
    isNew: Joi.boolean().optional(),
    isSale: Joi.boolean().optional(),
    salePercentage: Joi.number().min(0).max(100).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    price: Joi.number().positive().optional(),
    originalPrice: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    subcategory: Joi.string().optional(),
    brand: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    sizes: Joi.array().items(Joi.string()).optional(),
    colors: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().integer().min(0).optional(),
    sku: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    isFeatured: Joi.boolean().optional(),
    isNew: Joi.boolean().optional(),
    isSale: Joi.boolean().optional(),
    salePercentage: Joi.number().min(0).max(100).optional()
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        size: Joi.string().optional(),
        color: Joi.string().optional(),
        image: Joi.string().uri().optional()
      })
    ).min(1).required(),
    subtotal: Joi.number().positive().required(),
    tax: Joi.number().min(0).optional(),
    shipping: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).optional(),
    total: Joi.number().positive().required(),
    shippingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    billingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).optional(),
    paymentMethod: Joi.string().required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
    note: Joi.string().optional()
  }),

  addTracking: Joi.object({
    trackingNumber: Joi.string().required(),
    estimatedDelivery: Joi.date().optional()
  })
};

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Query parameter validation
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Common query schemas
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
  }),

  productFilters: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().optional(),
    subcategory: Joi.string().optional(),
    brand: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid('name', 'price', 'createdAt', 'rating').optional(),
    sortOrder: Joi.number().valid(1, -1).optional(),
    featured: Joi.boolean().optional(),
    isNew: Joi.boolean().optional(),
    isSale: Joi.boolean().optional()
  })
};

module.exports = {
  validate,
  validateQuery,
  userSchemas,
  productSchemas,
  orderSchemas,
  querySchemas
};