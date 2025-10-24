'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export default function EmployerSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-lg"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0f1729] flex items-center justify-center p-6 md:p-12 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Sign Up
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Create your account to get started!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Google Sign Up Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.5818C15.35 13.3 14.6182 14.3591 13.5227 15.0682V17.5773H16.8091C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                <path d="M10.2 20C12.9 20 15.1727 19.1045 16.8091 17.5773L13.5227 15.0682C12.6136 15.6682 11.4818 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2682 4.58636 11.9H1.18182V14.4909C2.80909 17.7591 6.20909 20 10.2 20Z" fill="#34A853"/>
                <path d="M4.58636 11.9C4.38636 11.3 4.27273 10.6591 4.27273 10C4.27273 9.34091 4.38636 8.7 4.58636 8.1V5.50909H1.18182C0.509091 6.85909 0.136364 8.38636 0.136364 10C0.136364 11.6136 0.509091 13.1409 1.18182 14.4909L4.58636 11.9Z" fill="#FBBC05"/>
                <path d="M10.2 3.97727C11.6091 3.97727 12.8636 4.48182 13.8545 5.43636L16.7636 2.52727C15.1682 0.886364 12.8955 0 10.2 0C6.20909 0 2.80909 2.24091 1.18182 5.50909L4.58636 8.1C5.38182 5.73182 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#0f1729] text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>

            {/* Company Name Field */}
            <div>
              <label htmlFor="companyName" className="block text-gray-900 dark:text-white text-sm font-medium mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="Your Company"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2332] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-900 dark:text-white text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="info@gmail.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2332] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-900 dark:text-white text-sm font-medium mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2332] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-900 dark:text-white text-sm font-medium mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2332] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a2332] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Sign up
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/employer/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-900 via-blue-800 to-purple-900 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          {/* Logo */}
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="flex gap-1.5">
              <div className="w-1 h-12 bg-white rounded-full"></div>
              <div className="w-1 h-12 bg-white rounded-full"></div>
              <div className="w-1 h-12 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            AI Recruitment
          </h2>
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            Free and Open-Source AI-Powered<br />Resume Screening & Job Matching
          </p>
        </div>
      </div>
    </div>
  );
}

