import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '../components/EnhancedButton';
import { FormInput } from '../components/FormInput';
import { useToast } from '../contexts/ToastContext';
import { apiClient } from '../services/api';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      showError('Invalid Link', 'This password reset link is invalid or missing.');
    }
  }, [token, showError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      const response = await apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      });

      if (response.success) {
        showSuccess('Password Reset!', 'Your password has been successfully reset. You can now log in with your new password.');
        navigate('/login');
      } else {
        showError('Reset Failed', response.message || 'Failed to reset password');
        if (response.message?.includes('expired') || response.message?.includes('invalid')) {
          setIsValidToken(false);
        }
      }
    } catch (error: unknown) {
      showError('Reset Failed', error.message || 'Failed to reset password');
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setIsValidToken(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestNewResetLink = () => {
    navigate('/forgot-password');
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight">
              GOAT
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Greatest Of All Time
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Invalid Reset Link
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                This password reset link is invalid, expired, or has already been used.
              </p>
              
              <div className="space-y-4">
                <EnhancedButton
                  onClick={requestNewResetLink}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Request New Reset Link
                </EnhancedButton>
                
                <EnhancedButton
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  size="md"
                  className="w-full"
                >
                  Back to Login
                </EnhancedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight">
            GOAT
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Greatest Of All Time
          </p>
        </div>
        
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              placeholder="Enter your new password"
              required
            />

            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              required
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Password Requirements
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 6 characters long</li>
                      <li>Use a strong, unique password</li>
                      <li>Consider using a password manager</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <EnhancedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </EnhancedButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Remember your password? Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Security Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  This reset link will expire soon for your security. After resetting your password, 
                  you'll be automatically logged out of all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}