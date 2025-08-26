import React from 'react';
import { Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, activeCategory, onCategoryChange, onProductClick }: ProductGridProps) {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'new', name: 'New Arrivals' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Premium Collections
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of luxury streetwear and premium fashion pieces
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:z-10 relative"
            onClick={() => onProductClick(product)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    NEW
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    SALE
                  </span>
                )}
              </div>
              
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110 shadow-lg">
                <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors duration-200" />
              </button>
              
              {/* Quick Add Button */}
              <button className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:from-gray-800 hover:to-black shadow-xl backdrop-blur-sm">
                Quick Add
              </button>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-2 group-hover:transform group-hover:translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-200">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-black text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">${product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          Load More Products
        </button>
      </div>
    </section>
  );
}