import React from 'react';
import { ShoppingBag, Star, Award } from 'lucide-react';
import { Logo } from './Logo';
import { EnhancedButton } from './EnhancedButton';
import { ParallaxContainer } from './ParallaxContainer';

export function Hero() {
  // Removed unused parallax transforms to fix ESLint warnings
  // const { transform: backgroundTransform } = useParallax({ speed: 0.3 });
  // const { transform: floatingTransform } = useParallax({ speed: 0.1 });

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <ParallaxContainer speed={0.2} className="absolute top-20 left-10 w-72 h-72 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-professional-pulse" />
        <ParallaxContainer speed={0.15} className="absolute bottom-20 right-10 w-96 h-96 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl animate-professional-pulse animation-delay-1000" />
        <ParallaxContainer speed={0.1} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-100 dark:border-gray-700 rounded-full opacity-30" />
        <ParallaxContainer speed={0.05} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-200 dark:border-gray-600 rounded-full opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in-up">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-black dark:text-white">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-sm font-semibold tracking-wider uppercase letter-spacing-wide">Premium Collection</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="text-gradient-bw">
                  GOAT
                </span>
                <br />
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed font-light">
                Elevate your style with our meticulously curated collection of premium streetwear and luxury fashion pieces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton
                variant="gradient"
                size="lg"
                icon={ShoppingBag}
                iconPosition="left"
                className="group"
              >
                Shop Collection
              </EnhancedButton>
              
              <EnhancedButton
                variant="magnetic"
                size="lg"
                icon={Award}
                iconPosition="left"
                className="group"
              >
                New Arrivals
              </EnhancedButton>
            </div>

            {/* Professional Stats with Parallax */}
            <ParallaxContainer speed={0.1} className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-4xl font-bold text-black dark:text-white animate-subtle-float">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black dark:text-white animate-subtle-float animation-delay-200">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Premium Items</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black dark:text-white animate-subtle-float animation-delay-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Support</div>
              </div>
            </ParallaxContainer>
          </div>

          {/* Right Content - Professional Product Showcase with Parallax */}
          <ParallaxContainer speed={0.2} className="relative flex items-center justify-center animate-fade-in-right">
            <div className="relative group">
              {/* Professional Product Container */}
              <div className="relative w-80 h-96 bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transform rotate-y-subtle hover:rotate-0 transition-all duration-700 hover:shadow-2xl dark:hover:shadow-gray-900 hover-lift">
                {/* Product Shape */}
                <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-600 overflow-hidden">
                  {/* GOAT Logo on Product */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Logo className="max-w-full max-h-full shadow-md opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Professional Product Details */}
                  <div className="absolute top-4 left-4 w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                </div>

                {/* Minimalist Floating Elements with Parallax */}
                <ParallaxContainer speed={0.3} className="absolute -top-3 -right-3 w-6 h-6 bg-black dark:bg-white rounded-full animate-subtle-float shadow-lg" />
                <ParallaxContainer speed={0.25} className="absolute -bottom-3 -left-3 w-4 h-4 bg-gray-600 dark:bg-gray-300 rounded-full animate-subtle-float animation-delay-600 shadow-lg" />
                
                {/* Professional Price Tag */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-semibold text-lg shadow-lg">
                  $89.99
                </div>

                {/* Elegant Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
              </div>

              {/* Professional Shadow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-6 bg-black/10 dark:bg-white/10 rounded-full blur-xl"></div>
              
              {/* Background Accent with Parallax */}
              <ParallaxContainer speed={0.05} className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-gray-100 dark:border-gray-700 rounded-full animate-slow-rotate" />
            </div>
          </ParallaxContainer>
        </div>
      </div>
    </section>
  );
}