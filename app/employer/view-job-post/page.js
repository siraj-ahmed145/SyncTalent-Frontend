"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Building2,
  X
} from "lucide-react";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";
import Loader from "../../../utils/loader";
import { useState, useEffect } from "react";
import { normalizeExperienceText } from "../../../utils/experience";
import { GET_JOBS_API } from "../../../routes/employer/getJobs";
import { getCloseJobUrl } from "../../../routes/employer/closeJob";
import { getReopenJobUrl } from "../../../routes/employer/reopenJob";
import { getDeleteJobUrl } from "../../../routes/employer/deleteJob";
import { getViewApplicationsUrl } from "../../../routes/employer/viewApplications";

// helper: format date to DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (err) {
    return dateString;
  }
};

const getApplicationsCount = (job) => {
  if (!job) return 0;

  if (Array.isArray(job.applications)) {
    return job.applications.length;
  }

  const countValue =
    job.applications ??
    job.applications_count ??
    job.application_count ??
    job.totalApplications ??
    job.total_applications ??
    job.candidateshortlist ??
    job.candidiateshortlist;

  if (typeof countValue === "number") {
    return countValue;
  }

  if (typeof countValue === "string" && countValue.trim() !== "") {
    const parsed = parseInt(countValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

// helper: map API response to UI format
const mapApiJobToCard = (job) => ({
  id: job.id ?? job.job_id,
  title: job.title ?? job.jobTitle,
  location: job.location ?? job.jobLocation,
  workMode: job.workMode ?? job.work_mode,
  jobType: job.jobType ?? job.job_type,
  experience: job.requiredExperience ?? job.experience ?? job.level ?? "",
  level: job.level ?? "Mid-Level",
  skills: job.skills ?? [],
  applications: getApplicationsCount(job),
  time: job.time ?? job.posted_at ?? job.postedDate ?? "",
  status: job.status ?? "Active",
  salary: job.salary ?? job.salaryRange ?? "",
  postedDate: formatDate(
    job.postedDate ?? job.posted_at ?? job.created_at ?? ""
  ),
  description: job.description ?? job.jobDescription ?? "",
  responsibilities: job.responsibilities ?? job.keyResponsibilities ?? [],
  requirements: job.requirements ?? [],
  benefits: job.benefits ?? [],
});

export default function ViewJobPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = parseInt(searchParams.get("jobId"));

  // state for fetched job data
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state for modals and notifications
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // fetch job details when component mounts or jobId changes
  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      setError("No job ID provided");
      return;
    }

    const fetchJobDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = {};

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(GET_JOBS_API, {
          method: "GET",
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(
            data?.message || data?.detail || "Failed to fetch jobs"
          );
          setJob(null);
          return;
        }

        let jobs = [];

        if (Array.isArray(data)) {
          jobs = data;
        } else if (data.jobs && Array.isArray(data.jobs)) {
          jobs = data.jobs;
        } else if (data.data && Array.isArray(data.data)) {
          jobs = data.data;
        }

        const jobData = jobs.find(
          (j) => j.id === jobId || j.job_id === jobId
        );

        if (jobData) {
          setJob(mapApiJobToCard(jobData));
        } else {
          setError("Job not found in your job listings");
          setJob(null);
        }
      } catch (err) {
        setError(
          err?.message ||
          "Failed to fetch job details. Please try again."
        );
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // ✅ Fetch latest applications count
  useEffect(() => {
    if (!jobId) return;

    const fetchApplicationsCount = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          getViewApplicationsUrl(jobId),
          {
            method: "GET",
            headers,
          }
        );

        const data = await response.json();

        if (!response.ok) return;

        const applications = Array.isArray(data.applications)
          ? data.applications
          : [];

        // ✅ Update latest applications count
        setJob((prev) =>
          prev
            ? {
              ...prev,
              applications: applications.length,
            }
            : prev
        );
      } catch (err) {
        console.error(
          "Failed to fetch applications count",
          err
        );
      }
    };

    fetchApplicationsCount();
  }, [jobId]);

  // handler functions
  const handleActionClick = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    setShowConfirmModal(false);

    if (confirmAction === "close") {
      setActionLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          getCloseJobUrl(job.id),
          {
            method: "PUT",
            headers,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setSuccessMessage(
            data?.detail ||
            data?.message ||
            "Failed to close job"
          );

          setShowSuccessMessage(true);

          setTimeout(
            () => setShowSuccessMessage(false),
            POPUP_TIMEOUT
          );

          setActionLoading(false);
          return;
        }

        // Update local state immediately
        setJob((prev) => ({
          ...prev,
          status: "Closed",
        }));

        setSuccessMessage("Job Post closed successfully");
      } catch (err) {
        setSuccessMessage(
          err?.message ||
          "Something went wrong. Please try again."
        );
      } finally {
        setActionLoading(false);
      }
    }
    else if (confirmAction === "reopen") {
      setActionLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          getReopenJobUrl(job.id),
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              status: "Active",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setSuccessMessage(
            data?.detail ||
            data?.message ||
            "Failed to reopen job"
          );

          setShowSuccessMessage(true);

          setTimeout(
            () => setShowSuccessMessage(false),
            POPUP_TIMEOUT
          );

          setActionLoading(false);
          return;
        }

        // Update UI instantly
        setJob((prev) => ({
          ...prev,
          status: "Active",
        }));

        setSuccessMessage("Job Post reopened successfully");
      } catch (err) {
        setSuccessMessage(
          err?.message ||
          "Something went wrong. Please try again."
        );
      } finally {
        setActionLoading(false);
      }
    }
    else if (confirmAction === "delete") {
      setActionLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          getDeleteJobUrl(job.id),
          {
            method: "DELETE",
            headers,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setSuccessMessage(
            data?.detail ||
            data?.message ||
            "Failed to delete job"
          );

          setShowSuccessMessage(true);

          setTimeout(
            () => setShowSuccessMessage(false),
            POPUP_TIMEOUT
          );

          setActionLoading(false);
          return;
        }

        setSuccessMessage("Job Post deleted successfully");

        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);

          // redirect after delete
          router.push("/employer/dashboard");
        }, 1500);

      } catch (err) {
        setSuccessMessage(
          err?.message ||
          "Something went wrong. Please try again."
        );

        setShowSuccessMessage(true);

        setTimeout(
          () => setShowSuccessMessage(false),
          POPUP_TIMEOUT
        );
      } finally {
        setActionLoading(false);
      }

      return;
    }

    setShowSuccessMessage(true);

    setTimeout(
      () => setShowSuccessMessage(false),
      POPUP_TIMEOUT
    );
  };

  const getConfirmMessage = () => {
    switch (confirmAction) {
      case "close":
        return "Are you sure you want to close this job post?";

      case "reopen":
        return "Are you sure you want to reopen this job post?";

      case "delete":
        return "Are you sure you want to delete this job post?";

      default:
        return "";
    }
  };

  // show loader while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
        <Sidebar active="Dashboard" type="employer" />

        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />

          <main className="p-6 md:p-10 flex-1 flex items-center justify-center">
            <Loader />
          </main>
        </div>
      </div>
    );
  }

  // show error if job not found
  if (!job) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
        <Sidebar active="Dashboard" type="employer" />

        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />

          <main className="p-6 md:p-10 flex-1">
            <div className="text-center text-gray-500 dark:text-gray-400">
              {error || "Job not found"}
            </div>
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />

        <MessagePopup show={showSuccessMessage} message={successMessage} type="success" />

        {/* Action Loading Overlay */}
        {actionLoading && <Loader text="Closing job..." />}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 animate-scale-in">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Action</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{getConfirmMessage()}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-6 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Back Button */}
            <button
              onClick={() => router.push("/employer/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            {/* Job Details Content */}
            <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-sm dark:shadow-gray-900/25 border border-gray-200 dark:border-gray-700 p-8">
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h1>
                    <span className="px-3 py-1 text-sm rounded-full font-semibold bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap flex items-center justify-center">
                      {normalizeExperienceText(job.experience || job.level)}
                    </span>
                  </div>
                  <span className={`px-3 py-1.5 text-sm rounded-full font-semibold border whitespace-nowrap flex items-center justify-center ${
                    job.status === 'Active'
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/25 dark:text-green-300 dark:border-green-700'
                      : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/25 dark:text-red-300 dark:border-red-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-base text-gray-600 dark:text-gray-300">
                  {job.workMode !== 'Remote' && <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{job.location}</span>}
                  <span className="flex items-center gap-1"><Building2 className="w-5 h-5" />{job.workMode}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-5 h-5" />{job.jobType}</span>
                  {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-5 h-5" />{job.salary}</span>}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Posted Date</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{job.postedDate}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Users className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Applications</p>
                      <p className="text-2xl font-bold text-purple-600">{job.applications}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Job Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.description}</p>
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-base font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 text-lg shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 text-lg shrink-0">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-green-600 text-lg shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end mb-10">
                  <button
                    onClick={() => router.push(`/employer/applications?jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}`)}
                    className="py-3 px-5 text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 font-semibold rounded-xl transition-all">
                    View Applications
                  </button>
                </div>

                {job.status === 'Active' ? (
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleActionClick('close')}
                      className="py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md active:bg-amber-800">
                      Close Job Post
                    </button>
                    <button
                      onClick={() => router.push(`/employer/edit-job-post?jobId=${job.id}`)}
                      className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md active:bg-blue-800">
                      Edit Job Post
                    </button>
                    <button
                      onClick={() => handleActionClick('delete')}
                      className="py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md active:bg-red-800">
                      Delete Job Post
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleActionClick('reopen')}
                      className="py-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 font-semibold rounded-xl transition-colors border shadow-sm hover:shadow-md active:bg-green-200">
                      Reopen Job Post
                    </button>
                    <button
                      onClick={() => handleActionClick('delete')}
                      className="py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md active:bg-red-800">
                      Delete Job Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}