import { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

export default function JobsList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('browse');
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  
  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null
  });

  const { logout, user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchQuery, employmentTypeFilter, locationFilter, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsRes = await jobAPI.getPublicJobs();
      setJobs(jobsRes.data);
      
      // Note: We'll need to create an endpoint to get user's applications
      // For now, we'll filter from the jobs data
      await loadMyApplications();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setMyApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const filterAndSortJobs = () => {
    let result = [...jobs];

    // Filter by search query (title or location)
    if (searchQuery) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by employment type
    if (employmentTypeFilter !== 'all') {
      result = result.filter(job => job.employment_type === employmentTypeFilter);
    }

    // Filter by location
    if (locationFilter) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredJobs(result);
  };

  const handleApply = (job) => {
    if (job.status === 'Closed') {
      alert('This job is no longer accepting applications');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
    setResumeUrl('');
    setApplyError('');
  };

  const submitApplication = async () => {
    if (!resumeUrl) {
      setApplyError('Please provide your resume URL');
      return;
    }

    setApplyLoading(true);
    setApplyError('');

    try {
      await applicationAPI.apply({
        job: selectedJob.id,
        resume_url: resumeUrl,
      });
      
      setShowApplyModal(false);
      setSelectedJob(null);
      setResumeUrl('');
      
      // Show success message
      alert('Application submitted successfully!');
      await loadMyApplications();
    } catch (error) {
      setApplyError(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleWithdrawApplication = (application) => {
    setConfirmModal({
      isOpen: true,
      title: 'Withdraw Application',
      message: `Are you sure you want to withdraw your application for "${application.job_title}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          // You'll need to create a DELETE endpoint for this
          // await applicationAPI.deleteApplication(application.id);
          await loadMyApplications();
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
          alert('Failed to withdraw application');
        }
      }
    });
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out? You will need to sign in again to access your account.',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        logout();
      }
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-purple-600 to-pink-600 text-white flex flex-col shadow-2xl fixed h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-purple-500 border-opacity-30">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.png" 
                alt="JOB SUMA Logo" 
                className="h-8 w-auto"
              />
              <div>
                <h2 className="text-lg font-bold">JOB SUMA</h2>
                <p className="text-xs text-purple-200">Job Seeker</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Browse Jobs Button */}
          <button
            onClick={() => setCurrentView('browse')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${
              currentView === 'browse'
                ? 'bg-white bg-opacity-20 shadow-lg'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {sidebarOpen && <span className="font-medium">Browse Jobs</span>}
          </button>

          {/* My Applications Button */}
          <button
            onClick={() => setCurrentView('applications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${
              currentView === 'applications'
                ? 'bg-white bg-opacity-20 shadow-lg'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span className="font-medium">My Applications</span>}
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-purple-500 border-opacity-30 space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-3 bg-white bg-opacity-10 rounded-xl">
              <p className="text-sm font-semibold truncate">{user?.full_name}</p>
              <p className="text-xs text-purple-200 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors text-red-200 hover:text-white"
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Browse Jobs View */}
          {currentView === 'browse' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Jobs</h1>

              {/* Filters Bar */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search by Title/Location */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Employment Type Filter */}
                  <select
                    value={employmentTypeFilter}
                    onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>

                  {/* Location Filter */}
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Jobs Grid */}
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No jobs found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{job.employer_name}</p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {job.employment_type.replace('_', ' ')}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'Open' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Job Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {job.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApply(job)}
                        disabled={job.status === 'Closed'}
                        className={`w-full md:w-auto px-6 py-2 rounded-xl font-semibold transition-all ${
                          job.status === 'Open'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {job.status === 'Open' ? 'Apply Now' : 'Applications Closed'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Applications View */}
          {currentView === 'applications' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">My Applications</h1>

              {myApplications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No applications yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start applying to jobs to see them here</p>
                  <button
                    onClick={() => setCurrentView('browse')}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {myApplications.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{app.job_title}</h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Applied on: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View Resume →
                          </a>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      {app.status === 'NEW' || app.status === 'REVIEWING' ? (
                        <button
                          onClick={() => handleWithdrawApplication(app)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                        >
                          Withdraw Application
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Apply for {selectedJob?.title}</h2>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              {applyError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">{applyError}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/your-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Provide a link to your resume (Google Drive, Dropbox, personal website)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitApplication}
                  disabled={applyLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
}