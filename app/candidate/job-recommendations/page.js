'use client';

import { useState } from 'react';
import { MapPin, Briefcase, Clock, Star, TrendingUp, Sparkles, Bookmark, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// Dummy recommended jobs data based on candidate profile matching
const RECOMMENDED_JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Ltd",
    location: "San Francisco, CA",
    workMode: "Remote",
    salary: "$130k - $170k",
    level: "Senior",
    matchScore: 95,
    tags: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    description: "We're looking for a Senior Full Stack Developer with strong React and Node.js experience. You'll work on cutting-edge cloud-native applications using modern tech stack...",
    postedDate: "2 days ago",
    recommended: "High Match"
  },
  {
    id: 2,
    title: "React Developer",
    company: "Digital Solutions Inc",
    location: "New York, NY",
    workMode: "Hybrid",
    salary: "$110k - $150k",
    level: "Mid Senior",
    matchScore: 92,
    tags: ["React", "JavaScript", "Redux", "REST API", "Git"],
    description: "Join our frontend team to build modern web applications. Strong React skills required with experience in state management and API integration...",
    postedDate: "1 day ago",
    recommended: "High Match"
  },
  {
    id: 3,
    title: "Node.js Backend Engineer",
    company: "CloudTech Systems",
    location: "Remote",
    workMode: "Full-time",
    salary: "$125k - $165k",
    level: "Senior",
    matchScore: 90,
    tags: ["Node.js", "Express", "PostgreSQL", "Docker", "Microservices"],
    description: "Build scalable backend services and APIs. Experience with microservices architecture and containerization is a plus...",
    postedDate: "3 days ago",
    recommended: "High Match"
  },
  {
    id: 4,
    title: "Full Stack JavaScript Developer",
    company: "StartupHub",
    location: "Austin, TX",
    workMode: "Full-time",
    salary: "$105k - $140k",
    level: "Mid-Level",
    matchScore: 88,
    tags: ["JavaScript", "React", "Node.js", "MongoDB", "GraphQL"],
    description: "Be part of our dynamic team building innovative web solutions. Work with modern JavaScript ecosystem including React, Node.js, and GraphQL...",
    postedDate: "4 days ago",
    recommended: "Good Match"
  },
  {
    id: 5,
    title: "Frontend Developer (React)",
    company: "WebDev Pro",
    location: "Seattle, WA",
    workMode: "On-site",
    salary: "$100k - $135k",
    level: "Mid-Level",
    matchScore: 85,
    tags: ["React", "TypeScript", "CSS3", "Webpack", "Jest"],
    description: "Create beautiful and responsive user interfaces. Strong understanding of React, TypeScript, and modern CSS required...",
    postedDate: "5 days ago",
    recommended: "Good Match"
  },
  {
    id: 6,
    title: "Software Engineer - MERN Stack",
    company: "Innovation Labs",
    location: "Remote",
    workMode: "Full-time",
    salary: "$115k - $150k",
    level: "Mid Senior",
    matchScore: 87,
    tags: ["MongoDB", "Express", "React", "Node.js", "AWS"],
    description: "Work with MERN stack to build enterprise-level applications. Experience with cloud deployment and CI/CD pipelines preferred...",
    postedDate: "1 week ago",
    recommended: "Good Match"
  },
];

export default function JobRecommendationsPage() {
  // Saved jobs state
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showUnsaveNotification, setShowUnsaveNotification] = useState(false);
  const [showApplicationNotification, setShowApplicationNotification] = useState(false);
  
  // Application modal states
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStep, setApplicationStep] = useState('choice'); // 'choice', 'upload', 'confirm'
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  
  const handleSaveJob = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      // Show unsave notification
      setShowUnsaveNotification(true);
      setTimeout(() => setShowUnsaveNotification(false), 2000);
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      // Show save notification
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
  };

  const handleResumeChoice = (useCustom) => {
    setUseCustomResume(useCustom);
    if (useCustom) {
      setApplicationStep('upload');
    } else {
      setApplicationStep('confirm');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedResume(file);
      setApplicationStep('confirm');
    }
  };

  const handleSubmitApplication = () => {
    // TODO: Add API integration here
    console.log('Submitting application:', {
      job: selectedJob,
      useCustomResume,
      resume: uploadedResume
    });
    
    // Close modal and reset
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
    
    // Show success notification
    setShowApplicationNotification(true);
    setTimeout(() => setShowApplicationNotification(false), 2000);
  };

  const closeModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
  };

  // Get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-orange-600";
    return "text-gray-600";
  };

  // Get recommendation badge style
  const getRecommendationBadge = (type) => {
    if (type === "High Match") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Job Recommendations" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20 relative">
        <Topbar />
        
        {/* Save Notification Popup */}
        {showSaveNotification && (
          <div className="fixed top-0 left-0 right-0 md:ml-64 ml-20 flex justify-center pt-6 z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">Job Saved for later</span>
            </div>
          </div>
        )}
        
        {/* Unsave Notification Popup */}
        {showUnsaveNotification && (
          <div className="fixed top-0 left-0 right-0 md:ml-64 ml-20 flex justify-center pt-6 z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">Job Removed from Saved Jobs</span>
            </div>
          </div>
        )}
        
        {/* Application Submitted Notification Popup */}
        {showApplicationNotification && (
          <div className="fixed top-0 left-0 right-0 md:ml-64 ml-20 flex justify-center pt-6 z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">Application Submitted Successfully</span>
            </div>
          </div>
        )}
        
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Header */}
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                    Job Recommendations
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm mt-2">
                  Personalized job matches based on your profile and preferences
                </p>
              </div>

              {/* Info Banner */}
              <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Smart Recommendations
                  </h3>
                  <p className="text-sm text-gray-600">
                    These jobs are carefully selected based on your skills, experience, and career goals. Jobs with higher match scores align better with your profile.
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <p className="text-sm font-medium text-gray-700">
                  {RECOMMENDED_JOBS.length} Jobs Recommended for You
                </p>
              </div>

              {/* Recommended Jobs Grid */}
              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {RECOMMENDED_JOBS.map((job) => {
                  const matchScoreColor = getMatchScoreColor(job.matchScore);
                  const recommendationBadge = getRecommendationBadge(job.recommended);
                  
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    >
                      {/* Header with Title and Match Score */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.level.includes('Senior') ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'} border border-blue-200 whitespace-nowrap`}>
                              {job.level}
                            </span>
                          </div>
                        </div>
                        
                        {/* Match Score Badge */}
                        <div className="ml-3 text-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Match</div>
                          <div className={`text-2xl font-bold ${matchScoreColor}`}>
                            {job.matchScore}%
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 font-medium mb-1">{job.company}</p>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" /> {job.workMode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {job.salary}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-gray-700 mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-zinc-100 text-xs font-medium rounded border border-zinc-200 text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer with Posted Date, Save Button and Apply Button */}
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 flex items-center">Job Posted: {job.postedDate}</span>
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`p-1.5 rounded-lg transition-all ${savedJobIds.includes(job.id) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
                            title={savedJobIds.includes(job.id) ? "Remove from saved" : "Save for later"}
                          >
                            <Bookmark className={`w-6 h-6 ${savedJobIds.includes(job.id) ? 'fill-blue-600' : ''}`} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleApplyClick(job)}
                          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keep Your Profile Updated
                </h3>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  Update your skills, experience, and preferences regularly to receive more accurate job recommendations tailored to your career goals.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Apply for Position</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Job Details Summary */}
              {selectedJob && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedJob.company}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedJob.location}
                    </span>
                    <span>•</span>
                    <span>{selectedJob.workMode}</span>
                    <span>•</span>
                    <span>{selectedJob.salary}</span>
                  </div>
                </div>
              )}

              {/* Step 1: Resume Choice */}
              {applicationStep === 'choice' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Resume Option</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Would you like to use your default resume or upload a custom one for this application?
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Use Default Resume */}
                    <button
                      onClick={() => handleResumeChoice(false)}
                      className="w-full text-left p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Use Default Resume</h4>
                          <p className="text-sm text-gray-600">Apply with your profile resume (Quick Apply)</p>
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Upload Custom Resume */}
                    <button
                      onClick={() => handleResumeChoice(true)}
                      className="w-full text-left p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Upload Custom Resume</h4>
                          <p className="text-sm text-gray-600">Upload a tailored resume for this position</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Resume Upload */}
              {applicationStep === 'upload' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a PDF or Word document (Max 5MB)
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-1">Click to upload resume</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </label>
                  </div>

                  <button
                    onClick={() => setApplicationStep('choice')}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to options</span>
                  </button>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {applicationStep === 'confirm' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Review your application details before submitting
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resume:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {useCustomResume ? (uploadedResume?.name || 'Custom Resume') : 'Default Resume'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Position:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedJob?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Company:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedJob?.company}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Your application will be reviewed by the employer. You will be notified about the status.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setApplicationStep(useCustomResume ? 'upload' : 'choice')}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

