"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Map, Phone, Mail, Menu, X, ArrowUp } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

export default function SignupPage() {
  // Signup state
  const [form, setForm] = useState({
    fname: '', lname: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formReady, setFormReady] = useState(false);
  
  // Navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHover, setIsCursorHover] = useState(false);

  useEffect(() => {
    setTimeout(() => setFormReady(true), 200);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 50);
      setShowBackToTop(scrollTop > 300);
    };

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
      const target = e.target.closest('a, button, .card, .tooltip, input');
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://emss-wtii.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname: form.fname, lname: form.lname, email: form.email,
          phone: form.phone, password: form.password, role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Signup failed.');
        setLoading(false);
        return;
      }

      toast.success('Signed up! Awaiting admin approval.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      toast.error('Error during signup.');
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { href: '/', label: 'Homepage' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
      <Toaster position="top-right" />
      
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

      {/* Header - Made Compact */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 shadow-lg py-2' : 'bg-gradient-to-b from-pink-50 to-blue-50 py-3'
        } glass animate-gradient`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent">
            Auspicioussoft
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-900 font-semibold hover:text-pink-600 transition-all duration-300 relative group tooltip"
                data-tooltip={link.label}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login">
              <button className="btn-primary text-sm">Login</button>
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
            transition={{ duration: 0.4 }}
            className="md:hidden bg-white/95 glass mt-2"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
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

      <main className="pt-24 flex items-center justify-center min-h-screen">
        <motion.div 
          className="w-full max-w-md px-4 py-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements - made smaller and less intrusive */}
          <motion.div
            className="absolute -z-10 top-10 right-0 rounded-full bg-gradient-to-br from-pink-400/20 to-blue-400/20 w-40 h-40 blur-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="absolute -z-10 bottom-10 left-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-pink-400/20 w-40 h-40 blur-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.4 }}
            transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-pink-600 to-blue-600 px-6 py-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h2 
                className="text-xl font-bold text-white text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Create Account
              </motion.h2>
            </motion.div>
            
            <motion.div 
              className="px-6 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: formReady ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First name and last name in one row */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="fname"
                      value={form.fname}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lname"
                      value={form.lname}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </motion.div>
                
                {/* Email and phone in one row */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </motion.div>
                
                {/* Password fields */}
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                      placeholder="Confirm"
                      required
                    />
                  </div>
                </motion.div>
                
                {/* Sign up button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-lg font-medium transition duration-300 ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-blue-500 hover:from-pink-700 hover:to-blue-600 text-white shadow-md"
                  }`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  whileHover={{ boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)" }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : "Sign Up"}
                </motion.button>
                
                {/* OR divider */}
                <motion.div 
                  className="relative my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </motion.div>
                
                {/* Social logins */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => signIn('github', { callbackUrl: `${window.location.origin}/userdash` })}
                    className="py-1.5 px-3 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-pink-600 transition duration-300"
                    whileHover={{ boxShadow: "0 0 8px rgba(236, 72, 153, 0.3)" }}
                  >
                    GitHub
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: `${window.location.origin}/userdash` })}
                    className="py-1.5 px-3 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-pink-600 transition duration-300"
                    whileHover={{ boxShadow: "0 0 8px rgba(236, 72, 153, 0.3)" }}
                  >
                    Google
                  </motion.button>
                </motion.div>
              </form>
              
              {/* Login Link */}
              <motion.div 
                className="text-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <p className="text-xs text-gray-600">
                  Have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-pink-600 hover:text-pink-800 transition duration-300"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            className="text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
          >
            <p className="text-xs text-gray-500">© 2025 Auspicioussoft. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}