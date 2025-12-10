'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Briefcase, 
  Users, 
  Target, 
  TrendingUp, 
  Shield
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1729] transition-colors duration-300">
      {/* Hero Section with Background Image */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[70vh] flex items-center justify-center overflow-hidden bg-gray-200">
        {/* Background Image with Blur Effect */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/FrontImage.png"
            alt="AI Recruitment Platform"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
          <div className="rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-5">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-6 md:mb-8 leading-tight">
              SyncTalent
            </h1>
            <p className="text-lg md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Sync Your Skills with Opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-4 py-12 md:py-20">
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto mb-20 md:mb-32">
            {/* Employer Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
              <div className="mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                  For Employers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-base leading-snug">
                  Post jobs, view AI-ranked candidates, streamline your hiring process
                </p>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[
                  'AI-powered candidate ranking',
                  'Automated resume screening',
                  'Advanced filtering options',
                  'Real-time applicant tracking'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm lg:text-base leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/employer/login">
                <button className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2.5 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-xs md:text-sm lg:text-base mt-auto">
                  Continue as Employer
                </button>
              </Link>
            </div>

            {/* Candidate Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border-2 border-purple-200 dark:border-purple-900 hover:border-purple-500 dark:hover:border-purple-500 p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
              <div className="mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                  For Candidates
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-base leading-snug">
                  Upload your resume, discover matching jobs, apply with ease
                </p>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[
                  'Personalized job recommendations',
                  'Smart profile matching',
                  'Easy resume upload',
                  'Track application status'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm lg:text-base leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/candidate/login">
                <button className="w-full bg-purple-600 dark:bg-purple-700 text-white py-2.5 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl font-medium hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors text-xs md:text-sm lg:text-base mt-auto">
                  Continue as Candidate
                </button>
              </Link>
            </div>
          </div>

        {/* Why Choose Our Platform Section */}
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 md:mb-16">
              Why Choose Our Platform?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Accurate Matching */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Accurate Matching
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xs leading-relaxed">
                  Ensure precise candidate-job alignment
                </p>
              </div>

              {/* Time Efficient */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Time Efficient
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xs leading-relaxed">
                  Reduce screening time from hours to minutes with automation
                </p>
              </div>

              {/* Fair & Transparent */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Fair & Transparent
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xs leading-relaxed">
                  Minimize bias with objective AI-driven candidate evaluation
                </p>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
