import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@goat.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Fashion Street, NY 10001',
      description: 'Come visit our flagship store'
    },
    {
      icon: Clock,
      title: 'Store Hours',
      details: 'Mon-Sat: 10am-8pm',
      description: 'Sunday: 12pm-6pm'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-black dark:text-white py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Logo className="w-16 h-16 shadow-md dark:shadow-gray-800 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Get In <span className="text-gradient-bw">Touch</span>
              </h1>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about our products or need assistance? We're here to help. 
              Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg dark:hover:shadow-gray-900 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <info.icon className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{info.title}</h3>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">{info.details}</p>
                <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Interactive Map</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">123 Fashion Street, NY 10001</p>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">What are your shipping times?</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Do you offer international shipping?</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Yes, we ship worldwide. International orders typically take 7-14 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">What's your return policy?</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">We offer 30-day free returns on all items in original condition with tags attached.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}