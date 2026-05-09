"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";
import { Phone, Mail, MapPin, Github, User, FileText, CheckCircle, Upload } from "lucide-react";
import { isUserLoggedIn } from "../../../utils/session";
import Loader from "../../../utils/loader";
import InputPopup from "../../components/InputPopup";
import {
  GET_CANDIDATE_PROFILE_API,
  UPDATE_CANDIDATE_PROFILE_API,
  CREATE_CANDIDATE_PROFILE_API
} from '../../../routes/candidate/getCandidateProfile';

const cleanString = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/[{}"\\]/g, '')
    .replace(/[\[\]]/g, '')
    .trim();
};

const ensureArray = (val) => {
  if (!val) return [];
  const splitAndClean = (item) => {
    const cleaned = cleanString(item);
    if (!cleaned) return [];
    // Support "React, Next.js" and "React|Next.js" and combinations
    return cleaned
      .split(/[,|]/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

  if (Array.isArray(val)) {
    return val.flatMap(splitAndClean);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.flatMap(splitAndClean);
      }
    } catch (e) {}
    return splitAndClean(val);
  }
  return [];
};

const mapBackendToFrontend = (backendData) => {
  if (!backendData) return null;
  return {
    name: backendData.full_name || "",
    email: backendData.email || "",
    phone: backendData.phone_number || "",
    location: backendData.location || "",
    linkedin: backendData.linkedin || "",
    github: backendData.github || "",
    about: backendData.about || "",
    skills: ensureArray(backendData.skills),
    certifications: backendData.certifications || [],
    languages: backendData.languages || [],
    workExperience: backendData.experience || [],
    education: backendData.education || [],
    resume: backendData.resume || ""
  };
};

const mapFrontendToBackend = (frontendProfile) => {
  const formData = new FormData();

  // ✅ Required fields — send a space if empty so FastAPI doesn't reject them
  formData.append('full_name', frontendProfile.name?.trim() || ' ');
  formData.append('email', frontendProfile.email?.trim() || ' ');
  formData.append('phone_number', frontendProfile.phone?.trim() || ' ');

  // ✅ Optional string fields
  formData.append('location', frontendProfile.location || '');
  formData.append('about', frontendProfile.about || '');
  formData.append('linkedin', frontendProfile.linkedin || '');
  formData.append('github', frontendProfile.github || '');

  // ✅ Array fields — always send valid JSON
  formData.append('skills', JSON.stringify(frontendProfile.skills || []));
  formData.append('certifications', JSON.stringify(frontendProfile.certifications || []));
  formData.append('languages', JSON.stringify(frontendProfile.languages || []));
  formData.append('experience', JSON.stringify(frontendProfile.workExperience || []));
  formData.append('education', JSON.stringify(frontendProfile.education || []));

  return formData;
};

const getResumeUrl = () => {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  return `${BASE}/candidiate/resume`;
};

const downloadResume = async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const cacheBuster = `?t=${Date.now()}`;
    const res = await fetch(getResumeUrl() + cacheBuster, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) {
      alert('Failed to open resume. Please try again.');
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (e) {
    alert('Error opening resume: ' + e.message);
  }
};

const ADD_PILL_BTN =
  "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 hover:border-blue-300 hover:text-blue-800 active:bg-blue-300 transition-all shadow-sm";

const SECTION_ACTION_BTN =
  "text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors shrink-0";

const defaultModalForm = (type) => {
  switch (type) {
    case "skill":
      return { skill: "" };
    case "experience":
      return { title: "", company: "", duration: "", description: "" };
    case "education":
      return { degree: "", institution: "", year: "" };
    case "certification":
      return { name: "", issuer: "", year: "" };
    case "language":
      return { name: "", proficiency: "" };
    default:
      return {};
  }
};

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2"/>
  </svg>
);

export default function CandidateDashboard() {
  const router = useRouter();
  const resumeInputRef = useRef(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileExists, setProfileExists] = useState(false); // ✅ tracks if profile exists on backend
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showProfileUpdated, setShowProfileUpdated] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    about: "",
    skills: [],
    certifications: [],
    languages: [],
    workExperience: [],
    education: [],
    resume: ""
  });

  const [addModalType, setAddModalType] = useState(null);
  const [addModalForm, setAddModalForm] = useState(() => defaultModalForm("skill"));
  const [addModalError, setAddModalError] = useState("");

  const openAddModal = (type) => {
    setAddModalType(type);
    setAddModalForm(defaultModalForm(type));
    setAddModalError("");
  };

  const closeAddModal = () => {
    setAddModalType(null);
    setAddModalError("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isUserLoggedIn()) {
      router.push("/candidate/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined" || !authChecked) return;
    const flag = localStorage.getItem("login_success_candidate");
    if (flag === "1") {
      localStorage.removeItem("login_success_candidate");
      setShowLoginSuccess(true);
    }
  }, [authChecked]);

  useEffect(() => {
    if (!authChecked) return;
    const fetchProfile = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(GET_CANDIDATE_PROFILE_API, { headers });
        const data = await res.json().catch(() => null);
        console.debug('GET profile response', res.status, data);
        if (res.ok && data) {
          const mappedData = mapBackendToFrontend(data);
          setProfile(mappedData);
          setProfileExists(true); // ✅ profile loaded = already exists
        }
        // if 404 → new candidate, profileExists stays false
      } catch (e) {
        console.error('Could not load profile', e);
      }
    };
    fetchProfile();
  }, [authChecked]);

  useEffect(() => {
    if (!showLoginSuccess) return;
    const t = setTimeout(() => setShowLoginSuccess(false), POPUP_TIMEOUT);
    return () => clearTimeout(t);
  }, [showLoginSuccess]);

  if (!authChecked) {
    return <Loader text="Verifying access..." />;
  }

  const toggleEdit = async (section) => {
    if (isEditing[section]) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const formData = mapFrontendToBackend(profile);

        // ✅ POST for new candidates, PUT for existing ones
        const method = profileExists ? 'PUT' : 'POST';
        const url = profileExists ? UPDATE_CANDIDATE_PROFILE_API : CREATE_CANDIDATE_PROFILE_API;

        const res = await fetch(url, { method, headers, body: formData });
        const respData = await res.json().catch(() => null);
        console.debug(`${method} ${section} response`, res.status, respData);

        if (!res.ok) {
          // ✅ Log exact FastAPI validation errors
          console.error('Validation errors:', JSON.stringify(respData?.detail, null, 2));
          console.error(`Failed to update ${section}`, res.status, res.statusText, respData);
        } else {
          setProfileExists(true); // ✅ flip to true after first successful create
          setShowProfileUpdated(true);
          setTimeout(() => setShowProfileUpdated(false), POPUP_TIMEOUT);
        }
      } catch (e) {
        console.error(`Error updating ${section}`, e);
      }
    }
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddItem = (section, newItem) => {
    setProfile(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const getCleanResumeFileName = () => {
    if (!profile.resume) return '';
    const parts = profile.resume.split('_');
    if (parts.length > 1) {
      return parts.slice(1).join('_');
    }
    return profile.resume;
  };

  const handleRemoveItem = (section, index) => {
    setProfile(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleAddModalSubmit = (e) => {
    e?.preventDefault();
    setAddModalError("");

    if (addModalType === "skill") {
      const raw = String(addModalForm.skill ?? "").trim();
      if (!raw) {
        setAddModalError("Please enter a skill.");
        return;
      }
      const parts = raw
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      parts.forEach((p) => handleAddItem("skills", p));
      closeAddModal();
      return;
    }

    if (addModalType === "experience") {
      const title = String(addModalForm.title ?? "").trim();
      if (!title) {
        setAddModalError("Job title is required.");
        return;
      }
      handleAddItem("workExperience", {
        title,
        company: String(addModalForm.company ?? "").trim(),
        duration: String(addModalForm.duration ?? "").trim(),
        description: String(addModalForm.description ?? "").trim(),
      });
      closeAddModal();
      return;
    }

    if (addModalType === "education") {
      const degree = String(addModalForm.degree ?? "").trim();
      if (!degree) {
        setAddModalError("Degree is required.");
        return;
      }
      handleAddItem("education", {
        degree,
        institution: String(addModalForm.institution ?? "").trim(),
        year: String(addModalForm.year ?? "").trim(),
      });
      closeAddModal();
      return;
    }

    if (addModalType === "certification") {
      const certName = String(addModalForm.name ?? "").trim();
      if (!certName) {
        setAddModalError("Certification name is required.");
        return;
      }
      handleAddItem("certifications", {
        name: certName,
        issuer: String(addModalForm.issuer ?? "").trim(),
        year: String(addModalForm.year ?? "").trim(),
      });
      closeAddModal();
      return;
    }

    if (addModalType === "language") {
      const langName = String(addModalForm.name ?? "").trim();
      if (!langName) {
        setAddModalError("Language is required.");
        return;
      }
      handleAddItem("languages", {
        name: langName,
        proficiency: String(addModalForm.proficiency ?? "").trim(),
      });
      closeAddModal();
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExt = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExt.includes(fileExt)) {
      alert('Invalid file type. Allowed: PDF, DOC, DOCX');
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      return;
    }

    try {
      setIsUploadingResume(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('full_name', profile.name?.trim() || ' ');
      formData.append('email', profile.email?.trim() || ' ');
      formData.append('phone_number', profile.phone?.trim() || ' ');
      formData.append('location', profile.location || '');
      formData.append('linkedin', profile.linkedin || '');
      formData.append('github', profile.github || '');
      formData.append('about', profile.about || '');
      formData.append('skills', JSON.stringify(profile.skills || []));
      formData.append('certifications', JSON.stringify(profile.certifications || []));
      formData.append('languages', JSON.stringify(profile.languages || []));
      formData.append('experience', JSON.stringify(profile.workExperience || []));
      formData.append('education', JSON.stringify(profile.education || []));

      // ✅ POST for new candidates, PUT for existing ones
      const method = profileExists ? 'PUT' : 'POST';
      const url = profileExists ? UPDATE_CANDIDATE_PROFILE_API : CREATE_CANDIDATE_PROFILE_API;

      const res = await fetch(url, { method, headers, body: formData });
      const respData = await res.json().catch(() => null);
      console.debug('Resume upload response', res.status, respData);

      if (res.ok) {
        setProfileExists(true); // ✅ flip after first successful create
        await new Promise(resolve => setTimeout(resolve, 500));

        const fetchRes = await fetch(GET_CANDIDATE_PROFILE_API, {
          headers: { 'Content-Type': 'application/json', ...headers }
        });
        const fetchedData = await fetchRes.json().catch(() => null);

        if (fetchRes.ok && fetchedData) {
          const mappedData = mapBackendToFrontend(fetchedData);
          setProfile(mappedData);
        } else {
          setProfile(prev => ({ ...prev, resume: file.name }));
        }

        setShowProfileUpdated(true);
        setTimeout(() => setShowProfileUpdated(false), POPUP_TIMEOUT);
      } else {
        console.error('Validation errors:', JSON.stringify(respData?.detail, null, 2));
        const errorMsg = respData?.detail || 'Failed to upload resume. Please try again.';
        alert(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
    } catch (e) {
      console.error('Error uploading resume', e);
      alert('Error uploading resume: ' + e.message);
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  return (
    <>
      <MessagePopup show={showLoginSuccess} message="Sign in successful" type="success" />
      <MessagePopup show={showProfileUpdated} message="Profile updated" type="success" />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active="" type="candidate" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1">

            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 leading-none">My Profile</h1>
              </div>
              <p className="text-base text-gray-500 ml-[52px] -mt-1">
                Manage your profile information and professional details
              </p>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-4xl font-bold text-white">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    {isEditing.profile ? (
                      <div className="space-y-2">
                        <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Full name" />
                        <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Email address" />
                        <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Phone number" />
                        <input type="text" value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="LinkedIn URL" />
                        <input type="text" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="GitHub URL" />
                        <input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Location" />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{profile.name || "Not specified"}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {profile.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /><span>{profile.email}</span></div>}
                          {profile.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-500" /><span>{profile.phone}</span></div>}
                          {profile.linkedin && <div className="flex items-center gap-2"><LinkedinIcon className="w-4 h-4" /><span>{profile.linkedin}</span></div>}
                          {profile.github && <div className="flex items-center gap-2"><Github className="w-4 h-4 text-gray-700" /><span>{profile.github}</span></div>}
                          {profile.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-600" /><span>{profile.location}</span></div>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => toggleEdit('profile')} className={SECTION_ACTION_BTN}>
                  {isEditing.profile ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">About</h3>
                <button type="button" onClick={() => toggleEdit('about')} className={SECTION_ACTION_BTN}>
                  {isEditing.about ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditing.about ? (
                <textarea value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} className="w-full p-3 border rounded-lg" rows="4" placeholder="Add a description about yourself" />
              ) : (
                <p className="text-gray-700">{profile.about || <span className="text-gray-400 italic">No description added yet</span>}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Skills</h3>
                <button type="button" onClick={() => toggleEdit('skills')} className={SECTION_ACTION_BTN}>
                  {isEditing.skills ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      {skill}
                      {isEditing.skills && (
                        <button onClick={() => handleRemoveItem('skills', idx)} className="text-red-500 hover:text-red-700">×</button>
                      )}
                    </span>
                  ))
                ) : (
                  !isEditing.skills && <span className="text-gray-400 italic">No skills added yet</span>
                )}
                {isEditing.skills && (
                  <button type="button" onClick={() => openAddModal("skill")} className={ADD_PILL_BTN}>
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                <button type="button" onClick={() => toggleEdit('workExperience')} className={SECTION_ACTION_BTN}>
                  {isEditing.workExperience ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {profile.workExperience && profile.workExperience.length > 0 ? (
                  profile.workExperience.map((exp, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{exp.title}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                          <p className="text-gray-700 text-sm">{exp.description}</p>
                        </div>
                        {isEditing.workExperience && (
                          <button onClick={() => handleRemoveItem('workExperience', idx)} className="text-red-500 hover:text-red-700">Remove</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !isEditing.workExperience && <span className="text-gray-400 italic">No work experience added yet</span>
                )}
                {isEditing.workExperience && (
                  <button type="button" onClick={() => openAddModal("experience")} className={ADD_PILL_BTN}>
                    + Add Experience
                  </button>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                <button type="button" onClick={() => toggleEdit('education')} className={SECTION_ACTION_BTN}>
                  {isEditing.education ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                        {isEditing.education && (
                          <button onClick={() => handleRemoveItem('education', idx)} className="text-red-500 hover:text-red-700">Remove</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !isEditing.education && <span className="text-gray-400 italic">No education added yet</span>
                )}
                {isEditing.education && (
                  <button type="button" onClick={() => openAddModal("education")} className={ADD_PILL_BTN}>
                    + Add Education
                  </button>
                )}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                <button type="button" onClick={() => toggleEdit('certifications')} className={SECTION_ACTION_BTN}>
                  {isEditing.certifications ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {profile.certifications && profile.certifications.length > 0 ? (
                  profile.certifications.map((cert, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{cert.name}</h4>
                          <p className="text-blue-600 font-medium">{cert.issuer} • {cert.year}</p>
                        </div>
                        {isEditing.certifications && (
                          <button onClick={() => handleRemoveItem('certifications', idx)} className="text-red-500 hover:text-red-700">Remove</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !isEditing.certifications && <span className="text-gray-400 italic">No certifications added yet</span>
                )}
                {isEditing.certifications && (
                  <button type="button" onClick={() => openAddModal("certification")} className={ADD_PILL_BTN}>
                    + Add Certification
                  </button>
                )}
              </div>
            </div>

            {/* Languages Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Languages</h3>
                <button type="button" onClick={() => toggleEdit('languages')} className={SECTION_ACTION_BTN}>
                  {isEditing.languages ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {profile.languages && profile.languages.length > 0 ? (
                  profile.languages.map((lang, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{lang.name}</h4>
                          <p className="text-blue-600 font-medium">{lang.proficiency}</p>
                        </div>
                        {isEditing.languages && (
                          <button onClick={() => handleRemoveItem('languages', idx)} className="text-red-500 hover:text-red-700">Remove</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !isEditing.languages && <span className="text-gray-400 italic">No languages added yet</span>
                )}
                {isEditing.languages && (
                  <button type="button" onClick={() => openAddModal("language")} className={ADD_PILL_BTN}>
                    + Add Language
                  </button>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              {profile.resume ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-center justify-between gap-4">
                  {/* Left: icon + file info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-blue-600 mb-0.5">Current Resume</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getCleanResumeFileName()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">PDF document</span>
                      </div>
                    </div>
                  </div>
                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={downloadResume}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      View Resume
                    </button>
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={isUploadingResume}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-blue-300 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingResume ? 'Uploading...' : 'Replace Resume'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-4">No resume uploaded yet</p>
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isUploadingResume}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-4 h-4" />
                    {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
                  </button>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* Add item modals */}
      <InputPopup
        isOpen={Boolean(addModalType)}
        title={
          addModalType === "skill"
            ? "Add skill"
            : addModalType === "experience"
              ? "Add work experience"
              : addModalType === "education"
                ? "Add education"
                : addModalType === "certification"
                  ? "Add certification"
                  : addModalType === "language"
                    ? "Add language"
                    : ""
        }
        onClose={closeAddModal}
        onSubmit={handleAddModalSubmit}
        error={addModalError}
        submitLabel="Add"
      >

              {addModalType === "skill" && (
                <div>
                  <label htmlFor="add-skill" className="block text-sm font-medium text-gray-700 mb-1">
                    Skill
                  </label>
                  <input
                    id="add-skill"
                    type="text"
                    value={addModalForm.skill ?? ""}
                    onChange={(e) => setAddModalForm((prev) => ({ ...prev, skill: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. React, TypeScript"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple skills with a comma or |</p>
                </div>
              )}

              {addModalType === "experience" && (
                <>
                  <div>
                    <label htmlFor="add-exp-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="add-exp-title"
                      type="text"
                      value={addModalForm.title ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Software Engineer"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="add-exp-company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      id="add-exp-company"
                      type="text"
                      value={addModalForm.company ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, company: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-exp-duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      id="add-exp-duration"
                      type="text"
                      value={addModalForm.duration ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, duration: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Jan 2022 – Present"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-exp-desc" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="add-exp-desc"
                      rows={4}
                      value={addModalForm.description ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
                      placeholder="Briefly describe your role and achievements"
                    />
                  </div>
                </>
              )}

              {addModalType === "education" && (
                <>
                  <div>
                    <label htmlFor="add-edu-degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="add-edu-degree"
                      type="text"
                      value={addModalForm.degree ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, degree: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. BSc Computer Science"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="add-edu-inst" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      id="add-edu-inst"
                      type="text"
                      value={addModalForm.institution ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, institution: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. University name"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-edu-year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      id="add-edu-year"
                      type="text"
                      value={addModalForm.year ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, year: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 2024"
                    />
                  </div>
                </>
              )}

              {addModalType === "certification" && (
                <>
                  <div>
                    <label htmlFor="add-cert-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Certification name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="add-cert-name"
                      type="text"
                      value={addModalForm.name ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. AWS Solutions Architect"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="add-cert-issuer" className="block text-sm font-medium text-gray-700 mb-1">
                      Issuer
                    </label>
                    <input
                      id="add-cert-issuer"
                      type="text"
                      value={addModalForm.issuer ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, issuer: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-cert-year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      id="add-cert-year"
                      type="text"
                      value={addModalForm.year ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, year: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 2025"
                    />
                  </div>
                </>
              )}

              {addModalType === "language" && (
                <>
                  <div>
                    <label htmlFor="add-lang-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="add-lang-name"
                      type="text"
                      value={addModalForm.name ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. English"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="add-lang-prof" className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency
                    </label>
                    <input
                      id="add-lang-prof"
                      type="text"
                      value={addModalForm.proficiency ?? ""}
                      onChange={(e) => setAddModalForm((prev) => ({ ...prev, proficiency: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Native, Professional, Basic"
                    />
                  </div>
                </>
              )}

      </InputPopup>
    </>
  );
}