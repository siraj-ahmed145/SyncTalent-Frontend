"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Loader from "../../../utils/loader";
import { getViewApplicationsUrl } from "../../../routes/employer/viewApplications";
import { getUpdateApplicationStatusUrl } from "../../../routes/employer/updateApplicationStatus";
import {
  ArrowLeft, Users, CheckCircle, XCircle, Mail, Phone,
  MapPin, Clock, Github, FileText, Clock3
} from "lucide-react";
import { getMatchScoreColor, getMatchScoreBgColor, getMatchScoreBorder } from "../../../utils/matchScoreUtils";

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a fully-qualified resume URL.
 *
 * Backend returns a bare filename:  "ahmed_resume.pdf"
 * Backend serves files at:          BASE_URL/uploads/ahmed_resume.pdf
 *
 * Also handles edge cases:
 *   • already-absolute URL  → returned as-is
 *   • relative path with dirs → strip dirs, use filename only
 */
const resolveResumeUrl = (raw) => {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;  // already absolute, use as-is

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

  // Backend saves only the bare filename into ApplyJobs.resume
  // e.g. "3f2a1b4c-uuid.pdf"
  // Files are written to disk at:    uploads/resumes/<filename>
  // FastAPI static mount serves at:  BASE_URL/uploads/resumes/<filename>
  const filename = raw.split("/").filter(Boolean).pop();

  return `${base}/uploads/resumes/${filename}`;
};

/**
 * Map the backend application object to the shape the UI needs.
 * Backend fields:  application_id, applied_at, resume, status,
 *                  similarity_score, candidate { … }
 */
const mapApplication = (app) => {
  const c = app.candidate ?? {};

  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  const education      = parseList(c.education);
  const experience     = parseList(c.experience);
  const skills         = parseList(c.skills);
  const certifications = parseList(c.certifications);
  const languages      = parseList(c.languages);

  const expYears = experience.length
    ? `${experience.length} position${experience.length > 1 ? "s" : ""}`
    : null;

  // Prefer candidate's stored resume; fall back to the file attached to this application
  const rawResume = c.resume || app.resume || null;

  return {
    applicationId:     app.application_id,
    appliedAt:         app.applied_at,
    applicationResume: resolveResumeUrl(app.resume),
    status:            (app.status ?? "pending").toLowerCase(),
    // multiply by 100 only when stored as 0-1 float; adjust if already 0-100
    matchingScore:     app.similarity_score != null
                         ? Math.round(app.similarity_score * 100)
                         : null,

    id:         c.id,
    name:       c.full_name ?? "Unknown",
    email:      c.email ?? "",
    phone:      c.phone_number ?? "",
    location:   c.location ?? "",
    linkedin:   c.linkedin ?? "",
    github:     c.github ?? "",
    resume:     resolveResumeUrl(rawResume),
    experience: expYears ?? "",
    about:      c.about ?? c.bio ?? "",
    skills,
    workExperience:  experience,
    education,
    certifications,
    languages,
  };
};

// ─── Score colour helpers ─────────────────────────────────────────────────────
// Using centralized utility functions from matchScoreUtils for consistency

// ─── Reusable profile section ─────────────────────────────────────────────────
const ProfileSection = ({ title, items, renderItem }) =>
  items && items.length > 0 ? (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 pl-4">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  ) : null;



// ─── Main Component ───────────────────────────────────────────────────────────
export default function ViewApplicationsPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const jobId    = searchParams.get("jobId");
  const jobTitle = searchParams.get("jobTitle");

  const [candidates,        setCandidates]        = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus,      setFilterStatus]      = useState("all");
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState("");
  const [statusUpdating,    setStatusUpdating]    = useState(false);

  // ── Fetch applications ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) { setError("No job ID provided."); setLoading(false); return; }

    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined"
          ? localStorage.getItem("auth_token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res  = await fetch(getViewApplicationsUrl(jobId), { method: "GET", headers });
        const data = await res.json();

        if (!res.ok) {
          setError(data?.detail || data?.message || "Failed to load applications.");
          setCandidates([]);
          return;
        }

        const raw = Array.isArray(data.applications) ? data.applications : [];
        setCandidates(raw.map(mapApplication));
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  // ── Derived lists ──────────────────────────────────────────────────────────
  const shortlistedCandidates = candidates.filter((c) => c.status === "shortlisted");
  const rejectedCandidates    = candidates.filter((c) => c.status === "rejected");
  const pendingCandidates     = candidates.filter((c) => c.status === "pending");

  const filteredCandidates =
    filterStatus === "shortlisted" ? shortlistedCandidates :
    filterStatus === "rejected"    ? rejectedCandidates    :
    filterStatus === "pending"     ? pendingCandidates     :
    candidates;

  // ── Status toggle ──────────────────────────────────────────────────────────
  const handleStatusToggle = async (candidate) => {
    const newStatus = candidate.status === "shortlisted" ? "rejected" : "shortlisted";
    setStatusUpdating(true);
    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth_token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res  = await fetch(getUpdateApplicationStatusUrl(candidate.applicationId), {
        method: "PATCH", headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) { alert(data?.detail || data?.message || "Failed to update status."); return; }

      setCandidates((prev) =>
        prev.map((c) =>
          c.applicationId === candidate.applicationId ? { ...c, status: newStatus } : c
        )
      );
      setSelectedCandidate((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      alert(err.message || "Something went wrong.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />

        <main className="p-6 md:p-10 flex-1">

          {/* ── LIST VIEW ───────────────────────────────────────────────── */}
          {!selectedCandidate && (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <button
                  onClick={() => router.push(`/employer/view-job-post?jobId=${jobId}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to View Job Post</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {jobTitle || "Job"} – Applications
                </h1>
                <p className="text-gray-600">
                  Review applications and see how candidates match your job requirements
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-6">
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Total Applications", value: candidates.length,            color: "text-gray-900",  bg: "bg-purple-100", icon: <Users       className="w-6 h-6 text-purple-600" /> },
                    { label: "Pending",              value: pendingCandidates.length,     color: "text-amber-700",  bg: "bg-amber-100", icon: <Clock3 className="w-6 h-6 text-amber-600" /> },
                    { label: "Shortlisted",         value: shortlistedCandidates.length, color: "text-green-600", bg: "bg-green-100",  icon: <CheckCircle className="w-6 h-6 text-green-600" /> },
                    { label: "Rejected",            value: rejectedCandidates.length,    color: "text-red-600",   bg: "bg-red-100",    icon: <XCircle     className="w-6 h-6 text-red-600"   /> },
                  ].map(({ label, value, color, bg, icon }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                          <p className={`text-3xl font-bold ${color}`}>{value}</p>
                        </div>
                        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter buttons */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { key: "all",         label: "All",         active: "bg-blue-600  text-white shadow-md", inactive: "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600" },
                    { key: "pending",     label: "Pending",     active: "bg-amber-600 text-white shadow-md", inactive: "bg-white text-gray-700 border border-gray-200 hover:border-amber-500 hover:text-amber-600" },
                    { key: "shortlisted", label: "Shortlisted", active: "bg-green-600 text-white shadow-md", inactive: "bg-white text-gray-700 border border-gray-200 hover:border-green-500 hover:text-green-600" },
                    { key: "rejected",    label: "Rejected",    active: "bg-red-600   text-white shadow-md", inactive: "bg-white text-gray-700 border border-gray-200 hover:border-red-500 hover:text-red-600" },
                  ].map(({ key, label, active, inactive }) => (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                        filterStatus === key ? active : inactive
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidates grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {filterStatus === "all"         ? "All Candidates"         :
                     filterStatus === "pending"     ? "Pending Candidates"     :
                     filterStatus === "shortlisted" ? "Shortlisted Candidates" :
                                                      "Rejected Candidates"}
                  </h2>

                  {filteredCandidates.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        {error ? "Could not load candidates." : "No candidates found in this filter."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...filteredCandidates]
                        .sort((a, b) => (b.matchingScore ?? -1) - (a.matchingScore ?? -1))
                        .map((candidate) => {
                          const isShortlisted = candidate.status === "shortlisted";
                          const isRejected    = candidate.status === "rejected";
                          const isPending     = candidate.status === "pending";
                          return (
                            <div
                              key={candidate.applicationId}
                              className={`rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between ${
                                isShortlisted ? "bg-green-50 border-green-100 hover:border-green-200" :
                                isRejected    ? "bg-red-50   border-red-100 hover:border-red-200"   :
                                isPending     ? "bg-amber-50 border-amber-100 hover:border-amber-200" :
                                               "bg-gray-50  border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${
                                  isShortlisted ? "bg-green-100 text-green-600" :
                                  isRejected    ? "bg-red-100   text-red-600"   :
                                  isPending     ? "bg-amber-100 text-amber-700" :
                                                 "bg-gray-200  text-gray-600"
                                }`}>
                                  {candidate.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 truncate">{candidate.name}</h3>
                                  {candidate.status === "pending" && (
                                    <span className="text-xs text-gray-400 font-medium">Pending review</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 ml-4">
                                <div className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${getMatchScoreBgColor(candidate.matchingScore)} ${getMatchScoreBorder(candidate.matchingScore)}`}>
                                  <p className="text-xs text-gray-600 font-medium">Match</p>
                                  <p className={`text-2xl font-bold ${getMatchScoreColor(candidate.matchingScore)}`}>
                                    {candidate.matchingScore != null ? `${candidate.matchingScore}%` : "N/A"}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setSelectedCandidate(candidate)}
                                  className="font-semibold text-sm text-blue-700 px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all focus:outline-none whitespace-nowrap"
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── DETAIL VIEW ─────────────────────────────────────────────── */}
          {selectedCandidate && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Applications</span>
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                {/* Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                        {selectedCandidate.name.charAt(0).toUpperCase()}
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900">{selectedCandidate.name}</h1>
                    </div>
                    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 ${getMatchScoreBgColor(selectedCandidate.matchingScore)} ${getMatchScoreBorder(selectedCandidate.matchingScore)}`}>
                      <p className={`text-3xl font-bold ${getMatchScoreColor(selectedCandidate.matchingScore)}`}>
                        {selectedCandidate.matchingScore != null ? `${selectedCandidate.matchingScore}%` : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Job Match Score</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCandidate.status === "shortlisted" ? (
                      <><CheckCircle className="w-5 h-5 text-green-600" /><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm">Shortlisted</span></>
                    ) : selectedCandidate.status === "rejected" ? (
                      <><XCircle className="w-5 h-5 text-red-600" /><span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-sm">Rejected</span></>
                    ) : (
                      <><Clock3 className="w-5 h-5 text-amber-600" /><span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium text-sm">Pending Review</span></>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { show: selectedCandidate.email,      icon: <Mail        className="w-5 h-5 text-blue-600"            />, label: "Email",      val: selectedCandidate.email },
                      { show: selectedCandidate.phone,      icon: <Phone       className="w-5 h-5 text-green-500"           />, label: "Phone",      val: selectedCandidate.phone },
                      { show: selectedCandidate.location,   icon: <MapPin      className="w-5 h-5 text-red-600"             />, label: "Location",   val: selectedCandidate.location },
                      { show: selectedCandidate.experience, icon: <Clock       className="w-5 h-5 text-purple-600"          />, label: "Experience", val: selectedCandidate.experience },
                      { show: selectedCandidate.linkedin,   icon: <LinkedinIcon className="w-5 h-5 text-[#0A66C2]"         />, label: "LinkedIn",   val: selectedCandidate.linkedin },
                      { show: selectedCandidate.github,     icon: <Github      className="w-5 h-5 text-gray-900"           />, label: "GitHub",     val: selectedCandidate.github },
                    ].filter((i) => i.show).map(({ icon, label, val }) => (
                      <div key={label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        {icon}
                        <div>
                          <p className="text-sm text-gray-500">{label}</p>
                          <p className="text-base font-medium text-gray-900">{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About */}
                {selectedCandidate.about && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{selectedCandidate.about}</p>
                  </div>
                )}

                {/* Skills */}
                {selectedCandidate.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 text-base font-medium rounded-full border border-blue-200">
                          {typeof skill === "string" ? skill : skill.name ?? JSON.stringify(skill)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                <ProfileSection
                  title="Work Experience"
                  items={selectedCandidate.workExperience}
                  renderItem={(exp) => (
                    <>
                      <h4 className="font-bold text-gray-900">{exp.title ?? exp.jobTitle ?? exp.position ?? ""}</h4>
                      <p className="text-blue-600 font-medium">{exp.company ?? exp.companyName ?? ""}</p>
                      <p className="text-sm text-gray-500 mb-1">{exp.duration ?? exp.period ?? ""}</p>
                      {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                    </>
                  )}
                />

                {/* Education */}
                <ProfileSection
                  title="Education"
                  items={selectedCandidate.education}
                  renderItem={(edu) => (
                    <>
                      <h4 className="font-bold text-gray-900">{edu.degree ?? edu.title ?? ""}</h4>
                      <p className="text-blue-600 font-medium">{edu.institution ?? edu.school ?? edu.university ?? ""}</p>
                      <p className="text-sm text-gray-500">{edu.year ?? edu.graduationYear ?? ""}</p>
                    </>
                  )}
                />

                {/* Certifications */}
                <ProfileSection
                  title="Certifications"
                  items={selectedCandidate.certifications}
                  renderItem={(cert) => (
                    <>
                      <h4 className="font-bold text-gray-900">{cert.name ?? cert.title ?? ""}</h4>
                      <p className="text-blue-600 font-medium">{cert.issuer ?? cert.issuingOrganization ?? ""}</p>
                      <p className="text-sm text-gray-500">{cert.year ?? cert.date ?? ""}</p>
                    </>
                  )}
                />

                {/* Languages */}
                <ProfileSection
                  title="Languages"
                  items={selectedCandidate.languages}
                  renderItem={(lang) => (
                    <>
                      <h4 className="font-bold text-gray-900">{typeof lang === "string" ? lang : lang.name ?? ""}</h4>
                      {lang.proficiency && <p className="text-blue-600 font-medium">{lang.proficiency}</p>}
                    </>
                  )}
                />

                {/* ── Resume section ──────────────────────────────────────── */}
                {selectedCandidate.resume && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Resume</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-2">Submitted Resume</p>
                        <p className="text-blue-600 font-semibold mb-6 break-all text-center max-w-xs text-sm">
                          {selectedCandidate.resume.split("/").pop().split("?")[0]}
                        </p>
                        <a
                          href={selectedCandidate.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          View Resume
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusToggle(selectedCandidate)}
                      disabled={statusUpdating}
                      className={`py-3 px-5 font-semibold rounded-xl transition-colors border disabled:opacity-60 disabled:cursor-not-allowed ${
                        selectedCandidate.status === "shortlisted"
                          ? "bg-red-100 hover:bg-red-200 text-red-700 border-red-400"
                          : "bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                      }`}
                    >
                      {statusUpdating
                        ? "Updating…"
                        : selectedCandidate.status === "shortlisted"
                        ? "Move to Rejected"
                        : "Move to Shortlist"}
                    </button>
                    <button className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}