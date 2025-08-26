const database = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');

// Sample products data
const sampleProducts = [
  {
    name: "Premium Streetwear Hoodie",
    description: "Ultra-comfortable premium hoodie made from organic cotton blend. Perfect for casual wear with a modern streetwear aesthetic.",
    price: 89.99,
    originalPrice: 119.99,
    category: "men",
    subcategory: "hoodies",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Navy"],
    stock: 50,
    sku: "GOAT-HOODIE-001",
    tags: ["streetwear", "hoodie", "premium", "organic"],
    features: ["Organic Cotton", "Heavyweight", "Kangaroo Pocket", "Ribbed Cuffs"],
    specifications: {
      material: "80% Organic Cotton, 20% Polyester",
      weight: "350gsm",
      fit: "Regular",
      care: "Machine wash cold"
    },
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isNew: true,
    isSale: true,
    salePercentage: 25
  },
  {
    name: "Classic Denim Jacket",
    description: "Timeless denim jacket with modern cuts and premium finishing. A wardrobe essential that never goes out of style.",
    price: 129.99,
    category: "women",
    subcategory: "jackets",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    stock: 30,
    sku: "GOAT-DENIM-002",
    tags: ["denim", "jacket", "classic", "versatile"],
    features: ["100% Cotton Denim", "Button Closure", "Chest Pockets", "Adjustable Cuffs"],
    specifications: {
      material: "100% Cotton Denim",
      weight: "12oz",
      fit: "Regular",
      care: "Machine wash cold, hang dry"
    },
    rating: 4.6,
    reviewCount: 89,
    isFeatured: true,
    isNew: false,
    isSale: false
  },
  {
    name: "Minimalist Sneakers",
    description: "Clean, minimalist sneakers crafted with premium leather and sustainable materials. Perfect for everyday wear.",
    price: 159.99,
    category: "accessories",
    subcategory: "shoes",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    stock: 75,
    sku: "GOAT-SNEAKER-003",
    tags: ["sneakers", "minimalist", "leather", "sustainable"],
    features: ["Premium Leather", "Cushioned Sole", "Breathable Lining", "Durable Construction"],
    specifications: {
      material: "Premium Leather Upper",
      sole: "Rubber",
      lining: "Breathable Mesh",
      care: "Wipe clean with damp cloth"
    },
    rating: 4.9,
    reviewCount: 203,
    isFeatured: true,
    isNew: true,
    isSale: false
  },
  {
    name: "Luxury Watch Collection",
    description: "Sophisticated timepiece with Swiss movement and premium materials. A statement piece for the modern professional.",
    price: 299.99,
    originalPrice: 399.99,
    category: "accessories",
    subcategory: "watches",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    ],
    sizes: ["One Size"],
    colors: ["Silver", "Gold", "Black"],
    stock: 25,
    sku: "GOAT-WATCH-004",
    tags: ["watch", "luxury", "swiss", "professional"],
    features: ["Swiss Movement", "Sapphire Crystal", "Water Resistant", "Leather Strap"],
    specifications: {
      movement: "Swiss Quartz",
      case: "Stainless Steel",
      crystal: "Sapphire",
      waterResistance: "50m"
    },
    rating: 4.7,
    reviewCount: 67,
    isFeatured: true,
    isNew: false,
    isSale: true,
    salePercentage: 25
  },
  {
    name: "Essential T-Shirt Pack",
    description: "Set of 3 premium cotton t-shirts in essential colors. Perfect basics for building your wardrobe foundation.",
    price: 49.99,
    category: "men",
    subcategory: "t-shirts",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray"],
    stock: 100,
    sku: "GOAT-TSHIRT-005",
    tags: ["t-shirt", "basics", "cotton", "pack"],
    features: ["100% Cotton", "Pre-shrunk", "Reinforced Seams", "Tagless"],
    specifications: {
      material: "100% Cotton",
      weight: "180gsm",
      fit: "Regular",
      care: "Machine wash warm"
    },
    rating: 4.5,
    reviewCount: 156,
    isFeatured: false,
    isNew: true,
    isSale: false
  },
  {
    name: "Designer Handbag",
    description: "Elegant leather handbag with modern design and practical functionality. Perfect for work or special occasions.",
    price: 199.99,
    category: "women",
    subcategory: "bags",
    brand: "GOAT",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    stock: 40,
    sku: "GOAT-BAG-006",
    tags: ["handbag", "leather", "designer", "elegant"],
    features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap", "Gold Hardware"],
    specifications: {
      material: "Genuine Leather",
      dimensions: "12\" x 8\" x 4\"",
      closure: "Magnetic Snap",
      care: "Leather conditioner recommended"
    },
    rating: 4.8,
    reviewCount: 92,
    isFeatured: true,
    isNew: false,
    isSale: false
  }
];

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@goat.com",
  password: "admin123",
  role: "admin"
};

// Sample customer user
const customerUser = {
  name: "John Doe",
  email: "customer@goat.com",
  password: "customer123",
  phone: "+1234567890",
  role: "customer"
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await database.connect();
    console.log('✅ Connected to database');

    const db = database.getDb();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Admin user created');

    // Create customer user
    console.log('👤 Creating customer user...');
    const customer = new User(customerUser);
    await customer.save();
    console.log('✅ Customer user created');

    // Create products
    console.log('📦 Creating products...');
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    console.log(`✅ Created ${sampleProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@goat.com / admin123');
    console.log('Customer: customer@goat.com / customer123');
    console.log('\n🛍️ Sample products have been added to the database');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await database.close();
    process.exit(0);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;