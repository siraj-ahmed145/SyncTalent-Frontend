'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Star, Sparkles, Bookmark, Building2, DollarSign } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Loader from '../../../utils/loader';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import { normalizeExperienceText } from '../../../utils/experience';
import { GET_JOB_RECOMMENDATIONS_API } from '../../../routes/candidate/jobRecommendations';
import { GET_APPLICATIONS_API } from '../../../routes/candidate/applyJob';
import { SAVE_JOB_API, UNSAVE_JOB_API, GET_SAVED_JOBS_API } from '../../../routes/candidate/savedJobs';
import { getMatchScoreColor, getMatchScoreBg } from '../../../utils/matchScoreUtils';
import { X } from 'lucide-react';

const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .flatMap((t) => {
        if (typeof t !== 'string') return [];
        return t.split(/[,|]/).map((x) => x.trim()).filter(Boolean);
      })
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
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
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
};



const mapRecommendationToCard = (job) => {
  const percentage = Math.max(0, Math.min(100, Number(job.similarity_score || 0) * 100));
  return {
    id: job.job_id,
    title: job.jobTitle || '',
    company: job.companyName || '',
    location: job.jobLocation || '',
    jobType: job.jobType || '',
    workMode: job.workMode || '',
    salary: job.salaryRange || '',
    experience: job.requiredExperience || '',
    tags: ensureTagsArray(job.skills),
    description: job.jobDescription || '',
    postedDate: formatTime(job.created_at),
    matchScore: Number(percentage.toFixed(1)),
  };
};

// Serialise any thrown value into a readable string for logging
const toErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  try { return JSON.stringify(err); } catch { return String(err); }
};

const getRecommendationUrls = () => {
  const urls = [];
  if (GET_JOB_RECOMMENDATIONS_API) {
    urls.push(`${GET_JOB_RECOMMENDATIONS_API}?top_k=10`);
  }
  urls.push('http://127.0.0.1:8000/candidiate/job_recommendations?top_k=10');
  urls.push('http://localhost:8000/candidiate/job_recommendations?top_k=10');
  return [...new Set(urls)];
};

// Recommendations can be slow (embedding generation), so allow 60 s before giving up
const RECOMMENDATIONS_TIMEOUT_MS = 60_000;

const fetchWithFallbacks = async (urls, headers) => {
  let lastError = null;

  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RECOMMENDATIONS_TIMEOUT_MS);

    try {
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json().catch(() => null);
      console.debug('[Recommendations] attempt', { url, status: res.status });

      if (res.ok) return { res, data };

      // Non-2xx: log clearly and try next URL
      const msg = data?.detail || data?.message || `HTTP ${res.status}`;
      lastError = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      console.warn('[Recommendations] non-ok, trying next URL', { url, status: res.status, msg });
    } catch (networkErr) {
      clearTimeout(timeoutId);
      // Timeout, CORS, refused connection, DNS failure — log real message and try next URL
      lastError = networkErr instanceof Error ? networkErr : new Error(String(networkErr));
      const isTimeout = networkErr?.name === 'AbortError';
      console.error('[Recommendations] ' + (isTimeout ? 'timeout' : 'network error') + ', trying next URL', {
        url,
        errorName: networkErr?.name,
        errorMessage: toErrorMessage(networkErr),
      });
    }
  }

  throw lastError || new Error('Failed to fetch recommendations from all endpoints.');
};

export default function JobRecommendationsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showUnsaveNotification, setShowUnsaveNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const visibleJobs = jobs
    .filter((job) => !appliedJobIds.includes(job.id))
    .slice(0, 10);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedJobToUnsave, setSelectedJobToUnsave] = useState(null);
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError('');
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const urls = getRecommendationUrls();

        // FIX: Use the fallback-aware fetch helper instead of a manual loop with break
        const { data } = await fetchWithFallbacks(urls, headers);

        const list = Array.isArray(data?.recommendations) ? data.recommendations : [];
        setJobs(list.map(mapRecommendationToCard));
      } catch (e) {
        setError(e.message || 'Something went wrong while loading recommendations.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

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

    const fetchAppliedJobs = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) return;

        const res = await fetch(GET_APPLICATIONS_API, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json().catch(() => null);
        const applications = Array.isArray(data.applications) ? data.applications : [];
        const ids = applications
          .map((app) => app.job_id ?? app.jobId ?? app.job?.job_id ?? app.job?.id)
          .filter(Boolean);
        setAppliedJobIds(ids);
      } catch (err) {
        console.error('Failed to load applied jobs', err);
      }
    };

    loadRecommendations();
    fetchSaved();
    fetchAppliedJobs();
  }, []);

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

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
      {loading && <Loader text="Loading recommendations..." />}
      <Sidebar active="Job Recommendations" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20 relative">
        <Topbar />

        <MessagePopup show={showSaveNotification} message="Job Saved for later" type="success" />
        <MessagePopup show={showUnsaveNotification} message="Job Removed from Saved Jobs" type="success" />
        <MessagePopup show={showErrorNotification} message="Could not update saved jobs" type="error" />

        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 leading-none -mt-1">Job Recommendations</h1>
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 ml-[52px] -mt-1">
                  Personalized job matches based on your profile and resume
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{visibleJobs.length} Jobs Recommended for You</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {visibleJobs.length === 0 && !loading ? (
                  <div className="col-span-2 text-gray-500 dark:text-gray-400 text-center py-12">No recommendations available yet.</div>
                ) : (
                  visibleJobs.map((job) => {
                    const matchScoreColor = getMatchScoreColor(job.matchScore);
                    return (
                      <div
                        key={job.id}
                        className="bg-white dark:bg-[#1a2332] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col h-full transition-all hover:shadow-lg hover:border-blue-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                              {job.experience && (
                                <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                                  {normalizeExperienceText(job.experience)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-blue-600">{job.company}</p>
                          </div>
                          <div className={`ml-3 text-center rounded-xl px-3 py-2 border shadow-sm shrink-0 ${getMatchScoreBg(job.matchScore)}`}>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Match</div>
                            <div className={`text-2xl font-bold ${matchScoreColor}`}>{job.matchScore}%</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {job.location && job.workMode !== 'Remote' && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {job.location}
                            </span>
                          )}
                          {job.workMode && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" /> {job.workMode}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" /> {job.jobType}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> {job.salary}
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{job.description}</p>
                          </div>
                        )}

                        {Array.isArray(job.tags) && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-gray-200 dark:border-gray-700">
                            {job.tags.map((tag, idx) => (
                              <span key={`${tag}-${idx}`} className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-gray-400">Job Posted: {job.postedDate || '-'}</span>
                            <button
                              onClick={() => {
                                if (savedJobIds.includes(job.id)) {
                                  setSelectedJobToUnsave(job.id);
                                  setShowConfirmModal(true);
                                } else {
                                  handleSaveJob(job.id);
                                }
                              }}
                              className="p-2 rounded-lg transition-all text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/40"
                              title={
                                savedJobIds.includes(job.id)
                                  ? 'Remove from saved'
                                  : 'Save for later'
                              }
                            >
                              <Bookmark
                                className={`w-6 h-6 ${savedJobIds.includes(job.id)
                                  ? 'fill-blue-600'
                                  : 'fill-none'
                                  }`}
                              />
                            </button>
                          </div>
                          <div className="w-full flex justify-center -mt-1.5">
                            <button
                              onClick={() => router.push(
                                `/candidate/view-job-post?jobId=${job.id}&from=recommendations&matchScore=${job.matchScore}`
                              )}
                              className="px-5 py-2 rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 text-sm font-semibold transition-all"
                            >
                              View Job Post
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 animate-scale-in">

            <div className="flex justify-between items-start mb-4">

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Confirm Action
              </h3>

              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedJobToUnsave(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
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
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
              >
                No
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}