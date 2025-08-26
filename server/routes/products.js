const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validate, validateQuery, productSchemas, querySchemas } = require('../middleware/validation');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', validateQuery(querySchemas.productFilters), async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      category: req.query.category,
      subcategory: req.query.subcategory,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: parseInt(req.query.sortOrder) || -1,
      featured: req.query.featured === 'true',
      isNew: req.query.isNew === 'true',
      isSale: req.query.isSale === 'true'
    };

    const result = await Product.getAll(options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getFeatured(limit);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products
// @access  Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getNewArrivals(limit);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new arrivals'
    });
  }
});

// @route   GET /api/products/sale
// @desc    Get sale products
// @access  Public
router.get('/sale', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getSaleProducts(limit);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get sale products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sale products'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.getCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// @route   GET /api/products/brands
// @desc    Get all product brands
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.getBrands();

    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 12 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Product.search(searchTerm, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products
    const relatedProducts = await Product.getRelated(req.params.id, product.category, 4);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, validate(productSchemas.create), async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(productSchemas.update), async (req, res) => {
  try {
    const updatedProduct = await Product.updateById(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// @route   PUT /api/products/:id/stock
// @desc    Update product stock
// @access  Private (Admin only)
router.put('/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { quantity, operation = 'decrease' } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const result = await Product.updateStock(req.params.id, quantity, operation);

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update stock error:', error);
    if (error.message === 'Product not found' || error.message === 'Insufficient stock') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await Product.deleteById(req.params.id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

module.exports = router;