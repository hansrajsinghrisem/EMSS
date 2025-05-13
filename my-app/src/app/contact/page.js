"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Map, Phone, Mail, Menu, X, Send, User, MessageSquare, AtSign, Loader2 } from 'lucide-react';

export default function Contact() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHover, setIsCursorHover] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      document.querySelectorAll('section').forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.8) {
          section.classList.add('animate-reveal');
        }
      });
    };

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
      setIsCursorHover(!!e.target.closest('a, button, .card, .tooltip, input, textarea'));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setFormSubmitted(true);
      // Reset form after submission
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const navLinks = [
    { href: '/', label: 'Homepage' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Custom Cursor */}
      <div
        className={`cursor ${isCursorHover ? 'cursor-hover' : ''}`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
      />

      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 shadow-md py-2' : 'bg-gradient-to-b from-blue-50 to-pink-50 py-4'
        } glass animate-gradient`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
            Auspicioussoft
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-900 hover:text-blue-600 transition-all duration-300 relative group tooltip"
                data-tooltip={link.label}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link href="/login">
              <button className="btn-primary">Login</button>
            </Link>
          </nav>
          <button className="md:hidden text-slate-900" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 glass mt-2"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-900 hover:text-blue-600 transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login">
                <button className="btn-primary w-full" onClick={toggleMobileMenu}>
                  Login
                </button>
              </Link>
            </div>
          </motion.nav>
        )}
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-100 to-pink-50 animate-gradient relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Abstract background shapes */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-64 h-64 bg-pink-400/10 rounded-full blur-xl"
              animate={{ 
                x: [0, -40, 0],
                y: [0, 30, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute top-40 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-lg"
              animate={{ 
                x: [0, 50, 0],
                y: [0, 20, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch With Us
            </motion.h1>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p
              className="text-lg text-slate-700 max-w-2xl mx-auto relative z-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We value your feedback and inquiries. Our dedicated team is here to assist you with any questions 
              or collaboration opportunities you may have.
            </motion.p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-50 rounded-full opacity-70" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-50 rounded-full opacity-70" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.h2
                className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Send Us a Message
              </motion.h2>
              
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mb-12"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact info cards */}
                <motion.div 
                  className="lg:col-span-2 space-y-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Map className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">USA Headquarters</h3>
                        <p className="text-slate-600">5311 E Canyon Ct, Lakewood, CA 90712</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Map className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">India Office</h3>
                        <p className="text-slate-600">Patel Tower, Satellite Ahmedabad, Gujarat 380015</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Get in Touch</h3>
                        <p className="text-slate-600">+1 (123) 456-7890</p>
                        <p className="text-slate-600">info@auspicioussoft.com</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Contact form */}
                <motion.div 
                  className="lg:col-span-3"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
                    {/* Subtle gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-pink-50/50 opacity-50" />
                    
                    {formSubmitted ? (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Thank You!</h3>
                        <p className="text-slate-600">Your message has been sent successfully. We will get back to you shortly.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            viewport={{ once: true }}
                          >
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                              </div>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                                placeholder="John Doe"
                                required
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            viewport={{ once: true }}
                          >
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-slate-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                                placeholder="john@example.com"
                                required
                              />
                            </div>
                          </motion.div>
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                            placeholder="What's this regarding?"
                            required
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                            Your Message
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                              <MessageSquare className="h-5 w-5 text-slate-400" />
                            </div>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={5}
                              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                              placeholder="Please provide details about your inquiry..."
                              required
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="text-right"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                              isSubmitting
                                ? "bg-blue-400 text-white cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transform hover:translate-y-px"
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Sending...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                Send Message
                                <Send className="ml-2 h-5 w-5" />
                              </span>
                            )}
                          </button>
                        </motion.div>
                      </form>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}

        
        
      </main>

      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              Auspicioussoft
            </h4>
            <p className="text-slate-300">Innovating with AI since 2015.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2">
              {[
                { icon: <Map className="w-5 h-5 text-blue-300 mr-2" />, text: '5311 E Canyon Ct, Lakewood, CA' },
                { icon: <Phone className="w-5 h-5 text-blue-300 mr-2" />, text: '+1 (123) 456-7890' },
                { icon: <Mail className="w-5 h-5 text-blue-300 mr-2" />, text: 'info@auspicioussoft.com' },
              ].map((contact, index) => (
                <motion.li
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {contact.icon}
                  <p className="text-slate-300">{contact.text}</p>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-4 md:justify-end">
            {['facebook', 'twitter', 'linkedin'].map((social, index) => (
              <motion.a
                key={index}
                href={`https://${social}.com/auspicioussoft`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100/20 p-2 rounded-full text-blue-300 hover:bg-blue-100/30 transition-all duration-300 tooltip"
                data-tooltip={social.charAt(0).toUpperCase() + social.slice(1)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                viewport={{ once: true }}
              >
                <span className="text-base">{social[0].toUpperCase()}</span>
              </motion.a>
            ))}
          </div>
        </div>
        <motion.p
          className="text-center text-slate-300 mt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          © 2025 Auspicioussoft. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
}