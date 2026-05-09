'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Clock, Search, Bookmark, Building2, DollarSign, X } from 'lucide-react';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Loader from '../../../utils/loader';
import { normalizeExperienceText } from '../../../utils/experience';
import { GET_JOBS_API } from '../../../routes/candidate/getJobs';
import { SAVE_JOB_API, UNSAVE_JOB_API, GET_SAVED_JOBS_API } from '../../../routes/candidate/savedJobs';

const MODES = ["All Work Modes", "Remote", "On-site", "Hybrid"];
const TYPES = ["All Types", "Full-time", "Part-time", "Contract"];
const SORTS = ["Most Relevant", "Newest", "Oldest"];

// Helper function to ensure tags are always an array
const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    // Sometimes backend returns ["React|Next.js"] or ["React, Next.js"]
    // Normalize each entry into separate tags.
    return tags
      .flatMap((t) => {
        if (typeof t !== "string") return [];
        return t
          .split(/[,|]/)
          .map((x) => x.trim())
          .filter(Boolean);
      })
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(/[,|]/) // support "a,b" and "a|b" formats
      .map((t) => t.trim())
      .filter((t) => t);
  }
  return [];
};

// Map API job to card format
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
  rawDate: job.posted_at ?? job.created_at ?? '',
  time: job.time ?? job.posted_at ?? job.created_at ?? '',
  description: job.description ?? job.jobDescription ?? '',
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export default function CandidateJobSearchPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState("All Locations");
  const [mode, setMode] = useState(MODES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [sort, setSort] = useState(SORTS[0]);
  const [search, setSearch] = useState("");

  // Dynamic locations extracted from jobs
  const dynamicLocations = [
    "All Locations",
    ...Array.from(
      new Set(
        jobs
          .map((job) => job.location)
          .filter(
            (loc) =>
              loc &&
              loc.trim() !== "" &&
              loc.toLowerCase() !== "remote"
          )
      )
    ),
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(GET_JOBS_API, {
          method: 'GET',
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.message || data.detail || 'Failed to fetch jobs. Please try again.';
          setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
          setJobs([]);
          setLoading(false);
          return;
        }

        const rawJobs = Array.isArray(data) ? data : (data.jobs ?? data.data ?? []);

        const mapped = rawJobs
          .filter((j) => {
            return j.status?.toLowerCase() === "active";
          })
          .map((j) => {
            const card = mapApiJobToCard(j);
            card.time = formatDate(card.rawDate);
            return card;
          });

        setJobs(mapped);
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Application modal states
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStep, setApplicationStep] = useState('choice'); // 'choice', 'upload', 'confirm'
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);

  // Saved jobs state
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showUnsaveNotification, setShowUnsaveNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showApplicationNotification, setShowApplicationNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedJobToUnsave, setSelectedJobToUnsave] = useState(null);

  // load saved job ids from server
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null;

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(GET_SAVED_JOBS_API, {
          method: 'GET',
          headers
        });

        const data = await res.json();

        // backend returns { message, saved_jobs: [...] }
        const savedJobs = Array.isArray(data.saved_jobs)
          ? data.saved_jobs
          : [];

        if (res.ok) {
          const ids = savedJobs.map(
            (job) => job.job_id ?? job.id
          );

          setSavedJobIds(ids);
        }

      } catch (e) {
        console.error('Failed to load saved jobs', e);
      }
    };

    fetchSaved();
  }, []);

  // Client-side filtering
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        !search.trim() ||
        (job.title ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (job.company ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (Array.isArray(job.tags)
          ? job.tags.join(" ").toLowerCase()
          : ""
        ).includes(search.toLowerCase());

      const matchesLocation =
        location === "All Locations" ||
        job.location === location;

      const matchesMode =
        mode === "All Work Modes" ||
        (job.workMode ?? "").toLowerCase() ===
        mode.toLowerCase();

      const matchesType =
        type === "All Types" ||
        (job.jobType ?? "").toLowerCase() ===
        type.toLowerCase();

      return (
        matchesSearch &&
        matchesLocation &&
        matchesMode &&
        matchesType
      );
    })
    .sort((a, b) => {
      // MOST RELEVANT
      if (sort === "Most Relevant") {

        // If no search, show newest first
        if (!search.trim()) {
          return new Date(b.rawDate) - new Date(a.rawDate);
        }

        const searchLower = search.toLowerCase();

        const aTitleMatch = (a.title ?? "")
          .toLowerCase()
          .includes(searchLower);

        const bTitleMatch = (b.title ?? "")
          .toLowerCase()
          .includes(searchLower);

        const aCompanyMatch = (a.company ?? "")
          .toLowerCase()
          .includes(searchLower);

        const bCompanyMatch = (b.company ?? "")
          .toLowerCase()
          .includes(searchLower);

        const aTagMatch = (a.tags ?? [])
          .join(" ")
          .toLowerCase()
          .includes(searchLower);

        const bTagMatch = (b.tags ?? [])
          .join(" ")
          .toLowerCase()
          .includes(searchLower);

        const aScore =
          (aTitleMatch ? 3 : 0) +
          (aCompanyMatch ? 2 : 0) +
          (aTagMatch ? 1 : 0);

        const bScore =
          (bTitleMatch ? 3 : 0) +
          (bCompanyMatch ? 2 : 0) +
          (bTagMatch ? 1 : 0);

        // Higher relevance score first
        if (bScore !== aScore) {
          return bScore - aScore;
        }

        // If same relevance, newer first
        return new Date(b.rawDate) - new Date(a.rawDate);
      }

      // NEWEST
      if (sort === "Newest") {
        return new Date(b.rawDate) - new Date(a.rawDate);
      }

      // OLDEST
      if (sort === "Oldest") {
        return new Date(a.rawDate) - new Date(b.rawDate);
      }

      return 0;
    })

  const handleSaveJob = async (jobId) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${SAVE_JOB_API}/${jobId}`,
        {
          method: 'POST',
          headers
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || 'Failed to save job'
        );
      }

      setSavedJobIds((prev) => [...prev, jobId]);

      setShowSaveNotification(true);

      setTimeout(() => {
        setShowSaveNotification(false);
      }, POPUP_TIMEOUT);

    } catch (err) {
      console.error(err);

      setShowErrorNotification(true);

      setTimeout(() => {
        setShowErrorNotification(false);
      }, POPUP_TIMEOUT);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${UNSAVE_JOB_API}/${jobId}`,
        {
          method: 'DELETE',
          headers
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || 'Failed to unsave job'
        );
      }

      setSavedJobIds((prev) =>
        prev.filter((id) => id !== jobId)
      );

      setShowUnsaveNotification(true);

      setTimeout(() => {
        setShowUnsaveNotification(false);
      }, POPUP_TIMEOUT);

    } catch (err) {
      console.error(err);

      setShowErrorNotification(true);

      setTimeout(() => {
        setShowErrorNotification(false);
      }, POPUP_TIMEOUT);
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
      {loading && <Loader text="Loading jobs..." />}
      <Sidebar active="Search Job" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20 relative">
        <Topbar />

        <MessagePopup show={showSaveNotification} message="Job Saved for later" type="success" />
        <MessagePopup show={showUnsaveNotification} message="Job Removed from Saved Jobs" type="success" />
        <MessagePopup show={showErrorNotification} message="Could not update saved jobs" type="error" />
        <MessagePopup show={showApplicationNotification} message="Application Submitted Successfully" type="success" />

        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Page Header */}
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Find Your Next Opportunity</h1>
                </div>
                <p className="text-base text-gray-500 ml-[52px] -mt-1">
                  Search through thousands of job opportunities
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-center">
                <div className="flex-1 flex items-center w-full">
                  {/* Search input with matching height to button */}
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by Job Title, Company, or Skills"
                    className="w-full max-w-md h-10 rounded-xl bg-zinc-100 border border-zinc-100 px-3 text-base placeholder:text-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm flex items-center"
                    style={{ backgroundClip: 'padding-box' }}
                  />
                  <button type="button" className="h-10 ml-2 md:ml-3 mr-4 md:mr-6 flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:gap-3 mt-2 md:mt-0">
                  {/* Dropdowns with bg color and no border or matching border */}
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                  >
                    {dynamicLocations.map((opt) => (
                      <option value={opt} key={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <select value={mode} onChange={e => setMode(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                    {MODES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                  </select>
                  <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                    {TYPES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-6 mb-3">
                <p className="text-sm text-gray-600">Showing {filteredJobs.length} jobs</p>
                <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-44">
                  {SORTS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {filteredJobs.length === 0 ? (
                  <div className="col-span-2 text-gray-500 text-center py-12">No jobs found.</div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        {job.experience && (
                          <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                            {normalizeExperienceText(job.experience)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium mb-2 text-blue-600">{job.company}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        {job.location && job.workMode !== 'Remote' && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>}
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.workMode}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.jobType}</span>
                        {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>}
                      </div>

                      {job.description && (
                        <div className="border-t border-gray-200 pt-3 mb-3">
                          <p className="text-xs md:text-sm text-gray-700 line-clamp-2">{job.description}</p>
                        </div>
                      )}

                      {Array.isArray(job.tags) && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-gray-200">
                          {job.tags.map((tag) => (
                            <span key={tag} className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-400">Job Posted: {job.time || '-'}</span>
                          <button
                            onClick={() => {
                              if (savedJobIds.includes(job.id)) {
                                setSelectedJobToUnsave(job.id);
                                setShowConfirmModal(true);
                              } else {
                                handleSaveJob(job.id);
                              }
                            }}
                            className={`p-2 rounded-lg transition-all ${savedJobIds.includes(job.id)
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                              }`}
                            title={
                              savedJobIds.includes(job.id)
                                ? 'Remove from saved'
                                : 'Save for later'
                            }
                          >
                            <Bookmark
                              className={`w-6 h-6 ${savedJobIds.includes(job.id)
                                ? 'fill-blue-600'
                                : ''
                                }`}
                            />
                          </button>
                        </div>
                        <div className="w-full flex justify-center -mt-1.5">
                          <button
                            onClick={() => router.push(`/candidate/view-job-post?jobId=${job.id}`)}
                            className="px-5 py-2 rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 text-sm font-semibold transition-all"
                          >
                            View Job Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedJobToUnsave(null);
                }}
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
                  await handleUnsaveJob(selectedJobToUnsave);

                  setShowConfirmModal(false);
                  setSelectedJobToUnsave(null);
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedJobToUnsave(null);
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
