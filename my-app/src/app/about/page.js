
// src/app/about/page.js
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Map, Phone, Mail, Menu, X, ArrowUp, Star, Users, Target, Award } from 'lucide-react';


// // Tailwind Config (equivalent to tailwind.config.js):

// const plugin = require('tailwindcss/plugin');

// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         blue: {
//           50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
//           400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
//           800: '#1e40af', 900: '#1e3a8a',
//         },
//         pink: {
//           50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
//           400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
//           800: '#9d174d', 900: '#831843',
//         },
//         cream: '#f8f1e9',
//         slate: { 50: '#f8fafc', 900: '#1e293b' },
//       },
//       fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
//       boxShadow: {
//         card: '0 8px 12px -2px rgba(0, 0, 0, 0.1), 0 3px 6px -2px rgba(0, 0, 0, 0.05)',
//         glass: '0 6px 24px 0 rgba(31, 38, 135, 0.3)',
//         neumorphic: '4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.6)',
//       },
//       animation: {
//         gradient: 'gradient 8s ease infinite',
//         reveal: 'reveal 1s ease-out',
//         glow: 'glow 1.5s ease-in-out infinite',
//         float: 'float 2.5s ease-in-out infinite',
//       },
//       keyframes: {
//         gradient: {
//           '0%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//           '100%': { backgroundPosition: '0% 50%' },
//         },
//         reveal: {
//           '0%': { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
//           '100%': { opacity: 1, clipPath: 'inset(0 0 0 0)' },
//         },
//         glow: {
//           '0%, 100%': { boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' },
//           '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.9)' },
//         },
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//       },
//       backgroundSize: { '400%': '400%' },
//     },
//   },
//   plugins: [
//     plugin(function({ addBase, addComponents, theme }) {
//       addBase({
//         h1: { fontSize: theme('fontSize.4xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.4') },
//         h2: { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.3') },
//         h3: { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semibold'), marginBottom: theme('spacing.2') },
//       });
//       addComponents({
//         '.card': {
//           backgroundColor: theme('colors.white/90'),
//           borderRadius: theme('borderRadius.lg'),
//           padding: theme('spacing.6'),
//           boxShadow: theme('boxShadow.card'),
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         },
//         '.card:hover': {
//           transform: 'translateY(-6px)',
//           boxShadow: theme('boxShadow.glass'),
//         },
//         '.btn': {
//           padding: `${theme('spacing.2')} ${theme('spacing.5')}`,
//           borderRadius: theme('borderRadius.lg'),
//           fontWeight: theme('fontWeight.semibold'),
//           display: 'inline-flex',
//           alignItems: 'center',
//           transition: 'all 0.3s ease',
//         },
//         '.glass': {
//           background: 'rgba(255, 255, 255, 0.15)',
//           backdropFilter: 'blur(6px)',
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
//           boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8)',
//           transform: 'translateY(-3px)',
//         },
//       });
//     }),
//   ],
// };





export default function About() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHover, setIsCursorHover] = useState(false);

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
      setIsCursorHover(!!e.target.closest('a, button, .card, .tooltip'));
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
        <section className="py-16 bg-gradient-to-br from-blue-100 to-pink-50 animate-gradient relative">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-full blur-2xl opacity-50 animate-glow"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Auspicioussoft
            </motion.h1>
            <motion.p
              className="text-lg text-slate-900 max-w-2xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We empower businesses with innovative AI-driven software and mobile apps.
            </motion.p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Story
            </motion.h2>
            <motion.div
              className="neumorphic-card max-w-3xl mx-auto relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-pink-500/15 animate-glow" />
              <div className="p-6 relative z-10">
                <p className="text-slate-900">
                  Founded in 2015, Auspicioussoft started with a vision to transform businesses through technology. Today, we’re a global leader in AI-powered solutions, delivering innovative software and apps across industries.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gradient-to-br from-blue-100 to-pink-50 animate-gradient">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Team
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Jane Doe', role: 'CEO', tooltip: 'Visionary Leader' },
                { name: 'John Smith', role: 'CTO', tooltip: 'Tech Innovator' },
                { name: 'Emily Brown', role: 'Lead Developer', tooltip: 'Code Maestro' },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="neumorphic-card text-center relative overflow-hidden tooltip"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  data-tooltip={member.tooltip}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-pink-500/15 animate-glow" />
                  <div className="bg-gradient-to-r from-blue-500 to-pink-500 h-32 rounded-t-lg relative z-10" />
                  <div className="p-4 relative z-10">
                    <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-slate-600">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Innovation', desc: 'Pushing boundaries with AI.', icon: <Star className="w-8 h-8 text-blue-600" /> },
                { title: 'Collaboration', desc: 'Building success together.', icon: <Users className="w-8 h-8 text-blue-600" /> },
                { title: 'Excellence', desc: 'Delivering top-quality solutions.', icon: <Award className="w-8 h-8 text-blue-600" /> },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="neumorphic-card text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-pink-500/15 animate-glow" />
                  <div className="p-6 relative z-10">
                    <div className="bg-blue-100 rounded-full p-3 mb-4 mx-auto w-14 h-14 flex items-center justify-center animate-glow">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/contact">
                <button className="btn-primary">Work With Us</button>
              </Link>
            </motion.div>
          </div>
        </section>
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
        >
          © 2025 Auspicioussoft. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
}
