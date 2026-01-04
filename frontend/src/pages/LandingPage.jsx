import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo2.png" 
                alt="JOB SUMA Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">JOB SUMA</h1>
                <p className="text-xs text-gray-500">Your Career Partner</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/seeker/auth')}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                For Job Seekers
              </button>
              <button
                onClick={() => navigate('/employer/auth')}
                className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                For Employers
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section with Logo - Centered with Background */}
        <div 
          className="text-center mb-20 mt-16 bg-cover bg-center bg-no-repeat rounded-3xl py-16 px-8 relative"
          style={{ backgroundImage: "url('/assets/background.jpg')" }}
        >
          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
          
          {/* Content on top of background */}
          <div className="relative z-10">
            <div className="mb-8">
              <img 
                src="/assets/logo2.png" 
                alt="JOB SUMA Logo" 
                className="mx-auto h-40 w-auto drop-shadow-2xl"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wide drop-shadow-lg">
              Connecting Talent with Opportunity
            </h2>
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-12 drop-shadow-md">
              Your career journey starts here. Find jobs or hire talent today.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={() => navigate('/seeker/auth')}
                className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl text-base"
              >
                I'm a Job Seeker
              </button>
              <button
                onClick={() => navigate('/employer/auth')}
                className="bg-transparent border-2 border-purple-600 hover:bg-purple-600 text-purple-600 hover:text-white font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl text-base"
              >
                I'm an Employer
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Our Platform Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 rounded-3xl mb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
              Why Choose Our Platform?
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Easy Job Search</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Find jobs that match your skills with powerful search and filters
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Simple Applications</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Apply to multiple jobs quickly with resume upload and tracking
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">For Employers</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Post jobs and manage applications efficiently in one place
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Your data is protected with industry-standard security
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Fast & Responsive</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Modern interface that works seamlessly on all devices
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Monitor your applications and hiring pipeline in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers and employers today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/seeker/auth')}
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-300 text-sm"
            >
              Find Jobs
            </button>
            <button
              onClick={() => navigate('/employer/auth')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300 text-sm"
            >
              Post Jobs
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500">
          <p className="text-xs">© 2025 JOB SUMA - COOP Group Project AUMS. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}