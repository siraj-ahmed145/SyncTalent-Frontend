"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Phone, Globe, MapPin, Users, Facebook, Instagram } from "lucide-react";
import { isEmployerLoggedIn } from "../../../utils/employerSession";
import Loader from "../../../utils/loader";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";
import InputPopup from "../../components/InputPopup";
import {
  GET_EMPLOYER_PROFILE_API,
  CREATE_EMPLOYER_PROFILE_API,
  UPDATE_EMPLOYER_PROFILE_API,
} from "../../../routes/employer/employerProfile";

// Custom LinkedIn Icon
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2"/>
  </svg>
);

// Custom Email Icon
const EmailIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#4F46E5" stroke="#4F46E5" strokeWidth="2"/>
    <path d="M2 4L12 12L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SECTION_ACTION_BTN =
  "text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors shrink-0";

const ADD_PILL_BTN =
  "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 hover:border-blue-300 hover:text-blue-800 active:bg-blue-300 transition-all shadow-sm";

export default function EmployerProfile() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showProfileUpdated, setShowProfileUpdated] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const [addCertModalOpen, setAddCertModalOpen] = useState(false);
  const [addCertForm, setAddCertForm] = useState({ name: "", year: "" });
  const [addCertError, setAddCertError] = useState("");
  const [profile, setProfile] = useState({
    companyName: "",
    logo: "",
    website: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    
    // HR Contact Information
    hrContactName: "",
    hrJobTitle: "",
    hrPhone: "",
    hrEmail: "",
    hrLinkedIn: "",
    
    // Company Details
    industry: "",
    companySize: "",
    foundedYear: "",
    headquarters: "",
    
    // Certifications and Awards
    certifications: [],
    
    // Social Links
    linkedin: "",
    facebook: "",
    instagram: "",
  });

  const mapBackendToFrontend = (backendData) => {
    if (!backendData) return null;
    return {
      companyName: backendData.company_name || "",
      email: backendData.email || "",
      phone: backendData.phone_number || "",
      location: backendData.location || "",
      website: backendData.website || "",
      logo: backendData.logo || "",
      description: backendData.description || "",

      hrContactName: backendData.hr_contact_name || "",
      hrJobTitle: backendData.hr_job_title || "",
      hrPhone: backendData.hr_phone || "",
      hrEmail: backendData.hr_email || "",
      hrLinkedIn: backendData.hr_linkedin || "",

      industry: backendData.industry || "",
      companySize: backendData.company_size || "",
      foundedYear:
        backendData.founded_year === null || backendData.founded_year === undefined
          ? ""
          : String(backendData.founded_year),
      headquarters: backendData.headquarters || "",

      certifications: Array.isArray(backendData.certifications) ? backendData.certifications : [],

      linkedin: backendData.linkedin || "",
      // Keep backend compatibility by mapping existing keys.
      facebook: backendData.twitter || "",
      instagram: backendData.github || "",
    };
  };

  const mapFrontendToBackend = (frontendProfile) => {
    const foundedYearNum =
      frontendProfile.foundedYear === "" || frontendProfile.foundedYear === null || frontendProfile.foundedYear === undefined
        ? null
        : Number(frontendProfile.foundedYear);

    const payload = {
      // required (validated before save)
      company_name: String(frontendProfile.companyName ?? "").trim(),
      email: String(frontendProfile.email ?? "").trim(),
      phone_number: String(frontendProfile.phone ?? "").trim(),

      // optional strings (omit if empty)
      location: String(frontendProfile.location ?? "").trim() || undefined,
      website: String(frontendProfile.website ?? "").trim() || undefined,
      logo: frontendProfile.logo || undefined,
      description: frontendProfile.description || undefined,

      hr_contact_name: String(frontendProfile.hrContactName ?? "").trim() || undefined,
      hr_job_title: String(frontendProfile.hrJobTitle ?? "").trim() || undefined,
      hr_phone: String(frontendProfile.hrPhone ?? "").trim() || undefined,
      hr_email: String(frontendProfile.hrEmail ?? "").trim() || undefined,
      hr_linkedin: String(frontendProfile.hrLinkedIn ?? "").trim() || undefined,

      industry: String(frontendProfile.industry ?? "").trim() || undefined,
      company_size: String(frontendProfile.companySize ?? "").trim() || undefined,
      founded_year: Number.isFinite(foundedYearNum) ? foundedYearNum : undefined,
      headquarters: String(frontendProfile.headquarters ?? "").trim() || undefined,

      linkedin: String(frontendProfile.linkedin ?? "").trim() || undefined,
      // Persist facebook/instagram into backend-supported fields.
      twitter: String(frontendProfile.facebook ?? "").trim() || undefined,
      github: String(frontendProfile.instagram ?? "").trim() || undefined,

      certifications: Array.isArray(frontendProfile.certifications) ? frontendProfile.certifications : [],
    };

    // Remove undefined keys so backend sees a clean JSON payload
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
    return payload;
  };

  const getAuthHeaders = (includeJson = false) => {
    const headers = {};
    if (includeJson) headers["Content-Type"] = "application/json";
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isEmployerLoggedIn()) {
      router.push("/employer/login");
      return;
    }
    setAuthChecked(true);
    if (localStorage.getItem("login_success_employer") === "1") {
      localStorage.removeItem("login_success_employer");
      setShowLoginSuccess(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(GET_EMPLOYER_PROFILE_API, {
          headers: getAuthHeaders(true),
        });
        const data = await res.json().catch(() => null);
        console.debug("GET employer profile response", res.status, data);

        if (res.ok && data) {
          const mapped = mapBackendToFrontend(data);
          if (mapped) {
            setProfile(mapped);
            setProfileExists(true);
          }
        }
        // 404: profile not created yet -> profileExists stays false
      } catch (e) {
        console.error("Could not load employer profile", e);
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

  const saveProfile = async () => {
    try {
      const companyName = String(profile.companyName ?? "").trim();
      const email = String(profile.email ?? "").trim();
      const phone = String(profile.phone ?? "").trim();

      if (!companyName || !email || !phone) {
        alert("Please fill Company Name, Email, and Phone before saving.");
        return false;
      }

      const method = profileExists ? "PUT" : "POST";
      const url = profileExists ? UPDATE_EMPLOYER_PROFILE_API : CREATE_EMPLOYER_PROFILE_API;

      const payload = mapFrontendToBackend(profile);
      console.debug("Saving employer profile payload", payload);
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const raw = await res.text().catch(() => "");
      const data = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
      console.debug(`${method} employer profile response`, res.status, data);

      if (!res.ok) {
        console.error("Failed to save employer profile", res.status, data);
        return false;
      }

      const mapped = mapBackendToFrontend(data);
      if (mapped) setProfile(mapped);
      setProfileExists(true);
      setShowProfileUpdated(true);
      setTimeout(() => setShowProfileUpdated(false), POPUP_TIMEOUT);
      return true;
    } catch (e) {
      console.error("Error saving employer profile", e);
      return false;
    }
  };

  const toggleEdit = async (section) => {
    if (isEditing[section]) {
      await saveProfile();
    }
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddItem = (section, newItem) => {
    setProfile(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setProfile(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const openAddCertModal = () => {
    setAddCertForm({ name: "", year: "" });
    setAddCertError("");
    setAddCertModalOpen(true);
  };

  const closeAddCertModal = () => {
    setAddCertModalOpen(false);
    setAddCertError("");
  };

  const handleAddCertSubmit = (e) => {
    e.preventDefault();
    const name = String(addCertForm.name ?? "").trim();
    const year = String(addCertForm.year ?? "").trim();
    if (!name) {
      setAddCertError("Certification name is required.");
      return;
    }
    handleAddItem("certifications", { name, year });
    closeAddCertModal();
  };

  return (
    <>
      <MessagePopup show={showLoginSuccess} message="Sign in successful" type="success" />
      <MessagePopup show={showProfileUpdated} message="Profile updated" type="success" />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active="" type="employer" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="w-full">
              {/* Page Header */}
              <div className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Company Profile</h1>
                </div>
                <p className="text-base text-gray-500 ml-[52px] -mt-1">
                  Manage your company information and professional details
                </p>
              </div>

              {/* Profile Sections */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-4xl font-bold text-white">
                  {(profile.companyName || "?").charAt(0)}
                </div>
                <div>
                  {isEditing.company ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                      <input
                        type="text"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Website"
                      />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {profile.companyName || "Not specified"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {profile.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span>{profile.website}</span>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile.email && (
                          <div className="flex items-center gap-2">
                            <EmailIcon className="w-4 h-4" />
                            <span>{profile.email}</span>
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleEdit('company')}
                className={SECTION_ACTION_BTN}
              >
                {isEditing.company ? "Save" : "Edit"}
              </button>
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">About Company</h3>
              <button
                onClick={() => toggleEdit('description')}
                className={SECTION_ACTION_BTN}
              >
                {isEditing.description ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditing.description ? (
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile.description}</p>
            )}
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Company Information */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Company Details</h3>
                <button
                  onClick={() => toggleEdit('details')}
                  className={SECTION_ACTION_BTN}
                >
                  {isEditing.details ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Company Size</p>
                  {isEditing.details ? (
                    <input
                      type="text"
                      value={profile.companySize}
                      onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.companySize} employees</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Founded</p>
                  {isEditing.details ? (
                    <input
                      type="text"
                      value={profile.foundedYear}
                      onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.foundedYear}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Headquarters</p>
                  {isEditing.details ? (
                    <input
                      type="text"
                      value={profile.headquarters}
                      onChange={(e) => setProfile({ ...profile, headquarters: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.headquarters}</p>
                  )}
                </div>
              </div>
            </div>

            {/* HR Contact Information */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">HR Contact</h3>
                <button
                  onClick={() => toggleEdit('hrContact')}
                  className={SECTION_ACTION_BTN}
                >
                  {isEditing.hrContact ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Contact Name</p>
                  {isEditing.hrContact ? (
                    <input
                      type="text"
                      value={profile.hrContactName}
                      onChange={(e) => setProfile({ ...profile, hrContactName: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.hrContactName}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Email</p>
                  {isEditing.hrContact ? (
                    <input
                      type="email"
                      value={profile.hrEmail}
                      onChange={(e) => setProfile({ ...profile, hrEmail: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.hrEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Certifications & Awards</h3>
              <button
                onClick={() => toggleEdit('certifications')}
                className={SECTION_ACTION_BTN}
              >
                {isEditing.certifications ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-900">{cert?.name}</h4>
                        {"year" in (cert || {}) && (
                          <p className="text-blue-600 font-medium">Awarded in {cert?.year}</p>
                        )}
                    </div>
                    {isEditing.certifications && (
                      <button
                        onClick={() => handleRemoveItem('certifications', idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing.certifications && (
                <button
                  onClick={openAddCertModal}
                  className={ADD_PILL_BTN}
                >
                  + Add Certification
                </button>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Social Presence</h3>
              <button
                onClick={() => toggleEdit('social')}
                className={SECTION_ACTION_BTN}
              >
                {isEditing.social ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">LinkedIn</label>
                {isEditing.social ? (
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="linkedin.com/company/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4" />
                    {profile.linkedin || "Not added"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Facebook</label>
                {isEditing.social ? (
                  <input
                    type="text"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="facebook.com/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    {profile.facebook || "Not added"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Instagram</label>
                {isEditing.social ? (
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="instagram.com/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    {profile.instagram || "Not added"}
                  </p>
                )}
              </div>
            </div>
          </div>
            </div>
          </section>
        </main>
        </div>
      </div>
      <InputPopup
        isOpen={addCertModalOpen}
        title="Add Certification"
        onClose={closeAddCertModal}
        onSubmit={handleAddCertSubmit}
        error={addCertError}
        submitLabel="Add"
      >
        <div>
          <label htmlFor="add-cert-name" className="block text-sm font-medium text-gray-700 mb-1">
            Certification name <span className="text-red-500">*</span>
          </label>
          <input
            id="add-cert-name"
            type="text"
            value={addCertForm.name}
            onChange={(e) => setAddCertForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. ISO 27001"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="add-cert-year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            id="add-cert-year"
            type="text"
            value={addCertForm.year}
            onChange={(e) => setAddCertForm((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 2026"
          />
        </div>
      </InputPopup>
    </>
  );
}
