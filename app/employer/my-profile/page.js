"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Phone, Mail, Globe, MapPin, Briefcase, Award, Users } from "lucide-react";
import { isEmployerLoggedIn } from "../../../utils/employerSession";
import Loader from "../../../utils/loader";
import Popup, { POPUP_TIMEOUT } from "../../components/Popup";

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

export default function EmployerProfile() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const [profile, setProfile] = useState({
    companyName: "Tech Innovations Inc.",
    logo: "tech-logo.png",
    website: "www.techinnovations.com",
    email: "hr@techinnovations.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    description: "Leading technology company specializing in AI-driven solutions and enterprise software. We empower businesses with cutting-edge technology and innovative solutions.",
    
    // HR Contact Information
    hrContactName: "Sarah Mitchell",
    hrJobTitle: "Head of Human Resources",
    hrPhone: "+1 (555) 123-4567",
    hrEmail: "sarah@techinnovations.com",
    hrLinkedIn: "linkedin.com/in/sarahmitchell",
    
    // Company Details
    industry: "Technology & Software",
    companySize: "251-500",
    foundedYear: "2010",
    headquarters: "San Francisco, CA",
    
    // Certifications and Awards
    certifications: [
      { name: "ISO 27001 Information Security Management", year: "2023" },
      { name: "SOC 2 Type II Compliance", year: "2023" },
      { name: "Great Place to Work Certification", year: "2022" }
    ],
    
    // Social Links
    twitter: "twitter.com/techinnovations",
    github: "github.com/techinnovations"
  });

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
    if (!showLoginSuccess) return;
    const t = setTimeout(() => setShowLoginSuccess(false), POPUP_TIMEOUT);
    return () => clearTimeout(t);
  }, [showLoginSuccess]);

  if (!authChecked) {
    return <Loader text="Verifying access..." />;
  }

  const toggleEdit = (section) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
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

  return (
    <>
      <Popup show={showLoginSuccess} message="Sign in successful" type="success" />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active="" type="employer" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
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
                  {profile.companyName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{profile.companyName}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>{profile.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EmailIcon className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleEdit('company')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Company Info
              </button>
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">About Company</h3>
              <button
                onClick={() => toggleEdit('description')}
                className="text-blue-600 hover:text-blue-700 text-sm"
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
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {isEditing.details ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Industry</p>
                  {isEditing.details ? (
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.industry}</p>
                  )}
                </div>
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
                  className="text-blue-600 hover:text-blue-700 text-sm"
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
                  <p className="text-gray-600 text-sm font-medium">Job Title</p>
                  {isEditing.hrContact ? (
                    <input
                      type="text"
                      value={profile.hrJobTitle}
                      onChange={(e) => setProfile({ ...profile, hrJobTitle: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.hrJobTitle}</p>
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
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.certifications ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{cert.name}</h4>
                      <p className="text-blue-600 font-medium">Awarded in {cert.year}</p>
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
                  onClick={() => {
                    const certName = prompt('Certification/Award Name:');
                    if (certName) {
                      const certYear = prompt('Year Awarded:') || new Date().getFullYear();
                      handleAddItem('certifications', { name: certName, year: certYear });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Certification
                </button>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Social & Web Presence</h3>
              <button
                onClick={() => toggleEdit('social')}
                className="text-blue-600 hover:text-blue-700 text-sm"
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
                    value={profile.hrLinkedIn}
                    onChange={(e) => setProfile({ ...profile, hrLinkedIn: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="linkedin.com/company/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4" />
                    {profile.hrLinkedIn}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Twitter/X</label>
                {isEditing.social ? (
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="twitter.com/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.twitter}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">GitHub</label>
                {isEditing.social ? (
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="github.com/..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.github}</p>
                )}
              </div>
            </div>
          </div>


            </div>
          </section>
        </main>
        </div>
      </div>
    </>
  );
}
