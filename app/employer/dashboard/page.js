"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Search, MapPin, Calendar, DollarSign, Clock, LayoutGrid, FileText, Building2 } from "lucide-react";
import { getSearchJobsUrl } from "../../../routes/employer/searchJobs";
import { isEmployerLoggedIn } from "../../../utils/employerSession";
import Loader from "../../../utils/loader";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";

// Map API job to dashboard card format
const mapApiJobToCard = (job) => ({
  id: job.id ?? job.job_id,
  title: job.title ?? job.jobTitle,
  location: job.location ?? job.jobLocation,
  workMode: job.workMode ?? job.work_mode,
  jobType: job.jobType ?? job.job_type,
  level: job.level ?? (job.requiredExperience ? mapExperienceToLevel(job.requiredExperience) : 'Mid-Level'),
  skills: job.skills ?? [],
  applications: job.applications ?? job.applications_count ?? 0,
  time: job.time ?? job.posted_at ?? job.postedDate ?? '',
  status: job.status ?? 'Active',
  salary: job.salary ?? job.salaryRange ?? '',
  postedDate: job.postedDate ?? job.posted_at ?? job.created_at ?? '',
  description: job.description ?? job.jobDescription ?? '',
  responsibilities: job.responsibilities ?? job.keyResponsibilities ?? [],
  requirements: job.requirements ?? [],
  benefits: job.benefits ?? [],
});

const mapExperienceToLevel = (exp) => {
  if (!exp || typeof exp !== 'string') return 'Mid-Level';
  const lower = exp.toLowerCase();
  if (lower.includes('0-1') || lower.includes('junior')) return 'Junior';
  if (lower.includes('5+') || lower.includes('senior')) return 'Senior';
  return 'Mid-Level';
};

const formatJobTime = (dateStr) => {
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

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const REGIONS = [
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "Remote",
];
const MODES = ["On-site", "Remote", "Hybrid"];
const TYPES = ["Full-time", "Part-time", "Contract"];
const STATUS = ["Active", "Closed"];
const SORTS = ["Most Relevant", "Newest", "Oldest", "Most Applications"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [region, setRegion] = useState("All Regions");
  const [mode, setMode] = useState("All Work Modes");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState(SORTS[0]);
  const [search, setSearch] = useState("");
  const [showJobCreatedSuccess, setShowJobCreatedSuccess] = useState(false);

  const fetchJobs = async (skillsQuery = '', titleQuery = '', companyQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const url = getSearchJobsUrl(skillsQuery, titleQuery, companyQuery);
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.message || 'Failed to fetch jobs. Please try again.';
        if (data.detail) {
          errorMsg = Array.isArray(data.detail)
            ? data.detail.map((d) => d.msg ?? d.message ?? JSON.stringify(d)).join('. ')
            : typeof data.detail === 'string' ? data.detail : errorMsg;
        }
        setError(errorMsg);
        setJobs([]);
        setLoading(false);
        return;
      }

      const rawJobs = Array.isArray(data) ? data : (data.jobs ?? data.data ?? []);
      const mapped = rawJobs.map((j) => {
        const card = mapApiJobToCard(j);
        card.time = card.time ? formatJobTime(card.time) : '';
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isEmployerLoggedIn()) {
      router.push('/employer/login');
      return;
    }
    setAuthChecked(true);
    fetchJobs('');
  }, [router]);

  const handleSearch = () => {
    // For now the single `search` state is used for skills filter; additional
    // inputs (title/company) could be added later and passed through here.
    fetchJobs(search, '', '');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const flag = localStorage.getItem('job_created_success');
    if (flag === '1') {
      localStorage.removeItem('job_created_success');
      setShowJobCreatedSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (!showJobCreatedSuccess) return;
    const t = setTimeout(() => setShowJobCreatedSuccess(false), POPUP_TIMEOUT);
    return () => clearTimeout(t);
  }, [showJobCreatedSuccess]);

  if (!authChecked) {
    return <Loader text="Verifying access..." />;
  }

  // Helper function to convert level to experience years
  const getLevelInYears = (level) => {
    const levelMap = {
      'Junior': '0-1 years',
      'Mid-Level': '2-4 years',
      'Senior': '5+ years'
    };
    return levelMap[level] || level;
  };

  // Client-side filters (region, mode, type, status) applied on API results
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(job.skills) ? job.skills.join(' ') : '').toLowerCase().includes(search.toLowerCase());
    const matchesRegion = region === "All Regions" || job.location === region;
    const matchesMode = mode === "All Work Modes" || job.workMode === mode;
    const matchesType = type === "All Types" || job.jobType === type;
    const matchesStatus = status === "All Status" || job.status === status;
    return matchesSearch && matchesRegion && matchesMode && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MessagePopup show={showJobCreatedSuccess} message="Job created successfully" type="success" />
      {loading && <Loader text="Loading jobs..." />}
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <>
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Dashboard</h1>
              </div>
              <p className="text-base text-gray-500 ml-[52px] -mt-1">
                Monitor your job postings, applications, and manage your hiring process
              </p>
            </div>

            {/* Top stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Jobs Posted</p>
                      <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Applications</p>
                      <p className="text-3xl font-bold text-purple-600">{jobs.reduce((acc, j) => acc + (j.applications ?? 0), 0)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Search and Filters */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-center mb-6">
                  <div className="flex-1 flex items-center w-full">
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search by job title, company, or skills..."
                      className="w-full max-w-md h-10 rounded-xl bg-zinc-100 border border-zinc-100 px-3 text-base placeholder:text-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm flex items-center"
                      style={{ backgroundClip: 'padding-box' }}
                    />
                    <button type="button" onClick={handleSearch} className="h-10 ml-2 md:ml-3 mr-4 md:mr-6 flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:gap-3 mt-2 md:mt-0">
                    <select value={region} onChange={e => setRegion(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Regions">Regions</option>
                      {REGIONS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={mode} onChange={e => setMode(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Work Modes">Work Modes</option>
                      {MODES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Types">Types</option>
                      {TYPES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 mb-3">
                  <p className="text-sm text-gray-600">Showing {filteredJobs.length} jobs</p>
                  <div className="flex items-center gap-3">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-32">
                      <option value="All Status">Status</option>
                      {STATUS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-44">
                      {SORTS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                {/* Job List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
                  <h2 className="text-xl font-bold mb-4 text-blue-700">Your Job Posts</h2>
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}
                  {filteredJobs.length === 0 ? (
                    <div className="text-gray-500 text-center p-6">No job posts found.</div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-2xl"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{job.title}</h3>
                              {/* Experience badge */}
                              <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                                {getLevelInYears(job.level)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-2 shrink-0">
                              {/* Status badge */}
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} border whitespace-nowrap`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                            {job.workMode !== 'Remote' && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{job.workMode}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 mr-0.5" />{job.jobType}</span>
                            {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary}</span>}
                          </div>
                          {/* Job description (clamped) */}
                          {job.description && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                          )}
                          {/* Skills badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills && job.skills.map((skill) => (
                              <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {/* Bottom row: posted and total applications */}
                          <div className="mt-auto flex items-end flex-row justify-between pt-4 border-t border-gray-100 text-sm gap-2">
                            <span className="text-gray-400">
                              Job Posted: {formatDate(job.postedDate) || job.time || "-"}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200"><Users className="w-4 h-4" />{job.applications} Applications</span>
                          </div>
                          <div className="w-full flex justify-center mt-4">
                            <button
                              onClick={() => router.push(`/employer/view-job-post?jobId=${job.id}`)}
                              className="font-semibold text-sm text-blue-700 px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 transition-all focus:outline-none"
                            >
                              View Job Post
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
        </main>
      </div>
    </div>
  );
}