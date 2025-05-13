
// src/app/homepage/page.js
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Map, Phone, Mail, Menu, X, ArrowUp } from 'lucide-react';

/* Tailwind Config (tailwind.config.js)
const plugin = require('tailwindcss/plugin');

// module.exports = {
  content: ["./src/**/     
//   theme: {
//     extend: {
//       colors: {
//         pink: {
//           50: '#fdf2f8',
//           100: '#fce7f3',
//           200: '#fbcfe8',
//           300: '#f9a8d4',
//           400: '#f472b6',
//           500: '#ec4899',
//           600: '#db2777',
//           700: '#be185d',
//           800: '#9d174d',
//           900: '#831843',
//         },
//         blue: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//         },
//         cream: '#f8f1e9',
//         slate: {
//           50: '#f8fafc',
//           900: '#1e293b',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
//       },
//       boxShadow: {
//         'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
//         'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//         'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//         'neumorphic': '5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.7)',
//       },
//       backdropBlur: { xs: '2px', sm: '8px' },
//       animation: {
//         'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'float': 'float 3s ease-in-out infinite',
//         'gradient': 'gradient 15s ease infinite',
//         'reveal': 'reveal 1s ease-out',
//         'bounce-slow': 'bounce 4s ease-in-out infinite',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-12px)' },
//         },
//         gradient: {
//           '0%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//           '100%': { backgroundPosition: '0% 50%' },
//         },
//         reveal: {
//           '0%': { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
//           '100%': { opacity: 1, clipPath: 'inset(0 0 0 0)' },
//         },
//       },
//       backgroundSize: { '400%': '400%' },
//     },
//   },
//   plugins: [
//     plugin(function({ addBase, addComponents, theme }) {
//       addBase({
//         'h1': { fontSize: theme('fontSize.4xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.6') },
//         'h2': { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.4') },
//         'h3': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semibold'), marginBottom: theme('spacing.3') },
//       });
//       addComponents({
//         '.card': {
//           backgroundColor: theme('colors.white/90'),
//           borderRadius: theme('borderRadius.xl'),
//           padding: theme('spacing.6'),
//           boxShadow: theme('boxShadow.card'),
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
//         },
//         '.card:hover': {
//           transform: 'translateY(-8px)',
//           boxShadow: theme('boxShadow.glass'),
//           backgroundColor: theme('colors.white/95'),
//         },
//         '.btn': {
//           padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
//           borderRadius: theme('borderRadius.lg'),
//           fontWeight: theme('fontWeight.semibold'),
//           display: 'inline-flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           transition: 'all 0.3s ease',
//         },
//         '.glass': {
//           background: 'rgba(255, 255, 255, 0.15)',
//           backdropFilter: 'blur(8px)',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//           boxShadow: theme('boxShadow.glass'),
//         },
//         '.neumorphic': {
//           boxShadow: theme('boxShadow.neumorphic'),
//           background: theme('colors.cream'),
//           borderRadius: theme('borderRadius.lg'),
//           transition: 'box-shadow 0.3s ease, transform 0.3s ease',
//         },
//         '.neumorphic:hover': {
//           boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.15), -2px -2px 10px rgba(255, 255, 255, 0.9)',
//           transform: 'translateY(-4px)',
//         },
//       });
//     }),
//   ],
// };
// */

// /* Global CSS (src/styles/globals.css)
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

// :root {
//   --primary: #ec4899;
//   --secondary: #3b82f6;
//   --accent: #f8f1e9;
// }

// html {
//   scroll-behavior: smooth;
// }

// body {
//   font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//   color: #1e293b;
//   line-height: 1.7;
//   background: linear-gradient(to bottom, #fdf2f8, #dbeafe);
//   overflow-x: hidden;
// }

// /* Custom animations */
// @keyframes gradient {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// }

// @keyframes reveal {
//   0% { opacity: 0; clip-path: inset(0 100% 0 0); }
//   100% { opacity: 1; clip-path: inset(0 0 0 0); }
// }

// @keyframes pulseGlow {
//   0%, 100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
//   50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
// }

// .animate-gradient {
//   background: linear-gradient(45deg, #ec4899, #3b82f6, #f472b6, #60a5fa);
//   background-size: 400%;
//   animation: gradient 15s ease infinite;
// }

// .animate-reveal { animation: reveal 1s ease-out forwards; }
// .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }

// /* Custom cursor */
// .cursor {
//   position: fixed;
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background: radial-gradient(circle, rgba(236, 72, 153, 0.5), rgba(59, 130, 246, 0.3));
//   pointer-events: none;
//   z-index: 9999;
//   transition: transform 0.2s ease, opacity 0.2s ease;
// }

// .cursor-hover { transform: scale(1.5); opacity: 0.7; }

// /* Scroll progress */
// .scroll-progress {
//   position: fixed;
//   top: 0;
//   left: 0;
//   height: 4px;
//   background: linear-gradient(to right, #ec4899, #3b82f6);
//   z-index: 1000;
// }

// /* Button styles */
// .btn-primary {
//   @apply bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 animate-pulse-glow;
// }

// .btn-secondary {
//   @apply bg-white text-pink-600 px-6 py-3 rounded-lg border border-pink-200 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105;
// }

// /* Card styles */
// .card { @apply card glass animate-reveal; }
// .service-card { @apply card neumorphic; }

// /* FAQ styles */
// details summary::-webkit-details-marker { display: none; }
// details[open] summary { @apply border-b border-pink-200 pb-4 mb-4; }

// /* Scrollbar */
// ::-webkit-scrollbar { width: 10px; }
// ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 5px; }
// ::-webkit-scrollbar-thumb { background: linear-gradient(#ec4899, #3b82f6); border-radius: 5px; }
// ::-webkit-scrollbar-thumb:hover { background: linear-gradient(#db2777, #2563eb); }

// /* Section divider */
// .section-divider {
//   height: 2px;
//   background: linear-gradient(to right, transparent, #ec4899, #3b82f6, transparent);
//   margin: 2rem 0;
// }

// /* Tooltip */
// .tooltip {
//   position: relative;
// }
// .tooltip:hover::after {
//   content: attr(data-tooltip);
//   position: absolute;
//   bottom: 100%;
//   left: 50%;
//   transform: translateX(-50%);
//   background: #1e293b;
//   color: white;
//   padding: 0.5rem 1rem;
//   border-radius: 0.5rem;
//   white-space: nowrap;
//   z-index: 10;
//   opacity: 0;
//   animation: fadeIn 0.3s forwards;
// }
// @keyframes fadeIn {
//   to { opacity: 1; }
// }
// */

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHover, setIsCursorHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 50);
      setShowBackToTop(scrollTop > 300);

      // Trigger section animations
      document.querySelectorAll('section').forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          section.classList.add('animate-reveal');
        }
      });
    };

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
      const target = e.target.closest('a, button, .card, .tooltip');
      setIsCursorHover(!!target);
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
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          className="fixed bottom-8 right-8 btn-primary rounded-full p-3"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          data-tooltip="Back to Top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}

      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 shadow-lg py-3' : 'bg-gradient-to-b from-pink-50 to-blue-50 py-5'
        } glass animate-gradient`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent">
            Auspicioussoft
          </Link>
          <nav className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-900 font-semibold hover:text-pink-600 transition-all duration-300 relative group tooltip"
                data-tooltip={link.label}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link href="/login">
              <button className="btn-primary">Login</button>
            </Link>
          </nav>
          <button className="md:hidden text-slate-900" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="md:hidden bg-white/95 glass mt-3"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-900 font-semibold hover:text-pink-600 transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login">
                <button className="btn-primary w-full text-center" onClick={toggleMobileMenu}>
                  Login
                </button>
              </Link>
            </div>
          </motion.nav>
        )}
      </header>

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
          <div className="container mx-auto px-6 text-center relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-3xl opacity-50 animate-pulse-slow"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Empower Your Future with AI
            </motion.h1>
            <motion.p
              className="text-xl text-slate-900 max-w-3xl mx-auto mb-12 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Auspicioussoft delivers innovative software and mobile apps to transform your business in the digital era.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10"
            >
              <Link href="/contact">
                <button className="btn-primary text-lg">Get Started</button>
              </Link>
            </motion.div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Trusted By Section */}
        {/* <section className="py-20 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Trusted by Innovators
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic flex items-center justify-center text-slate-900 font-semibold text-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  Client {index + 1}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section> */}

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-pink-100 to-blue-50 animate-gradient">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: '200+', label: 'Projects Delivered' },
                { value: '130+', label: 'Happy Clients' },
                { value: 'Ready to Start?', label: 'Contact Us', isCTA: true },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`card ${stat.isCTA ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white' : 'bg-white/90'} p-8 text-center w-full sm:w-72`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className={`text-3xl font-bold ${stat.isCTA ? 'text-white' : 'text-slate-900'} mb-4`}>{stat.value}</h3>
                  {stat.isCTA ? (
                    <Link href="/contact">
                      <button className="btn-secondary">Get in Touch</button>
                    </Link>
                  ) : (
                    <p className="text-slate-600">{stat.label}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Why Auspicioussoft?
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Innovative solutions, user-focused design, and scalable technology to elevate your business.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: 'Custom Solutions', desc: 'Tailored apps for your unique needs.', icon: <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                { title: 'Intuitive Design', desc: 'Engaging, user-friendly interfaces.', icon: <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg> },
                { title: 'Expert Team', desc: 'Skilled professionals in modern tech.', icon: <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { title: 'Scalable Systems', desc: 'Built for growth and future updates.', icon: <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic p-8 flex items-start space-x-6"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="bg-pink-100 rounded-full p-4 animate-pulse-glow">{item.icon}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Our Locations Section */}
        <section className="py-24 bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
          <div className="container mx-auto px-6 relative">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Global Reach
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { name: 'India', address: 'Patel Tower, Satellite Ahmedabad, Gujarat 380015' },
                { name: 'USA', address: '5311 E Canyon Ct PMB Box, Lakewood, CA 90712' },
              ].map((location, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic p-8 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  whileHover={{ rotate: 2, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 animate-pulse-slow" />
                  <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white text-3xl font-bold p-5 rounded-t-lg text-center relative z-10">
                    {location.name}
                  </div>
                  <div className="p-6 relative z-10">
                    <p className="text-slate-600 text-lg">{location.address}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Industry Focus Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Industry Expertise
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tailored solutions for diverse industries to drive innovation and growth.
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                'Healthcare', 'E-Commerce', 'Real Estate', 'Education',
                'Travel', 'Finance', 'Media', 'Legal',
              ].map((industry, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic p-6 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 animate-pulse-slow" />
                  <div className="bg-pink-100 rounded-full p-5 mb-5 mx-auto w-16 h-16 flex items-center justify-center relative z-10 animate-pulse-glow">
                    <span className="text-pink-600 font-bold text-xl">{industry[0]}</span>
                  </div>
                  <h3 className="text-slate-900 font-semibold text-lg relative z-10">{industry}</h3>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/contact">
                <button className="btn-primary text-lg">Collaborate Now</button>
              </Link>
            </motion.div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Our Services Section */}
        <section className="py-24 bg-gradient-to-br from-pink-100 to-blue-50 animate-gradient">
          <div className="container mx-auto px-6 relative">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Services
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive digital solutions to empower your business.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: 'Mobile Apps', desc: 'Custom iOS and Android apps with seamless UX.' },
                { title: 'Software', desc: 'Scalable solutions for complex challenges.' },
                { title: 'Blockchain', desc: 'Secure, transparent decentralized systems.' },
                { title: 'AI & ML', desc: 'Intelligent automation and insights.' },
                { title: 'CRM & ERP', desc: 'Streamlined operations and customer management.' },
                { title: 'APIs', desc: 'Robust integrations for connectivity.' },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="service-card relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/15 to-blue-500/15 animate-pulse-slow" />
                  <div className="p-8 relative z-10">
                    <h3 className="font-semibold text-xl text-slate-900 mb-4">{service.title}</h3>
                    <p className="text-slate-600 mb-6">{service.desc}</p>
                    <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-pink-600 hover:text-pink-700 inline-flex items-center font-medium">
                      Explore <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Software Development Lifecycle Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Development Lifecycle
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our proven process ensures project success from start to finish.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: 'Planning', desc: 'Setting goals and roadmaps.' },
                { title: 'Analysis', desc: 'Evaluating requirements and feasibility.' },
                { title: 'Design', desc: 'Crafting intuitive interfaces.' },
                { title: 'Development', desc: 'Building robust applications.' },
                { title: 'Testing', desc: 'Ensuring quality and performance.' },
                { title: 'Deployment', desc: 'Seamless launch and integration.' },
              ].map((stage, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic p-8 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 animate-pulse-slow" />
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${
                      index < 3 ? 'bg-gradient-to-r from-pink-500 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-pink-500'
                    } relative z-10 animate-pulse-glow`}
                  >
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 relative z-10">{stage.title}</h3>
                  <p className="text-slate-600 relative z-10">{stage.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
          <div className="container mx-auto px-6 relative">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Tech Stack
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              {['React', 'Node.js', 'Python', 'AWS', 'MongoDB'].map((tech, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic p-6 text-center relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 animate-pulse-slow" />
                  <div className="bg-pink-100 rounded-full p-4 mb-4 mx-auto w-14 h-14 flex items-center justify-center relative z-10 animate-pulse-glow">
                    <span className="text-pink-600 font-bold text-lg">{tech[0]}</span>
                  </div>
                  <span className="text-slate-900 font-semibold relative z-10">{tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Recent Work Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Recent Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: 'Loyalty Dashboard', desc: 'Interactive UI for loyalty programs.' },
                { title: 'Trading Platform', desc: 'Secure blockchain-based trading.' },
                { title: 'Healthcare App', desc: 'Comprehensive healthcare solution.' },
              ].map((project, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/15 to-blue-500/15 animate-pulse-slow" />
                  <div className="bg-gradient-to-r from-pink-500 to-blue-500 h-52 rounded-t-xl relative z-10"></div>
                  <div className="p-8 relative z-10">
                    <h3 className="font-semibold text-xl text-slate-900 mb-4">{project.title}</h3>
                    <p className="text-slate-600 mb-6">{project.desc}</p>
                    <Link href={`/portfolio/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center">
                      View Case Study <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-br from-pink-100 to-blue-50 animate-gradient">
          <div className="container mx-auto px-6 relative">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Clear answers to your questions about our services.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { question: 'Custom software development?', answer: 'Yes, tailored to your business needs.' },
                { question: 'App development cost?', answer: 'Ranges from $15,000 to $250,000+.' },
                { question: 'Development timeline?', answer: 'Typically 3-9 months, based on complexity.' },
                { question: 'Mobile and web support?', answer: 'Yes, for seamless cross-platform experiences.' },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 animate-pulse-slow" />
                  <details className="group relative z-10">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="font-semibold text-lg text-slate-900">{faq.question}</h3>
                      <span className="transition-transform group-open:rotate-180">
                        <ChevronDown className="w-6 h-6 text-slate-500" />
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-slate-600">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>

        {/* Blog Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Insights
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover our latest thoughts on technology and innovation.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: 'App Costs 2025', desc: 'Factors affecting app budgets.' },
                { title: 'Cost Breakdown', desc: 'Detailed expense analysis.' },
                { title: 'App Lifecycle', desc: 'Stages of successful app creation.' },
              ].map((post, index) => (
                <motion.div
                  key={index}
                  className="card neumorphic relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/15 to-blue-500/15 animate-pulse-slow" />
                  <div className="bg-gradient-to-r from-pink-500 to-blue-500 h-48 rounded-t-xl relative z-10"></div>
                  <div className="p-8 relative z-10">
                    <h3 className="font-semibold text-xl text-slate-900 mb-4">{post.title}</h3>
                    <p className="text-slate-600 mb-6">{post.desc}</p>
                    <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center">
                      Read More <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-divider" />
        </section>
      </main>

      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <motion.h4
                className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Auspicioussoft
              </motion.h4>
              <motion.p
                className="text-slate-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Innovating the future with AI-powered digital solutions.
              </motion.p>
              <div className="flex space-x-6">
                {['facebook', 'twitter', 'linkedin'].map((social, index) => (
                  <motion.a
                    key={index}
                    href={`https://${social}.com/auspicioussoft`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-100/20 p-3 rounded-full text-pink-300 hover:bg-pink-100/30 transition-all duration-300 tooltip"
                    data-tooltip={social.charAt(0).toUpperCase() + social.slice(1)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className="text-lg">{social[0].toUpperCase()}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <motion.h4
                className="text-xl font-semibold mb-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Services
              </motion.h4>
              <ul className="space-y-4">
                {['Mobile Apps', 'Software', 'Blockchain'].map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-300 hover:text-pink-300 transition-all duration-300">
                      {service}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <motion.h4
                className="text-xl font-semibold mb-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Pages
              </motion.h4>
              <ul className="space-y-4">
                {['About', 'Contact Us'].map((page, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/${page.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-300 hover:text-pink-300 transition-all duration-300">
                      {page}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <motion.h4
                className="text-xl font-semibold mb-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Contact
              </motion.h4>
              <ul className="space-y-6">
                {[
                  { icon: <Map className="w-6 h-6 text-pink-300 mr-4" />, text: '5311 E Canyon Ct PMB Box, Lakewood, CA 90712' },
                  { icon: <Map className="w-6 h-6 text-pink-300 mr-4" />, text: 'Patel Tower, Satellite Ahmedabad, Gujarat 380015' },
                  { icon: <Phone className="w-6 h-6 text-pink-300 mr-4" />, text: '+1 (123) 456-7890' },
                  { icon: <Mail className="w-6 h-6 text-pink-300 mr-4" />, text: 'info@auspicioussoft.com' },
                ].map((contact, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {contact.icon}
                    <p className="text-slate-300">{contact.text}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-10 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <motion.p
              className="text-slate-300 mb-6 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              © 2025 Auspicioussoft. All rights reserved.
            </motion.p>
            <div className="flex space-x-8">
              {['Privacy Policy', 'Terms of Service'].map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-300 hover:text-pink-300 transition-all duration-300">
                    {link}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}