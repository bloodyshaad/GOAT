import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  className?: string;
  inputClassName?: string;
  error?: string;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  inputClassName = '',
  error
}: FormInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9CA3AF',
              pointerEvents: 'none',
              zIndex: 10
            }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          style={{
            paddingLeft: Icon ? '40px' : '16px',
            paddingRight: RightIcon ? '48px' : '16px'
          }}
          className={`w-full py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 ${inputClassName}`}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'transparent',
              border: 'none',
              padding: '4px'
            }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <RightIcon 
              style={{
                width: '20px',
                height: '20px'
              }}
            />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}