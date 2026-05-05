'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Star, Sparkles, Bookmark, Building2, DollarSign } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Loader from '../../../utils/loader';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import { GET_JOB_RECOMMENDATIONS_API } from '../../../routes/candidate/jobRecommendations';
import { SAVE_JOB_API, GET_SAVED_JOBS_API } from '../../../routes/candidate/savedJobs';

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

const getMatchScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-orange-600';
  return 'text-gray-600';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showUnsaveNotification, setShowUnsaveNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

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
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch(GET_SAVED_JOBS_API, { headers });
        const data = await res.json().catch(() => null);
        if (res.ok && Array.isArray(data)) {
          setSavedJobIds(data.map((j) => j.id ?? j.job_id));
        }
      } catch (e) {
        console.error('Failed to load saved jobs', e);
      }
    };

    loadRecommendations();
    fetchSaved();
  }, []);

  const handleSaveJob = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${SAVE_JOB_API}/${jobId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: isSaved ? 'unsave' : 'save' }),
      });

      if (!res.ok) {
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), POPUP_TIMEOUT);
        return;
      }

      if (isSaved) {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        setShowUnsaveNotification(true);
        setTimeout(() => setShowUnsaveNotification(false), POPUP_TIMEOUT);
      } else {
        setSavedJobIds((prev) => [...prev, jobId]);
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), POPUP_TIMEOUT);
      }
    } catch (e) {
      console.error('Save/Unsave failed', e);
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), POPUP_TIMEOUT);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
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
                  <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Job Recommendations</h1>
                </div>
                <p className="text-base text-gray-500 ml-[52px] -mt-1">
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
                <p className="text-sm font-medium text-gray-700">{jobs.length} Jobs Recommended for You</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {jobs.length === 0 && !loading ? (
                  <div className="col-span-2 text-gray-500 text-center py-12">No recommendations available yet.</div>
                ) : (
                  jobs.map((job) => {
                    const matchScoreColor = getMatchScoreColor(job.matchScore);
                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all hover:shadow-lg hover:border-blue-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{job.title}</h3>
                              {job.experience && (
                                <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                                  {job.experience}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-blue-600">{job.company}</p>
                          </div>
                          <div className="ml-3 text-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl px-3 py-2 border border-gray-200 shadow-sm shrink-0">
                            <div className="text-xs text-gray-500 font-medium mb-0.5">Match</div>
                            <div className={`text-2xl font-bold ${matchScoreColor}`}>{job.matchScore}%</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
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
                          <div className="border-t border-gray-200 pt-3 mb-3">
                            <p className="text-xs md:text-sm text-gray-700 line-clamp-2">{job.description}</p>
                          </div>
                        )}

                        {Array.isArray(job.tags) && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-gray-200">
                            {job.tags.map((tag, idx) => (
                              <span key={`${tag}-${idx}`} className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-gray-400">Job Posted: {job.postedDate || '-'}</span>
                            <button
                              onClick={() => handleSaveJob(job.id)}
                              className={`p-2 rounded-lg transition-all ${savedJobIds.includes(job.id) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
                              title={savedJobIds.includes(job.id) ? 'Remove from saved' : 'Save for later'}
                            >
                              <Bookmark className={`w-6 h-6 ${savedJobIds.includes(job.id) ? 'fill-blue-600' : ''}`} />
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
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}