import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { EnhancedButton } from './EnhancedButton';
import { ParallaxContainer } from './ParallaxContainer';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-black dark:text-white py-16 relative overflow-hidden transition-colors duration-300">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <ParallaxContainer speed={0.2} className="absolute top-10 left-10 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-professional-pulse" />
        <ParallaxContainer speed={0.15} className="absolute bottom-10 right-10 w-80 h-80 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl animate-professional-pulse animation-delay-1000" />
        {[...Array(6)].map((_, i) => (
          <ParallaxContainer
            key={i}
            speed={0.1 + Math.random() * 0.1}
            className="absolute w-1 h-1 bg-black/10 dark:bg-white/10 rounded-full animate-professional-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ParallaxContainer speed={0.1} className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
              Be the first to know about new drops, exclusive collaborations, and special offers. 
              Join the GOAT community and never miss out.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black dark:text-white" />
                <span>Exclusive access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black dark:text-white" />
                <span>Early bird discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black dark:text-white" />
                <span>Style tips</span>
              </div>
            </div>
          </ParallaxContainer>
          
          <ParallaxContainer speed={0.05} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg dark:shadow-gray-900 animate-fade-in-up animation-delay-400 hover:shadow-xl dark:hover:shadow-gray-900 transition-all duration-300 hover-lift">
            {isSubscribed ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-black dark:text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Welcome to GOAT!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're now part of the family. Check your email for a special welcome gift.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Join Our Newsletter</h3>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  />
                </div>
                <EnhancedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={Mail}
                  iconPosition="left"
                >
                  Subscribe Now
                </EnhancedButton>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            )}
          </ParallaxContainer>
        </div>
      </div>
    </section>
  );
}