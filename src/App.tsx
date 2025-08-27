import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { Checkout } from './components/Checkout';
import { OrderSuccess } from './components/OrderSuccess';
import { PageLoadingSpinner } from './components/LoadingSpinner';
import { Wishlist } from './components/Wishlist';
import { ProductComparison } from './components/ProductComparison';
import { Breadcrumb } from './components/Breadcrumb';
import { ScrollProgress } from './components/ScrollProgress';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthBanner } from './components/AuthBanner';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Account } from './pages/Account';
import { OrderHistory } from './pages/OrderHistory';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Terms } from './pages/Terms';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { Product } from './data/products';
import { initializeDefaultExperiments } from './services/abTesting';
import { analytics } from './services/analytics';

// Protection systems - imported with error handling
import './styles/protection.css';

// Initialize protection systems safely
React.lazy(() => 
  import('./utils/antiInspect').catch(() => ({ default: () => null }))
);
React.lazy(() => 
  import('./utils/codeProtection').catch(() => ({ default: () => null }))
);

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'success'>('home');
  const [orderNumber] = useState(() => Math.random().toString(36).substring(2, 11).toUpperCase());
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const { user, login, logout, register } = useAuth();
  const { isLoading, loadingText } = useLoading();
  const { showSuccess, showError } = useToast();

  // Initialize analytics and experiments
  React.useEffect(() => {
    let initialized = false;
    
    if (!initialized) {
      try {
        // Initialize A/B testing experiments
        initializeDefaultExperiments();
        
        // Set user ID for analytics if logged in
        if (user) {
          analytics.identify(user.id || user.email, {
            email: user.email,
            name: user.name,
            signupDate: new Date().toISOString()
          });
        }
        
        // Track app initialization (only once)
        analytics.track('app_initialized', {
          category: 'app',
          action: 'initialize',
          timestamp: Date.now()
        });
        
        initialized = true;
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  }, [user]);

  // Wishlist functions with authentication check
  const addToWishlist = (product: Product) => {
    // Check if user is authenticated
    if (!user) {
      showError(
        'Sign In Required', 
        'Please sign in to save items to your wishlist.'
      );
      return;
    }

    if (!wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems(prev => [...prev, product]);
      showSuccess('Added to Wishlist', `${product.name} has been added to your wishlist`);
    } else {
      showError('Already in Wishlist', 'This item is already in your wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    showSuccess('Removed from Wishlist', 'Item has been removed from your wishlist');
  };

  // Comparison functions
  const removeFromComparison = (productId: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== productId));
  };

  // Enhanced add to cart with authentication check and toast notification
  const handleAddToCart = (product: Product) => {
    // Check if user is authenticated
    if (!user) {
      showError(
        'Sign In Required', 
        'Please sign in to add items to your cart and make purchases.'
      );
      return;
    }

    addToCart(product);
    showSuccess('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleProceedToCheckout = () => {
    // Double-check authentication before checkout
    if (!user) {
      showError(
        'Sign In Required', 
        'Please sign in to proceed to checkout.'
      );
      return;
    }

    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderComplete = () => {
    clearCart();
    setCurrentView('success');
  };

  const handleContinueShopping = () => {
    setCurrentView('home');
  };

  const handleCartClick = () => {
    // Check authentication before opening cart
    if (!user) {
      showError(
        'Sign In Required', 
        'Please sign in to view your cart and make purchases.'
      );
      return;
    }
    setIsCartOpen(true);
  };

  const handleWishlistClick = () => {
    // Check authentication before opening wishlist
    if (!user) {
      showError(
        'Sign In Required', 
        'Please sign in to view your wishlist.'
      );
      return;
    }
    setIsWishlistOpen(true);
  };

  if (currentView === 'checkout') {
    return (
      <div className="protected-content">
        <Header
          user={user}
          cartCount={getCartCount()}
          onCartClick={handleCartClick}
          onLogout={logout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Checkout
          items={cartItems}
          total={getCartTotal()}
          onBack={() => setCurrentView('home')}
          onComplete={handleOrderComplete}
        />
        <Footer />
        {isLoading && <PageLoadingSpinner text={loadingText} />}
      </div>
    );
  }

  if (currentView === 'success') {
    return (
      <div className="protected-content">
        <Header
          user={user}
          cartCount={getCartCount()}
          onCartClick={handleCartClick}
          onLogout={logout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <OrderSuccess
          orderNumber={orderNumber}
          onContinueShopping={handleContinueShopping}
        />
        <Footer />
        {isLoading && <PageLoadingSpinner text={loadingText} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 protected-content">
      <ScrollProgress />
      
      {/* Authentication Banner for non-authenticated users */}
      <AuthBanner />
      
      <Header
        user={user}
        cartCount={getCartCount()}
        onCartClick={handleCartClick}
        onLogout={logout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb />
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onAddToCart={handleAddToCart} onAddToWishlist={addToWishlist} />} />
        <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />
        
        {/* Auth Routes - Redirect if already logged in */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login onLogin={login} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Signup onRegister={register} />
            </ProtectedRoute>
          } 
        />
        
        {/* Email Verification Routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<Terms />} />
      </Routes>
      
      <Footer />
      
      {/* Cart Sidebar - Only show if user is authenticated */}
      {isCartOpen && user && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          total={getCartTotal()}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Wishlist Sidebar - Only show if user is authenticated */}
      {isWishlistOpen && user && (
        <Wishlist
          items={wishlistItems}
          onRemoveItem={removeFromWishlist}
          onAddToCart={handleAddToCart}
          onViewProduct={(product) => console.log('View product:', product)}
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
        />
      )}

      {/* Product Comparison Modal */}
      {isComparisonOpen && (
        <ProductComparison
          products={comparisonItems}
          onClose={() => setIsComparisonOpen(false)}
          onAddToCart={handleAddToCart}
          onRemoveFromComparison={removeFromComparison}
        />
      )}

      {/* Floating Action Buttons - Show authentication status */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group hover:scale-110 ${
            user 
              ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          title={user ? "Wishlist" : "Sign in to use wishlist"}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {user && wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
          {!user && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </button>

        {/* Comparison Button */}
        <button
          onClick={() => setIsComparisonOpen(true)}
          className="relative w-14 h-14 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group hover:scale-110"
          title="Compare Products"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {comparisonItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {comparisonItems.length}
            </span>
          )}
        </button>
      </div>
      
      {isLoading && <PageLoadingSpinner text={loadingText} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;