import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '../components/EnhancedButton';
import { FormInput } from '../components/FormInput';
import { useToast } from '../contexts/ToastContext';
import { apiClient } from '../services/api';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      if (response.success) {
        setEmailSent(true);
        showSuccess('Email Sent!', 'If an account with that email exists, a password reset link has been sent.');
      } else {
        // Even on error, we show success to prevent email enumeration
        setEmailSent(true);
        showSuccess('Email Sent!', 'If an account with that email exists, a password reset link has been sent.');
      }
    } catch {
      // Even on error, we show success to prevent email enumeration
      setEmailSent(true);
      showSuccess('Email Sent!', 'If an account with that email exists, a password reset link has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const resendEmail = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
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
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Email
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                We've sent a password reset link to:
              </p>
              
              <p className="text-lg font-semibold text-black dark:text-white mb-8">
                {email}
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    What to do next:
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Check your email inbox</li>
                    <li>• Look for an email from GOAT</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Check your spam folder if you don't see it</li>
                  </ul>
                </div>
                
                <EnhancedButton
                  onClick={resendEmail}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Send Another Email
                </EnhancedButton>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <EnhancedButton
                    onClick={() => navigate('/login')}
                    variant="ghost"
                    size="md"
                  >
                    Back to Login
                  </EnhancedButton>
                  
                  <EnhancedButton
                    onClick={() => navigate('/')}
                    variant="ghost"
                    size="md"
                  >
                    Go to Homepage
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Didn't receive the email?
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    The email may take a few minutes to arrive. If you still don't see it, 
                    contact our support team at{' '}
                    <a href="mailto:support@goat-ecommerce.com" className="font-medium underline">
                      support@goat-ecommerce.com
                    </a>
                  </p>
                </div>
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
          Forgot Your Password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          No worries! Enter your email address and we'll send you a reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={error}
              placeholder="Enter your email address"
              required
            />

            <EnhancedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </EnhancedButton>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Security Information */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Security Notice
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  For your security, password reset links expire after 1 hour. 
                  If you don't have an account with us, you won't receive an email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}