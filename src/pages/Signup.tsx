import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, UserPlus, Check } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { EnhancedButton } from '../components/EnhancedButton';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { VALIDATION } from '../constants';

interface SignupProps {
  onRegister: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<boolean>;
}

export function Signup({ onRegister }: SignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    clearError();
  }, [clearError]);

  // Calculate password strength
  useEffect(() => {
    const { password } = formData;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name.trim()) {
      showError('Validation Error', 'Please enter your full name');
      return false;
    }
    
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      showError('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      showError('Validation Error', `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
      return false;
    }
    
    if (password !== confirmPassword) {
      showError('Validation Error', 'Passwords do not match');
      return false;
    }
    
    if (!acceptTerms) {
      showError('Validation Error', 'Please accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    try {
      const success = await onRegister({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      });
      
      if (success) {
        showSuccess('Welcome to GOAT!', 'Your account has been created successfully.');
        navigate('/', { replace: true });
      } else {
        showError('Registration Failed', error || 'An account with this email already exists');
      }
    } catch {
      showError('Registration Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <AuthLayout
      title="Join GOAT"
      subtitle="Create your account and start your premium fashion journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {getPasswordStrengthText()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {formData.password === formData.confirmPassword ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400">Passwords don't match</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 text-black dark:text-white bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-white focus:ring-2 mt-0.5"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            I agree to the{' '}
            <Link to="/terms" className="text-black dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-black dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Privacy Policy
            </Link>
          </label>
        </div>

        <EnhancedButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !acceptTerms}
          icon={isLoading ? undefined : UserPlus}
          iconPosition="left"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </EnhancedButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}