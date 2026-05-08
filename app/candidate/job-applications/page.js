'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Clock, FileText, CheckCircle, XCircle, Clock3, Building2, DollarSign, FileCheck } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Loader from '../../../utils/loader';
import { normalizeExperienceText } from '../../../utils/experience';
import { GET_APPLICATIONS_API } from '../../../routes/candidate/applyJob';
import { getMatchScoreColor, getMatchScoreBg } from '../../../utils/matchScoreUtils';

const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .flatMap((t) => (typeof t === 'string' ? t.split(/[,|\n]/) : []))
      .map((x) => x.trim())
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(/[,|\n]/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
};

const getFirstNonEmpty = (...values) => {
  for (const value of values) {
    if (value === 0) return 0;
    if (value || value === false) {
      const text = String(value).trim();
      if (text) return text;
    }
  }
  return '';
};

const mapApplicationToCard = (app) => {
  const job = app.job ?? app.job_post ?? app.jobDetails ?? app.job_data ?? app.job_detail ?? app.jobInfo ?? app.applicationJob ?? null;
  const rawScore = app.similarity_score ?? app.matchingScore ?? app.match_score ?? job?.similarity_score ?? job?.match_score;
  let normalizedScore = null;
  if (rawScore != null && !Number.isNaN(Number(rawScore))) {
    const numeric = Number(rawScore);
    normalizedScore = numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);
  }

  const title = getFirstNonEmpty(
    app.jobTitle,
    app.title,
    app.position,
    app.job_title,
    app.job_name,
    job?.jobTitle,
    job?.title,
    job?.position,
    job?.job_title,
    job?.job_name
  );
  const company = getFirstNonEmpty(
    app.companyName,
    app.company,
    app.employerName,
    app.company_name,
    job?.companyName,
    job?.company,
    job?.employerName,
    job?.company_name
  );
  const location = getFirstNonEmpty(
    app.jobLocation,
    app.location,
    app.workLocation,
    app.job_location,
    app.location_name,
    job?.jobLocation,
    job?.location,
    job?.workLocation,
    job?.job_location,
    job?.location_name
  );
  const jobType = getFirstNonEmpty(
    app.jobType,
    app.job_type,
    app.type,
    app.employmentType,
    job?.jobType,
    job?.job_type,
    job?.type,
    job?.employmentType
  );
  const workMode = getFirstNonEmpty(
    app.workMode,
    app.work_mode,
    app.mode,
    app.schedule,
    job?.workMode,
    job?.work_mode,
    job?.mode,
    job?.schedule
  );
  const salary = getFirstNonEmpty(
    app.salaryRange,
    app.salary,
    app.compensation,
    app.salary_range,
    job?.salaryRange,
    job?.salary,
    job?.compensation,
    job?.salary_range
  );
  const experience = getFirstNonEmpty(
    app.requiredExperience,
    app.experience,
    app.required_experience,
    app.level,
    job?.requiredExperience,
    job?.experience,
    job?.required_experience,
    job?.level
  );
  const description = getFirstNonEmpty(
    app.jobDescription,
    app.description,
    app.job_description,
    app.summary,
    app.details,
    app.jobDetails,
    job?.jobDescription,
    job?.description,
    job?.job_description,
    job?.summary,
    job?.details,
    job?.jobDetails,
    ''
  );

  return {
    id: app.application_id ?? app.id ?? app.job_id ?? app.jobId ?? job?.id ?? job?.job_id,
    title: title || 'Untitled Job',
    company: company || 'Unknown Company',
    location: location || 'Not specified',
    jobType: jobType || 'Full-time',
    workMode: workMode || 'Hybrid',
    salary: salary || undefined,
    experience,
    appliedDate: app.applied_at
      ? new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A',
    status: getFirstNonEmpty(
      app.status,
      app.application_status,
      app.state,
      app.statusText,
      app.status_text,
      job?.status,
      'pending'
    ),
    matchScore: normalizedScore,
    tags: ensureTagsArray(
      app.skills ?? app.tags ?? app.jobTags ?? job?.skills ?? job?.tags ?? job?.jobTags
    ),
    description: description || 'No description available',
  };
};


export default function CandidateApplicationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) {
          setError('Authentication required. Please login first.');
          setApplications([]);
          return;
        }

        const res = await fetch(GET_APPLICATIONS_API, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch applications: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const rawApplications = Array.isArray(data.applications) ? data.applications : [];
        const mappedApplications = rawApplications.map((app) => mapApplicationToCard(app));
        setApplications(mappedApplications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to fetch applications');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const normalizeStatus = (status) => String(status || '').trim().toLowerCase();
  const totalApplied = applications.length;
  const shortlisted = applications.filter(app => normalizeStatus(app.status) === "shortlisted").length;
  const rejected = applications.filter(app => normalizeStatus(app.status) === "rejected").length;
  const pending = applications.filter(app => {
    const s = normalizeStatus(app.status);
    return s === "in progress" || s === "pending";
  }).length;

  const filteredApplications = statusFilter === "All"
    ? applications
    : applications.filter(app => {
        const s = normalizeStatus(app.status);
        if (statusFilter === "Shortlisted") return s === "shortlisted";
        if (statusFilter === "Rejected") return s === "rejected";
        if (statusFilter === "Pending") return s === "in progress" || s === "pending";
        return true;
      });

  const getStatusBadge = (status) => {
    const normalized = String(status || '').trim().toLowerCase();
    switch(normalized) {
      case "Shortlisted":
      case "shortlisted":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: <CheckCircle className="w-4 h-4" /> };
      case "Rejected":
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: <XCircle className="w-4 h-4" /> };
      case "in progress":
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: <Clock3 className="w-4 h-4" /> };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: <FileText className="w-4 h-4" /> };
    }
  };

  // Returns color based on score — null score gets a neutral style


  const getFilterColors = (filter) => {
    switch(filter) {
      case "Shortlisted":
        return statusFilter === filter
          ? "bg-green-600 text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-green-500 hover:text-green-600";
      case "Pending":
        return statusFilter === filter
          ? "bg-amber-600 text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-amber-500 hover:text-amber-600";
      case "Rejected":
        return statusFilter === filter
          ? "bg-red-600 text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-red-500 hover:text-red-600";
      default:
        return statusFilter === filter
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Job Applications" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

              {/* Page Header */}
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Job Applications</h1>
                </div>
                <p className="text-base text-gray-500 ml-[52px] -mt-1">
                  Track the status of all your job applications
                </p>
              </div>

              {/* Statistics Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Applied</p>
                      <p className="text-3xl font-bold text-gray-900">{totalApplied}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Pending</p>
                      <p className="text-3xl font-bold text-amber-700">{pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Clock3 className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Shortlisted</p>
                      <p className="text-3xl font-bold text-green-600">{shortlisted}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Rejected</p>
                      <p className="text-3xl font-bold text-red-600">{rejected}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {["All", "Pending", "Shortlisted", "Rejected"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${getFilterColors(filter)}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="py-24">
                  <Loader text="Loading applications..." />
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-500">No applications match the selected filter.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {filteredApplications.map((app) => {
                    const statusBadge = getStatusBadge(app.status);
                    const matchScoreColor = getMatchScoreColor(app.matchScore);
                    const matchScoreBg = getMatchScoreBg(app.matchScore);

                    return (
                      <div
                        key={app.id}
                        className={`rounded-2xl border p-5 shadow-sm flex flex-col h-full transition-all hover:shadow-lg ${
                          app.status === 'shortlisted' ? 'bg-green-50 border-green-100 hover:border-green-200' :
                          app.status === 'rejected'    ? 'bg-red-50 border-red-100 hover:border-red-200'   :
                                                           'bg-amber-50 border-amber-100 hover:border-amber-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                {app.title}
                              </h3>
                              <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                                {app.experience ? normalizeExperienceText(app.experience) : 'Not specified'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-blue-600">{app.company}</p>
                          </div>

                          {/* Match Score Badge — shows N/A when no resume was scored */}
                          <div className={`ml-3 text-center rounded-xl px-3 py-2 border shadow-sm shrink-0 ${matchScoreBg}`}>
                            <div className="text-xs text-gray-500 font-medium mb-0.5">Match</div>
                            {app.matchScore !== null ? (
                              <div className={`text-2xl font-bold ${matchScoreColor}`}>
                                {app.matchScore}%
                              </div>
                            ) : (
                              <div className="text-sm font-semibold text-gray-400 leading-6">
                                N/A
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 -mt-3 mb-3">
                          {app.workMode !== 'Remote' && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {app.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" /> {app.workMode}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" /> {app.jobType}
                          </span>
                          {app.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> {app.salary}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-200 pt-3 mb-3">
                          <p className="text-xs md:text-sm text-gray-700 line-clamp-2">{app.description}</p>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-gray-200">
                          {app.tags.length > 0 ? app.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          )) : (
                            <span className="text-xs text-gray-400">No skills listed</span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Applied: {app.appliedDate}</span>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.icon}
                            <span>{app.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}