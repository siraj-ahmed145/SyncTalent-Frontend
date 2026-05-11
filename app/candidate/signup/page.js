'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SIGNUP_API } from '../../../routes/candidate/signup';
import Loader from '../../../utils/loader';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import {
  sanitizeLettersAndSpacesInput,
  isValidFullName,
} from '../../../utils/signupNameValidation';

export default function CandidateSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
  };

  useEffect(() => {
    if (!popup.show) return;
    const t = setTimeout(() => setPopup(prev => ({ ...prev, show: false })), POPUP_TIMEOUT);
    return () => clearTimeout(t);
  }, [popup.show]);

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match';
      setError(msg);
      showPopup(msg, 'error');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.password) {
      const msg = 'Please fill in all fields';
      setError(msg);
      showPopup(msg, 'error');
      return;
    }

    const trimmedName = formData.fullName.trim();
    if (!isValidFullName(trimmedName)) {
      const msg = 'Name may only contain letters and spaces (at least 2 characters).';
      setError(msg);
      showPopup(msg, 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(SIGNUP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || data.detail || 'Signup failed. Please try again.';
        setError(msg);
        showPopup(msg, 'error');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') localStorage.setItem('signup_success_candidate', '1');
      router.push('/candidate/login');
    } catch (err) {
      const msg = err.message || 'Signup failed. Please try again.';
      setError(msg);
      showPopup(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <MessagePopup show={popup.show} message={popup.message} type={popup.type} />
      {loading && <Loader text="Creating account..." />}

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

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-gray-900 dark:text-white text-sm font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: sanitizeLettersAndSpacesInput(e.target.value),
                  })
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2332] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/candidate/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="w-20 h-20 mx-auto mb-6">
            <Image
              src="/icon.png"
              alt="SyncTalent Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            SyncTalent
          </h2>
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            Sync Your Skills with Opportunities
          </p>
        </div>
      </div>
    </div>
  );
}