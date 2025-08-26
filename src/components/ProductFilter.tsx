import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EnhancedButton } from './EnhancedButton';

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  sizes: string[];
  colors: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

interface ProductFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function ProductFilter({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: ProductFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    size: false,
    color: false,
    features: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: { min, max } });
  };

  const availableCategories = ['men', 'women', 'accessories', 'shoes', 'bags'];
  const availableBrands = ['GOAT', 'Nike', 'Adidas', 'Supreme', 'Off-White', 'Balenciaga'];
  // const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Unused - commented out
  // const availableColors = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Blue', 'Green']; // Unused - commented out

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              <Filter className="w-6 h-6" />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Category Filter */}
            <div>
              <button
                onClick={() => toggleSection('category')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">Category</h3>
                {expandedSections.category ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
              {expandedSections.category && (
                <div className="space-y-2">
                  {availableCategories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <button
                onClick={() => toggleSection('brand')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">Brand</h3>
                {expandedSections.brand ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
              {expandedSections.brand && (
                <div className="space-y-2">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">Price Range</h3>
                {expandedSections.price ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
              {expandedSections.price && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange.max)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange(filters.priceRange.min, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Under $50', min: 0, max: 50 },
                      { label: '$50 - $100', min: 50, max: 100 },
                      { label: '$100 - $200', min: 100, max: 200 },
                      { label: '$200 - $500', min: 200, max: 500 },
                      { label: 'Over $500', min: 500, max: 10000 }
                    ].map(range => (
                      <button
                        key={range.label}
                        onClick={() => handlePriceChange(range.min, range.max)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <button
                onClick={() => toggleSection('features')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">Features</h3>
                {expandedSections.features ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
              {expandedSections.features && (
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.checked })}
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isNew}
                      onChange={(e) => onFiltersChange({ ...filters, isNew: e.target.checked })}
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Arrivals</span>
                  </label>
                </div>
              )}
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => onFiltersChange({ ...filters, rating })}
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black focus:ring-2"
                    />
                    <div className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-3">
            <EnhancedButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              Apply Filters
            </EnhancedButton>
            <EnhancedButton
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onClearFilters}
            >
              Clear All Filters
            </EnhancedButton>
          </div>
        </div>
      </div>
    </div>
  );
}