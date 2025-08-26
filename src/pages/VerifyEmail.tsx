import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '../components/EnhancedButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { login } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. No token provided.');
    }
  }, [token, verifyEmail]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    try {
      const response = await apiClient.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token: verificationToken })
      });

      if (response.success) {
        setVerificationStatus('success');
        showSuccess('Email Verified!', 'Your email has been successfully verified. Welcome to GOAT!');
        
        // Auto-redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setErrorMessage(response.message || 'Email verification failed');
        showError('Verification Failed', response.message || 'Email verification failed');
      }
    } catch (error: unknown) {
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Email verification failed');
      showError('Verification Failed', error.message || 'Email verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    setIsResending(true);
    try {
      const response = await apiClient.request('/auth/resend-verification', {
        method: 'POST'
      });

      if (response.success) {
        showSuccess('Email Sent!', 'A new verification email has been sent to your inbox.');
      } else {
        showError('Failed to Send', response.message || 'Failed to resend verification email');
      }
    } catch (error: unknown) {
      showError('Failed to Send', error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (isVerifying) {
      return (
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
            Verifying Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address...
          </p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Email Verified Successfully! 🎉
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Welcome to GOAT! Your email has been verified and your account is now active.
          </p>
          
          <div className="space-y-4">
            <EnhancedButton
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Start Shopping
            </EnhancedButton>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to homepage in 3 seconds...
            </div>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Verification Failed
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {errorMessage}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            This could happen if the link has expired or has already been used.
          </p>
          
          <div className="space-y-4">
            <EnhancedButton
              onClick={resendVerification}
              variant="primary"
              size="lg"
              loading={isResending}
              className="w-full sm:w-auto"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
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
      );
    }

    return null;
  };

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
          {renderContent()}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Need Help?
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  If you're having trouble with email verification, please contact our support team at{' '}
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