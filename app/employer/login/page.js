'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { setEmployerSession, isEmployerLoggedIn } from '../../../utils/employerSession';
import { LOGIN_API } from '../../../routes/employer/login';
import Loader from '../../../utils/loader';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';

export default function EmployerLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
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
    if (typeof window !== 'undefined' && isEmployerLoggedIn()) {
      router.push('/employer/my-profile');
    }
  }, [router]);

  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.get('loggedOut') === '1') {
      showPopup('Signed out successfully', 'success');
      router.replace('/employer/login');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const flag = localStorage.getItem('signup_success_employer');
    if (flag === '1') {
      localStorage.removeItem('signup_success_employer');
      setPopup({ show: true, message: 'Account created successfully. Please sign in.', type: 'success' });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        const msg = 'Please fill in all fields';
        setError(msg);
        showPopup(msg, 'error');
        setLoading(false);
        return;
      }

      if (isEmployerLoggedIn()) {
        const msg = 'Another user is already logged in. Please logout first.';
        setError(msg);
        showPopup(msg, 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || data.detail || 'Login failed. Please check your credentials.';
        setError(msg);
        showPopup(msg, 'error');
        setLoading(false);
        return;
      }

      const token = data?.access_token;
      const employerId = data?.employer_id ?? data?.id;
      if (token && employerId) {
        setEmployerSession(data, token, 1440);
        if (typeof window !== 'undefined') localStorage.setItem('login_success_employer', '1');
        router.push('/employer/my-profile');
      } else {
        const msg = 'Invalid response from server.';
        setError(msg);
        showPopup(msg, 'error');
        setLoading(false);
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      showPopup(msg, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <MessagePopup show={popup.show} message={popup.message} type={popup.type} />
      {loading && <Loader text="Signing in..." />}

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0f1729] flex items-center justify-center p-6 md:p-12 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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

            {/* Keep Logged In & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.keepLoggedIn}
                  onChange={(e) => setFormData({...formData, keepLoggedIn: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a2332] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Keep me logged in</span>
              </label>
              <Link href="/employer/forgot-password" className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/employer/signup" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">
                Sign Up
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