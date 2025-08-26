import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { EnhancedButton } from '../components/EnhancedButton';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useToast();

  // Get the intended destination after login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const success = await onLogin(email, password);
      if (success) {
        showSuccess('Welcome back!', 'You have been successfully logged in.');
        
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('goat-remember-email', email);
        } else {
          localStorage.removeItem('goat-remember-email');
        }
        
        // Navigate to intended destination or home
        navigate(from, { replace: true });
      } else {
        showError('Login Failed', error || 'Invalid email or password');
      }
    } catch {
      showError('Login Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('goat-remember-email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const fillDemoCredentials = () => {
    setEmail('demo@goat.com');
    setPassword('password');
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your GOAT account to continue your journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <FormInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
          icon={Mail}
        />

        <FormInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-black dark:text-white bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-white focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <EnhancedButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!email || !password}
          icon={isLoading ? undefined : CheckCircle}
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </EnhancedButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Demo Credentials:</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-xs text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors duration-200"
          >
            Use Demo
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Email: demo@goat.com<br />
          Password: password
        </p>
      </div>
    </AuthLayout>
  );
}