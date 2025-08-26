import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { ParallaxContainer } from './ParallaxContainer';
import { AnimatedSection } from './AnimatedSection';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxContainer speed={0.2} className="absolute top-20 left-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
        <ParallaxContainer speed={0.15} className="absolute bottom-20 right-20 w-80 h-80 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl" />
        <ParallaxContainer speed={0.1} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gray-100 dark:border-gray-700 rounded-full opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Home</span>
              </Link>
            )}
          </div>
          
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
              GOAT
            </span>
          </Link>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          <AnimatedSection animation="fadeInUp" duration={800}>
            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 p-8">
              {children}
            </div>
          </AnimatedSection>

          {/* Footer */}
          <AnimatedSection animation="fadeInUp" delay={200} duration={800}>
            <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 GOAT. All rights reserved.</p>
            </div>
          </AnimatedSection>
        </div>
      </main>
    </div>
  );
}