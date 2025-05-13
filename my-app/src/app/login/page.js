"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Map, Phone, Mail, Menu, X, ArrowUp } from 'lucide-react';
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function LoginPage() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHover, setIsCursorHover] = useState(false);

  // Animation states
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    const hash = window.location.hash;
    if (error === "NotApproved" || hash === "#error=NotApproved") {
      toast.error("Your account is yet to be approved by the admin.");
    }
    
    // Trigger form animation after page load
    setTimeout(() => setFormReady(true), 200);
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Authenticated user:", session.user);
      toast.success("Login successful!", { duration: 3000 });
      const redirectPath = session.redirectTo || `/userdash/${session.user.id}`;
      router.push(redirectPath);
    }
  }, [status, session, router]);

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkResponse = await fetch("https://emss-wtii.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const checkData = await checkResponse.json();

      if (checkResponse.status === 401) {
        toast.error("Invalid email or password.");
        setLoading(false);
        return;
      } else if (checkResponse.status === 403) {
        toast.error("Your account is yet to be approved by the admin.");
        setLoading(false);
        return;
      } else if (!checkResponse.ok) {
        toast.error("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
          className="w-16 h-16 border-4 border-t-pink-600 border-r-blue-500 border-b-pink-600 border-l-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-100 animate-gradient">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-semibold bg-gradient-to-r from-pink-600 to-blue-500 bg-clip-text text-transparent"
        >
          Redirecting...
        </motion.p>
      </div>
    );
  }

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

      <main className="pt-36 flex items-center justify-center min-h-screen">
        <motion.div 
          className="w-full max-w-md px-6 py-8 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative background elements */}
          <motion.div
            className="absolute -z-10 top-0 right-0 rounded-full bg-gradient-to-br from-pink-400/20 to-blue-400/20 w-64 h-64 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="absolute -z-10 bottom-0 left-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-pink-400/20 w-80 h-80 blur-3xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.7 }}
            transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-pink-600 to-blue-600 px-8 py-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-white text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                className="text-pink-100 text-center mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Sign in to your account
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="px-8 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: formReady ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-pink-600 hover:text-pink-800 transition duration-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-600 transition duration-200 backdrop-blur-sm bg-white/80"
                    placeholder="Enter your password"
                    required
                  />
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-blue-500 hover:from-pink-700 hover:to-blue-600 text-white shadow-lg"
                  }`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ 
                    boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)"
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : "Sign In"}
                </motion.button>
                
                <motion.div 
                  className="relative my-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => signIn("github", { redirect: true })}
                    className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-pink-600 transition duration-300 transform hover:scale-105"
                    whileHover={{ 
                      boxShadow: "0 0 10px rgba(236, 72, 153, 0.3)"
                    }}
                  >
                    GitHub
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => signIn("google", { redirect: true })}
                    className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-pink-600 transition duration-300 transform hover:scale-105"
                    whileHover={{ 
                      boxShadow: "0 0 10px rgba(236, 72, 153, 0.3)"
                    }}
                  >
                    Google
                  </motion.button>
                </motion.div>
              </form>
              
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <p className="text-sm text-gray-600">
                  Do not have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-pink-600 hover:text-pink-800 transition duration-300"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <p className="text-sm text-gray-500">© 2025 Auspicioussoft. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}