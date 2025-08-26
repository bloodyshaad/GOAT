import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  disabled = false 
}: SelectProps) {
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

  return (
    <div 
      ref={selectRef}
      className={`relative ${className}`}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative w-full min-w-[200px] px-4 py-3 text-left
          bg-white border border-gray-300 rounded-xl
          shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          transition-all duration-200 ease-in-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-black border-transparent shadow-lg' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate font-medium ${
            selectedOption ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
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
                  transition-colors duration-150 ease-in-out
                  ${focusedIndex === index ? 'bg-gray-100' : ''}
                  ${option.value === value ? 'bg-black text-white' : 'text-gray-900 hover:bg-gray-50'}
                `}
                role="option"
                aria-selected={option.value === value}
              >
                <div className="flex items-center justify-between">
                  <span className={`block truncate font-medium ${
                    option.value === value ? 'text-white' : ''
                  }`}>
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}