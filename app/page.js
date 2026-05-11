'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Shield,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1729] transition-colors duration-300">
      {/* Hero Section with Background Image */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[70vh] flex items-center justify-center overflow-hidden bg-gray-200">
        {/* Background Image with Blur Effect */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/FrontImage3.png"
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-6 md:mb-7 leading-tight">
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
        <div id="get-started" className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto mb-20 md:mb-32 scroll-mt-24">
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
            Why Choose Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                Icon: Target,
                title: 'Accurate Matching',
                description: 'Match candidates to the right jobs',
                tone: 'green',
              },
              {
                Icon: TrendingUp,
                title: 'Time Efficient',
                description: 'Reduce screening time with smart automation',
                tone: 'orange',
              },
              {
                Icon: Shield,
                title: 'Fair & Transparent',
                description:
                  'Every candidate gets a fair shot with unbiased, data-driven evaluations',
                tone: 'blue',
              },
            ].map(({ Icon, title, description, tone }) => {
              const toneClasses = {
                green:
                  'bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 ring-green-200/90 dark:ring-green-800/60 group-hover:ring-green-400/80 dark:group-hover:ring-green-500/70',
                orange:
                  'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 ring-orange-200/90 dark:ring-orange-800/60 group-hover:ring-orange-400/80 dark:group-hover:ring-orange-500/70',
                blue:
                  'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-blue-200/90 dark:ring-blue-800/60 group-hover:ring-blue-400/80 dark:group-hover:ring-blue-500/70',
              };
              const ringTone = toneClasses[tone];
              return (
                <div
                  key={title}
                  className="group flex flex-col items-center text-center rounded-2xl border border-gray-200/90 dark:border-gray-700/80 bg-gray-50/90 dark:bg-gray-900/40 px-5 py-6 md:px-6 md:py-7 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-300/90 dark:hover:border-blue-500/70 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-inset transition-all duration-300 group-hover:shadow-md group-hover:ring-2 ${ringTone}`}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
