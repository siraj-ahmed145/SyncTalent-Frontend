'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Bookmark, Building2, DollarSign, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import { normalizeExperienceText } from '../../../utils/experience';
import { SAVE_JOB_API, UNSAVE_JOB_API, GET_SAVED_JOBS_API } from '../../../routes/candidate/savedJobs';

// Helper converts tags to array
const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-GB'); 
    // Example output: 09/05/2026
  } catch {
    return dateStr;
  }
};

const mapApiJobToCard = (job) => ({
  id: job.id ?? job.job_id,
  title: job.title ?? job.jobTitle,
  company: job.company ?? job.companyName,
  location: job.location ?? job.jobLocation,
  jobType: job.jobType ?? job.job_type,
  workMode: job.workMode ?? job.work_mode,
  salary: job.salary ?? job.salaryRange ?? '',
  experience: job.experience ?? job.requiredExperience ?? '',
  tags: ensureTagsArray(job.tags ?? job.skills),
  time: job.time ?? job.posted_at ?? job.created_at ?? '',

  description: job.description ?? job.jobDescription ?? '',

  savedDate: job.saved_date ? formatDateOnly(job.saved_date) : '',
});

// Dummy saved jobs data - in real app, this would come from localStorage or API
const INITIAL_SAVED_JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    jobType: "Full-time",
    workMode: "Hybrid",
    salary: "$120k - $160k",
    level: "Senior",
    experience: "5+ years",
    tags: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    description: "We're seeking an experienced Senior Software Engineer to lead our engineering team. You'll work on cutting-edge projects using React, Node.js, and AWS...",
    savedDate: "Nov 20, 2025",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$130k - $170k",
    level: "Mid-Level",
    experience: "3-5 years",
    tags: ["Product Strategy", "Agile", "User Research", "Analytics"],
    description: "Lead product development for our SaaS platform. Define product roadmap, work with cross-functional teams, drive product strategy. 5+ years of product management experience...",
    savedDate: "Nov 18, 2025",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    salary: "$130k - $170k",
    level: "Senior",
    experience: "5+ years",
    tags: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    description: "Manage and optimize our cloud infrastructure. Implement CI/CD pipelines, monitor system performance, ensure high availability...",
    savedDate: "Nov 15, 2025",
  },
];

export default function SavedJobsPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [showRemoveNotification, setShowRemoveNotification] = useState(false);
  const [showApplicationNotification, setShowApplicationNotification] = useState(false);

  // load saved jobs from API
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const url = GET_SAVED_JOBS_API;
        console.debug('fetching saved jobs from', url);
        const res = await fetch(url, { headers });
        const data = await res.json();
        console.debug('saved jobs response', res.status, data);
        // backend returns { message, saved_jobs: [...] }
        const list = Array.isArray(data.saved_jobs) ? data.saved_jobs : data;
        if (res.ok && Array.isArray(list)) {
          const mapped = list.map(j => {
            const card = mapApiJobToCard(j);
            return card;
          });
          setSavedJobs(mapped);
        }
      } catch (e) {
        console.error('Failed to load saved jobs', e);
        setSavedJobs([]);
      }
    };
    fetchSaved();
  }, []);

  // Application modal states
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStep, setApplicationStep] = useState('choice');
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedJobToRemove, setSelectedJobToRemove] = useState(null);


  const handleRemoveJob = async (jobId) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Call backend unsave API
      const res = await fetch(`${UNSAVE_JOB_API}/${jobId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to unsave job');
      }

      // Remove from UI after successful unsave
      setSavedJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobId)
      );

      setShowRemoveNotification(true);

      setTimeout(() => {
        setShowRemoveNotification(false);
      }, POPUP_TIMEOUT);

    } catch (error) {
      console.error('Error unsaving job:', error);
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
    console.log('Submitting application:', {
      job: selectedJob,
      useCustomResume,
      resume: uploadedResume
    });

    setIsApplicationModalOpen(false);
    setSelectedJob(null);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);

    // Show success notification
    setShowApplicationNotification(true);
    setTimeout(() => setShowApplicationNotification(false), POPUP_TIMEOUT);
  };

  const closeModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Saved Jobs" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20 relative">
        <Topbar />

        <MessagePopup show={showRemoveNotification} message="Job Removed from Saved Jobs" type="success" />
        <MessagePopup show={showApplicationNotification} message="Application Submitted Successfully" type="success" />

        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Page Header */}
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Saved Jobs</h1>
                </div>
                <p className="text-base text-gray-500 ml-[52px] -mt-1">
                  Jobs you've saved for later review
                </p>
              </div>

              {/* Saved Jobs Count */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-sm font-medium text-gray-700">
                  {savedJobs.length} Saved Job{savedJobs.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Saved Jobs Grid */}
              {savedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Jobs</h3>
                  <p className="text-gray-500 mb-4">You haven't saved any jobs yet. Start exploring and save jobs you're interested in!</p>
                  <a href="/candidate/job-search" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Browse Jobs
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                          {normalizeExperienceText(job.experience)}
                        </span>
                      </div>

                      <p className="text-sm font-medium mb-2 text-blue-600">{job.company}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        {job.workMode !== 'Remote' && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>}
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.workMode}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.jobType}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mb-3">
                        <p className="text-xs md:text-sm text-gray-700 line-clamp-2">{job.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-gray-200">
                        {job.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-xs font-medium rounded border border-zinc-200 text-zinc-600">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-400">Saved: {job.savedDate}</span>
                          <button
                            onClick={() => {
                              setSelectedJobToRemove(job.id);
                              setShowConfirmModal(true);
                            }}
                            className="p-2 rounded-lg transition-all text-blue-600 hover:bg-blue-100"
                            title="Remove from saved"
                          >
                            <Bookmark className="w-6 h-6 fill-blue-600" />
                          </button>
                        </div>
                        <div className="w-full flex justify-center -mt-1.5">
                          <button
                            onClick={() => router.push(`/candidate/view-job-post?jobId=${job.id}&from=saved`)}
                            className="px-5 py-2 rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 text-sm font-semibold transition-all"
                          >
                            View Job Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Action
              </h3>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to unsave this job?
            </p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await handleRemoveJob(selectedJobToRemove);

                  setShowConfirmModal(false);
                  setSelectedJobToRemove(null);
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedJobToRemove(null);
                }}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

            <div className="px-6 py-6">
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

              {applicationStep === 'choice' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Resume Option</h3>
                  </div>

                  <div className="space-y-3">
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

              {applicationStep === 'confirm' && (
                <div className="space-y-4">
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

