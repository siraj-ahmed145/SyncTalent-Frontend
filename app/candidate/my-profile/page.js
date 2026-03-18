"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Popup, { POPUP_TIMEOUT } from "../../components/Popup";
import { Phone, Mail, MapPin, Github, User, FileText } from "lucide-react";
import { isUserLoggedIn } from "../../../utils/session";
import Loader from "../../../utils/loader";
import {
  GET_CANDIDATE_PROFILE_API,
  UPDATE_CANDIDATE_PROFILE_API,
  CREATE_CANDIDATE_PROFILE_API
} from '../../../routes/candidate/getCandidateProfile';

const cleanString = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/[{}"\\]/g, '')
    .replace(/[,\[\]]/g, '')
    .trim();
};

const ensureArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(item => cleanString(item)).filter(item => item && item.length > 0);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map(item => cleanString(item)).filter(item => item && item.length > 0);
      }
    } catch (e) {}
    const cleaned = cleanString(val);
    return cleaned ? [cleaned] : [];
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
      <Popup show={showLoginSuccess} message="Sign in successful" type="success" />
      <Popup show={showProfileUpdated} message="Profile updated" type="success" />
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
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-4xl font-bold text-white">
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
                <button onClick={() => toggleEdit('profile')} className="text-blue-600 hover:text-blue-700 font-medium">
                  {isEditing.profile ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">About</h3>
                <button onClick={() => toggleEdit('about')} className="text-blue-600 hover:text-blue-700 text-sm">
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
                <button onClick={() => toggleEdit('skills')} className="text-blue-600 hover:text-blue-700 text-sm">
                  {isEditing.skills ? 'Done' : 'Edit'}
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
                  <button onClick={() => { const s = prompt('Enter new skill:'); if (s) handleAddItem('skills', s); }} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                <button onClick={() => toggleEdit('workExperience')} className="text-blue-600 hover:text-blue-700 text-sm">
                  {isEditing.workExperience ? 'Done' : 'Edit'}
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
                  <button onClick={() => { const e = { title: prompt('Job Title:') || '', company: prompt('Company:') || '', duration: prompt('Duration:') || '', description: prompt('Description:') || '' }; if (e.title) handleAddItem('workExperience', e); }} className="text-blue-600 hover:text-blue-700 font-medium">
                    + Add Experience
                  </button>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                <button onClick={() => toggleEdit('education')} className="text-blue-600 hover:text-blue-700 text-sm">
                  {isEditing.education ? 'Done' : 'Edit'}
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
                  <button onClick={() => { const e = { degree: prompt('Degree:') || '', institution: prompt('Institution:') || '', year: prompt('Year:') || '' }; if (e.degree) handleAddItem('education', e); }} className="text-blue-600 hover:text-blue-700 font-medium">
                    + Add Education
                  </button>
                )}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                <button onClick={() => toggleEdit('certifications')} className="text-blue-600 hover:text-blue-700 text-sm">
                  {isEditing.certifications ? 'Done' : 'Edit'}
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
                  <button onClick={() => { const c = { name: prompt('Certification Name:') || '', issuer: prompt('Issuer:') || '', year: prompt('Year:') || '' }; if (c.name) handleAddItem('certifications', c); }} className="text-blue-600 hover:text-blue-700 font-medium">
                    + Add Certification
                  </button>
                )}
              </div>
            </div>

            {/* Languages Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Languages</h3>
                <button onClick={() => toggleEdit('languages')} className="text-blue-600 hover:text-blue-700 text-sm">
                  {isEditing.languages ? 'Done' : 'Edit'}
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
                  <button onClick={() => { const l = { name: prompt('Language:') || '', proficiency: prompt('Proficiency (Native/Professional/Basic):') || '' }; if (l.name) handleAddItem('languages', l); }} className="text-blue-600 hover:text-blue-700 font-medium">
                    + Add Language
                  </button>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              <div className="bg-[#E6F0FF] border border-blue-200 rounded-xl p-8 text-center">
                {profile.resume ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Current Resume</p>
                    <button onClick={downloadResume} className="text-blue-600 hover:text-blue-700 hover:underline mb-4 text-sm font-medium cursor-pointer">
                      {getCleanResumeFileName()}
                    </button>
                    <button onClick={() => resumeInputRef.current?.click()} disabled={isUploadingResume} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                      {isUploadingResume ? 'Uploading...' : 'Replace Resume'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-900 font-medium mb-4">No resume uploaded yet</p>
                    <button onClick={() => resumeInputRef.current?.click()} disabled={isUploadingResume} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                      {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}