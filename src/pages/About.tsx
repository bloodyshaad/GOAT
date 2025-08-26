import React from 'react';
import { Award, Users, Globe, Heart, Truck, Shield } from 'lucide-react';
import { Logo } from '../components/Logo';
import { AnimatedSection } from '../components/AnimatedSection';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { ParallaxContainer } from '../components/ParallaxContainer';

export function About() {
  const values = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We source only the finest materials and work with skilled artisans to create exceptional pieces.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our customers are at the heart of everything we do. We build lasting relationships, not just transactions.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We believe in sustainable fashion that makes a positive impact on communities worldwide.'
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'Fashion is our passion. Every piece is carefully curated with love and attention to detail.'
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Worldwide Shipping',
      description: 'Complimentary shipping on all orders over $100'
    },
    {
      icon: Shield,
      title: '2-Year Warranty',
      description: 'Quality guarantee on all premium items'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with Parallax */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-black dark:text-white py-20 overflow-hidden transition-colors duration-300">
        <ParallaxContainer speed={0.2} className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl" />
        </ParallaxContainer>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <AnimatedSection animation="fadeInUp" duration={1000}>
              <h1 className="text-4xl md:text-6xl font-bold flex items-center justify-center gap-4 mb-6">
                About <Logo className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 shadow-md dark:shadow-gray-700" />
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={200} duration={1000}>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We're not just a fashion brand, we're a movement. 
                Defining excellence in streetwear and luxury fashion since day one.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInLeft" duration={1000}>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Founded with a vision to redefine luxury streetwear, GOAT emerged from the belief 
                  that fashion should be both exceptional and accessible. Our journey began with a 
                  simple mission: create the greatest pieces of all time.
                </p>
                <p>
                  Every item in our collection is carefully curated, designed with precision, and 
                  crafted with the finest materials. We work directly with skilled artisans and 
                  sustainable manufacturers to ensure each piece meets our exacting standards.
                </p>
                <p>
                  Today, GOAT represents more than just clothing - it's a lifestyle, a statement, 
                  and a commitment to excellence that resonates with fashion enthusiasts worldwide.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeInRight" delay={200} duration={1000}>
              <ParallaxContainer speed={0.1} className="relative">
                <img
                  src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="GOAT Fashion"
                  className="rounded-2xl shadow-2xl dark:shadow-gray-800"
                />
                <div className="absolute -bottom-6 -right-6 bg-black dark:bg-white text-white dark:text-black p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm">Happy Customers</div>
                </div>
              </ParallaxContainer>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" duration={1000} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do and shape the GOAT experience
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ProfessionalCard 
                key={index} 
                hoverEffect="lift" 
                delay={index * 100}
                className="p-8"
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </ProfessionalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" duration={1000} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Why Choose GOAT</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We go above and beyond to ensure your experience is nothing short of exceptional
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <ProfessionalCard 
                key={index} 
                hoverEffect="glow" 
                delay={index * 150}
                className="flex items-start gap-6 p-8 bg-gray-50 dark:bg-gray-800"
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </ProfessionalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black dark:bg-gray-950 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" duration={1000} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate individuals behind the GOAT brand
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Johnson', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Sarah Chen', role: 'Creative Director', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Marcus Williams', role: 'Head of Design', image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ].map((member, index) => (
              <AnimatedSection 
                key={index} 
                animation="scaleIn" 
                delay={index * 200} 
                duration={800}
                className="text-center"
              >
                <ParallaxContainer speed={0.05} className="mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-gray-700 dark:ring-gray-600 transition-transform duration-300 hover:scale-105"
                  />
                </ParallaxContainer>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}