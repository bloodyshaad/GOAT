const { ObjectId } = require('mongodb');
const database = require('../config/database');

class Product {
  constructor(productData) {
    this.name = productData.name;
    this.description = productData.description;
    this.price = parseFloat(productData.price);
    this.originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
    this.category = productData.category;
    this.subcategory = productData.subcategory;
    this.brand = productData.brand;
    this.images = productData.images || [];
    this.sizes = productData.sizes || [];
    this.colors = productData.colors || [];
    this.stock = parseInt(productData.stock) || 0;
    this.sku = productData.sku;
    this.tags = productData.tags || [];
    this.features = productData.features || [];
    this.specifications = productData.specifications || {};
    this.rating = parseFloat(productData.rating) || 0;
    this.reviewCount = parseInt(productData.reviewCount) || 0;
    this.isActive = productData.isActive !== undefined ? productData.isActive : true;
    this.isFeatured = productData.isFeatured || false;
    this.isNew = productData.isNew || false;
    this.isSale = productData.isSale || false;
    this.salePercentage = productData.salePercentage || 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Save product to database
  async save() {
    try {
      const db = database.getDb();
      const result = await db.collection('products').insertOne(this);
      return { ...this, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  // Find product by ID
  static async findById(id) {
    try {
      const db = database.getDb();
      return await db.collection('products').findOne({ 
        _id: new ObjectId(id),
        isActive: true 
      });
    } catch (error) {
      throw error;
    }
  }

  // Get all products with filtering and pagination
  static async getAll(options = {}) {
    try {
      const db = database.getDb();
      const {
        page = 1,
        limit = 12,
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = -1,
        featured,
        isNew,
        isSale
      } = options;

      const skip = (page - 1) * limit;
      let query = { isActive: true };

      // Apply filters
      if (category) query.category = category;
      if (subcategory) query.subcategory = subcategory;
      if (brand) query.brand = brand;
      if (featured !== undefined) query.isFeatured = featured;
      if (isNew !== undefined) query.isNew = isNew;
      if (isSale !== undefined) query.isSale = isSale;

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Search filter (using regex since text indexes aren't available in strict mode)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      // Execute query
      const products = await db.collection('products')
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('products').countDocuments(query);

      return {
        products,
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

  // Get featured products
  static async getFeatured(limit = 8) {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .find({ isActive: true, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  // Get new arrivals
  static async getNewArrivals(limit = 8) {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .find({ isActive: true, isNew: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  // Get sale products
  static async getSaleProducts(limit = 8) {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .find({ isActive: true, isSale: true })
        .sort({ salePercentage: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  // Get related products
  static async getRelated(productId, category, limit = 4) {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .find({ 
          isActive: true,
          category: category,
          _id: { $ne: new ObjectId(productId) }
        })
        .sort({ rating: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  // Update product
  static async updateById(id, updateData) {
    try {
      const db = database.getDb();
      updateData.updatedAt = new Date();

      const result = await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Product not found');
      }

      return await Product.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Update stock
  static async updateStock(id, quantity, operation = 'decrease') {
    try {
      const db = database.getDb();
      const product = await Product.findById(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      let newStock;
      if (operation === 'decrease') {
        if (product.stock < quantity) {
          throw new Error('Insufficient stock');
        }
        newStock = product.stock - quantity;
      } else {
        newStock = product.stock + quantity;
      }

      await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            stock: newStock,
            updatedAt: new Date()
          }
        }
      );

      return { stock: newStock };
    } catch (error) {
      throw error;
    }
  }

  // Soft delete product
  static async deleteById(id) {
    try {
      const db = database.getDb();
      const result = await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Product not found');
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get categories
  static async getCategories() {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .distinct('category', { isActive: true });
    } catch (error) {
      throw error;
    }
  }

  // Get brands
  static async getBrands() {
    try {
      const db = database.getDb();
      return await db.collection('products')
        .distinct('brand', { isActive: true });
    } catch (error) {
      throw error;
    }
  }

  // Search products
  static async search(searchTerm, options = {}) {
    try {
      const db = database.getDb();
      const { page = 1, limit = 12 } = options;
      const skip = (page - 1) * limit;

      const searchQuery = {
        isActive: true,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      const products = await db.collection('products')
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('products').countDocuments(searchQuery);

      return {
        products,
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
}

module.exports = Product;