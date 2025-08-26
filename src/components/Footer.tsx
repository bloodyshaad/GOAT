import React from 'react';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const footerLinks = {
    'Shop': ['Men', 'Women', 'Accessories', 'New Arrivals', 'Sale', 'Gift Cards'],
    'Support': ['Size Guide', 'Shipping Info', 'Returns', 'Track Order', 'Contact Us', 'FAQ'],
    'Company': ['About Us', 'Careers', 'Press', 'Sustainability', 'Store Locator', 'Affiliate Program'],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center space-x-3">
              <Logo className="w-12 h-12 shadow-md dark:shadow-gray-800" />
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              Defining excellence in streetwear and luxury fashion. 
              Meticulously curated collections for those who demand the finest.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@goat.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Fashion Street, NY 10001</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-200 hover:text-black dark:hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400 dark:text-gray-500">We Accept:</span>
              <div className="flex items-center gap-3">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((payment) => (
                  <div
                    key={payment}
                    className="w-12 h-8 bg-gray-800 dark:bg-gray-700 rounded border border-gray-700 dark:border-gray-600 flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{payment}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
              <span>© 2024 GOAT. All rights reserved.</span>
              <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}