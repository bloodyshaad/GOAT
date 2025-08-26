import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, TrendingUp, Clock, Tag } from 'lucide-react';
import { ModernSelect } from './ModernSelect';
import { products } from '../data/products';
import { debounce } from '../utils/performance';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'trending';
  category?: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  inStock: boolean;
}

export function AdvancedSearch({ onSearch, onFilterChange, className = '' }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'relevance',
    inStock: false
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateSuggestions = useCallback((searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Product suggestions
    const productMatches = products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        text: product.name,
        type: 'product' as const,
        category: product.category
      }));

    // Category suggestions
    const categories = ['men', 'women', 'accessories'];
    const categoryMatches = categories
      .filter(cat => cat.includes(query))
      .map(cat => ({
        id: cat,
        text: cat.charAt(0).toUpperCase() + cat.slice(1),
        type: 'category' as const
      }));

    // Trending suggestions (mock data)
    const trendingTerms = ['streetwear', 'premium', 'luxury', 'new arrivals'];
    const trendingMatches = trendingTerms
      .filter(term => term.includes(query))
      .map(term => ({
        id: term,
        text: term,
        type: 'trending' as const
      }));

    suggestions.push(...productMatches, ...categoryMatches, ...trendingMatches);
    setSuggestions(suggestions.slice(0, 8));
  }, []);

  // Create debounced search function with useMemo
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      if (searchQuery.length > 0) {
        generateSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300),
    [generateSuggestions]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      addToRecentSearches(searchQuery);
      setIsOpen(false);
      setQuery(searchQuery);
    }
  };

  const addToRecentSearches = (searchQuery: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    onSearch('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'category':
        return <Tag className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 shadow-sm"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded-full transition-colors duration-200 ${
              showFilters ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {query === '' && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1 text-gray-900 dark:text-white">{suggestion.text}</span>
                    {suggestion.category && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                        {suggestion.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && suggestions.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">No suggestions found for "{query}"</p>
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-40 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <ModernSelect
                label="Category"
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'men', label: 'Men' },
                  { value: 'women', label: 'Women' },
                  { value: 'accessories', label: 'Accessories' }
                ]}
                value={filters.category}
                onChange={(value) => handleFilterChange({ category: value })}
                size="sm"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange({ 
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                })}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div>
              <ModernSelect
                label="Sort By"
                options={[
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest First' },
                  { value: 'rating', label: 'Highest Rated' }
                ]}
                value={filters.sortBy}
                onChange={(value) => handleFilterChange({ sortBy: value })}
                size="sm"
              />
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-black dark:focus:ring-white"
                />
                In Stock Only
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                const defaultFilters: SearchFilters = {
                  category: 'all',
                  priceRange: [0, 1000],
                  sortBy: 'relevance',
                  inStock: false
                };
                setFilters(defaultFilters);
                onFilterChange(defaultFilters);
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}