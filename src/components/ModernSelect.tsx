import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
}

interface ModernSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'bordered';
  label?: string;
  error?: string;
}

export function ModernSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  error
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRef.current) {
      const focusedElement = optionsRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-4 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-black';
      case 'bordered':
        return 'bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-black';
      default:
        return 'bg-white border border-gray-300 hover:border-gray-400 focus:border-black';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            relative w-full text-left
            ${getSizeClasses()}
            ${getVariantClasses()}
            rounded-xl
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-black/10 focus:shadow-lg
            transition-all duration-200 ease-in-out
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-black/10 shadow-lg' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedOption?.icon && (
                <selectedOption.icon className="w-5 h-5 text-gray-500" />
              )}
              <span className={`block truncate font-medium ${
                selectedOption ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div 
              ref={optionsRef}
              className="max-h-60 overflow-auto py-1"
              role="listbox"
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    relative px-4 py-3 cursor-pointer select-none
                    transition-all duration-150 ease-in-out
                    ${focusedIndex === index ? 'bg-gray-50' : ''}
                    ${option.value === value ? 'bg-black text-white' : 'text-gray-900 hover:bg-gray-50'}
                    flex items-center justify-between group
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <option.icon className={`w-4 h-4 ${
                        option.value === value ? 'text-white' : 'text-gray-500'
                      }`} />
                    )}
                    <span className={`block truncate font-medium ${
                      option.value === value ? 'text-white' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const SortSelect = ({ value, onChange, className }: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
}) => (
  <ModernSelect
    options={[
      { value: 'featured', label: 'Featured' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'name', label: 'Name A-Z' },
      { value: 'rating', label: 'Highest Rated' }
    ]}
    value={value}
    onChange={onChange}
    placeholder="Sort by..."
    className={className}
    variant="bordered"
  />
);

export const CategorySelect = ({ value, onChange, className }: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
}) => (
  <ModernSelect
    options={[
      { value: 'all', label: 'All Categories' },
      { value: 'men', label: 'Men' },
      { value: 'women', label: 'Women' },
      { value: 'accessories', label: 'Accessories' }
    ]}
    value={value}
    onChange={onChange}
    placeholder="Select category..."
    className={className}
  />
);

export const TimeRangeSelect = ({ value, onChange, className }: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
}) => (
  <ModernSelect
    options={[
      { value: '24h', label: 'Last 24 Hours' },
      { value: '7d', label: 'Last 7 Days' },
      { value: '30d', label: 'Last 30 Days' },
      { value: '90d', label: 'Last 90 Days' }
    ]}
    value={value}
    onChange={onChange}
    placeholder="Select time range..."
    className={className}
    size="sm"
  />
);