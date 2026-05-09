"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, MapPin, Briefcase, Calendar, DollarSign, Clock, Building2 } from "lucide-react";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";
import Loader from "../../../utils/loader";
import { useState, useEffect, useRef } from "react";
import { GET_JOBS_API } from "../../../routes/candidate/getJobs";
import { APPLY_JOB_API } from "../../../routes/candidate/applyJob";
import { getMatchScoreColor, getMatchScoreBgColor, getMatchScoreBorder } from "../../../utils/matchScoreUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .flatMap((item) => (typeof item === "string" ? item.split(/[\n|,]/) : []))
      .map((t) => t.trim())
      .filter((t) => t);
  }
  if (typeof tags === "string")
    return tags.split(/[\n|,]/).map((t) => t.trim()).filter((t) => t);
  return [];
};

const ensureArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .flatMap((item) => (typeof item === "string" ? item.split(/(?:\r?\n|\|)/) : []))
      .map((item) => item.replace(/^[•\-\*]\s*/, "").trim())
      .filter((item) => item);
  }
  if (typeof data === "string")
    return data
      .split(/(?:\r?\n|\|)/)
      .map((item) => item.replace(/^[•\-\*]\s*/, "").trim())
      .filter((item) => item);
  return [];
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day   = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year  = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const mapApiJobToCard = (job) => ({
  id:               job.id ?? job.job_id,
  title:            job.title ?? job.jobTitle,
  company:          job.company ?? job.companyName,
  location:         job.location ?? job.jobLocation,
  jobType:          job.jobType ?? job.job_type,
  workMode:         job.workMode ?? job.work_mode,
  salary:           job.salary ?? job.salaryRange ?? "",
  experience:       job.experience ?? job.requiredExperience ?? "",
  level:            job.level ?? job.experience ?? "Mid-Level",
  tags:             ensureTagsArray(job.tags ?? job.skills),
  time:             job.time ?? job.posted_at ?? job.created_at ?? "",
  postedDate:       formatDate(job.postedDate ?? job.posted_at ?? job.created_at ?? ""),
  description:      job.description ?? job.jobDescription ?? "",
  responsibilities: ensureArray(job.responsibilities ?? job.keyResponsibilities),
  requirements:     ensureArray(job.requirements),
  benefits:         ensureArray(job.benefits),
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function CandidateViewJobPostPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const jobId      = parseInt(searchParams.get("jobId"));
  const from       = searchParams.get("from");
  const matchScore = searchParams.get("matchScore");

  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ── Application modal state ────────────────────────────────────────────────
  const [isApplicationModalOpen,      setIsApplicationModalOpen]      = useState(false);
  const [applicationStep,             setApplicationStep]             = useState("choice");
  const [useCustomResume,             setUseCustomResume]             = useState(false);
  const [uploadedResume,              setUploadedResume]              = useState(null);
  const [showApplicationNotification, setShowApplicationNotification] = useState(false);
  const [isSubmittingApplication,     setIsSubmittingApplication]     = useState(false);
  const [modalError,                  setModalError]                  = useState("");

  // ── FIX: dynamic key forces the <input type="file"> to fully remount
  // whenever the modal opens or the user goes back to the upload step,
  // preventing the browser from serving a stale cached file reference.
  const [fileInputKey, setFileInputKey] = useState(0);

  // Ref stores the File object — immune to stale-closure issues in async handlers
  const uploadedResumeRef = useRef(null);

  // ── Fetch job ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) { setLoading(false); setError("No job ID provided"); return; }

    const fetchJobDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = { "Content-Type": "application/json" };
        const token = typeof window !== "undefined"
          ? localStorage.getItem("auth_token") : null;
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(GET_JOBS_API, { method: "GET", headers });
        const data = await response.json();

        if (!response.ok) {
          setError(data?.message || data?.detail || "Failed to fetch jobs");
          setJob(null);
          return;
        }

        let jobs = [];
        if (Array.isArray(data))                         jobs = data;
        else if (data.jobs && Array.isArray(data.jobs))  jobs = data.jobs;
        else if (data.data && Array.isArray(data.data))  jobs = data.data;

        const jobData = jobs.find((j) => j.id === jobId || j.job_id === jobId);
        if (jobData) {
          setJob(mapApiJobToCard(jobData));
        } else {
          setError("Job not found");
          setJob(null);
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch job details. Please try again.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getActivePage = () => {
    if (from === "recommendations") return "Job Recommendations";
    if (from === "applications")    return "Job Applications";
    if (from === "saved")           return "Saved Jobs";
    return "Search Job";
  };

  const handleApplyClick = () => {
    setModalError("");
    setIsApplicationModalOpen(true);
    setApplicationStep("choice");
    setUseCustomResume(false);
    setUploadedResume(null);
    uploadedResumeRef.current = null;
    // Bump key so the file input remounts fresh every time the modal opens
    setFileInputKey((k) => k + 1);
  };

  const closeModal = () => {
    setIsApplicationModalOpen(false);
    setApplicationStep("choice");
    setUseCustomResume(false);
    setUploadedResume(null);
    uploadedResumeRef.current = null;
    setModalError("");
  };

  const handleResumeChoice = (useCustom) => {
    setUseCustomResume(useCustom);
    setModalError("");
    if (useCustom) {
      // Clear any previously picked file and bump the input key so it remounts
      setUploadedResume(null);
      uploadedResumeRef.current = null;
      setFileInputKey((k) => k + 1);
      setApplicationStep("upload");
    } else {
      setUploadedResume(null);
      uploadedResumeRef.current = null;
      setApplicationStep("confirm");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setModalError("File size must be under 5MB.");
      return;
    }

    const allowedExt = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedExt.includes(ext)) {
      setModalError("Invalid file type. Allowed: PDF, DOC, DOCX.");
      return;
    }

    setModalError("");
    // Store in BOTH state and ref
    setUploadedResume(file);
    uploadedResumeRef.current = file;

    console.log("DEBUG handleFileUpload: file selected →", file.name, file.size, file.type);

    setApplicationStep("confirm");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmitApplication = async () => {
    setModalError("");

    // Always read from ref — not from state — to avoid stale closures
    const fileToUpload = uploadedResumeRef.current;

    console.log("DEBUG handleSubmitApplication:", {
      useCustomResume,
      fileToUpload: fileToUpload ? `${fileToUpload.name} (${fileToUpload.size} bytes)` : null,
    });

    // Guard: custom chosen but no file present
    if (useCustomResume && !fileToUpload) {
      setModalError("Please select a resume file before submitting.");
      setApplicationStep("upload");
      return;
    }

    try {
      setIsSubmittingApplication(true);

      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth_token") : null;
      // Do NOT set Content-Type manually — the browser sets it with the
      // correct multipart boundary when you pass FormData as the body.
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const formData = new FormData();

      if (useCustomResume && fileToUpload) {
        formData.append("resume", fileToUpload, fileToUpload.name);
        console.log("DEBUG: appended custom resume to FormData →", fileToUpload.name);
      }
      // Default resume path: send empty FormData so FastAPI gets File(None)
      // and falls back to the candidate's profile resume on the backend.

      // Verify FormData contents before sending
      console.log("DEBUG FormData 'resume' entry:", formData.get("resume"));

      const res = await fetch(APPLY_JOB_API(job.id), {
        method: "POST",
        headers,
        body: formData,
      });

      let respData = {};
      try { respData = await res.json(); } catch (_) { /* non-JSON response */ }

      console.log("DEBUG apply response:", res.status, respData);

      if (res.ok) {
        console.log("DEBUG: Application submitted. resume_used =", respData.resume_used,
                    "resume_filename =", respData.resume_filename);
        closeModal();
        setShowApplicationNotification(true);
        setTimeout(() => setShowApplicationNotification(false), POPUP_TIMEOUT);
      } else {
        const errorDetail =
          respData?.detail ||
          respData?.message ||
          `Submission failed (HTTP ${res.status}). Please try again.`;
        setModalError(errorDetail);
      }
    } catch (e) {
      setModalError(e.message || "Network error. Please check your connection and try again.");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  // ── Loading / error ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active={getActivePage()} type="candidate" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1 flex items-center justify-center">
            <Loader text="Loading job details..." />
          </main>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active={getActivePage()} type="candidate" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1">
            <div className="text-center text-gray-500">{error || "Job not found"}</div>
          </main>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active={getActivePage()} type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />

        <MessagePopup show={showApplicationNotification} message="Application Submitted Successfully" type="success" />

        <main className="p-6 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

            {/* Back Button */}
            <button
              onClick={() => {
                if (from === "recommendations") router.push("/candidate/job-recommendations");
                else if (from === "applications") router.push("/candidate/job-applications");
                else if (from === "saved")        router.push("/candidate/saved-jobs");
                else                              router.push("/candidate/job-search");
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>
                {from === "recommendations" ? "Back to Job Recommendations" :
                 from === "applications"    ? "Back to Job Applications"    :
                 from === "saved"           ? "Back to Saved Jobs"          :
                                             "Back to Job Search"}
              </span>
            </button>

            {/* Job Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg font-semibold text-blue-600 mb-3 mt-2">{job.company}</p>
                  </div>
                  {matchScore && (
                    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 shrink-0 ${getMatchScoreBgColor(parseInt(matchScore))} ${getMatchScoreBorder(parseInt(matchScore))}`}>
                      <p className={`text-3xl font-bold ${getMatchScoreColor(parseInt(matchScore))}`}>
                        {matchScore}%
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Job Match Score</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-base text-gray-600">
                  {job.workMode !== "Remote" && <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{job.location}</span>}
                  <span className="flex items-center gap-1"><Building2 className="w-5 h-5" />{job.workMode}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-5 h-5" />{job.jobType}</span>
                  {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-5 h-5" />{job.salary}</span>}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Posted Date</p>
                      <p className="text-2xl font-bold text-gray-900">{job.postedDate}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Experience Required</p>
                      <p className="text-2xl font-bold text-purple-600">{job.experience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(job.tags) && job.tags.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-600 text-base font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <span className="text-blue-600 text-lg shrink-0">•</span><span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <span className="text-blue-600 text-lg shrink-0">•</span><span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <span className="text-green-600 text-lg shrink-0">✓</span><span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleApplyClick}
                  className="px-6 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 text-base font-semibold rounded-lg transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Application Modal ──────────────────────────────────────────────── */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Apply for Position</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">

              {/* Job summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span>•</span><span>{job.workMode}</span>
                  <span>•</span><span>{job.salary}</span>
                </div>
              </div>

              {/* Error banner */}
              {modalError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {modalError}
                </div>
              )}

              {/* ── Step 1: Choice ─────────────────────────────────────── */}
              {applicationStep === "choice" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Resume Option</h3>
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

              {/* ── Step 2: Upload ─────────────────────────────────────── */}
              {applicationStep === "upload" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload a PDF or Word document (Max 5MB)</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    {/*
                      FIX: fileInputKey is a number that increments every time
                      the modal opens or the user re-enters the upload step.
                      React sees a new key → unmounts the old input → mounts a
                      brand-new one with no cached file, so onChange always fires
                      even if the user picks the same filename again.
                    */}
                    <input
                      key={fileInputKey}
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      {/* Show selected filename once a file is picked */}
                      {uploadedResume ? (
                        <p className="text-blue-700 font-semibold mb-1">{uploadedResume.name}</p>
                      ) : (
                        <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                      )}
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max. 5MB)</p>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      // Bump the key when going back so the input is fresh
                      // if the user comes back and picks again
                      setFileInputKey((k) => k + 1);
                      setApplicationStep("choice");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to options
                  </button>
                </div>
              )}

              {/* ── Step 3: Confirm ────────────────────────────────────── */}
              {applicationStep === "confirm" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Applying for</p>
                      <p className="font-medium text-gray-900">{job.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Resume</p>
                      <p className="font-medium text-gray-900">
                        {useCustomResume && uploadedResumeRef.current
                          ? `Custom: ${uploadedResumeRef.current.name}`
                          : "Default Profile Resume"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (useCustomResume) {
                          // Bump the key so the input remounts when going back to upload
                          setFileInputKey((k) => k + 1);
                          setApplicationStep("upload");
                        } else {
                          setApplicationStep("choice");
                        }
                      }}
                      disabled={isSubmittingApplication}
                      className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmittingApplication}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingApplication ? "Submitting…" : "Submit Application"}
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