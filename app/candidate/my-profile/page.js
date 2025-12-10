"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Phone, Mail, MapPin, Github, User, FileText } from "lucide-react";

// Custom LinkedIn Icon
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2"/>
  </svg>
);

export default function CandidateDashboard() {
  const [isEditing, setIsEditing] = useState({});
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    about: "Passionate software engineer with 5+ years of experience in full-stack development and AI/ML. Specialized in building scalable web applications and implementing machine learning solutions.",
    skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning", "TensorFlow", "MongoDB"],
    certifications: [
      { name: "AWS Certified Solutions Architect", issuer: "Amazon", year: "2023" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2022" }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Professional" }
    ],
    workExperience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        duration: "2021 - Present",
        description: "Led development of AI-based recommendation system using Python and TensorFlow. Managed a team of 4 engineers."
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        description: "Developed full-stack web applications using React and Node.js. Implemented RESTful APIs and database solutions."
      }
    ],
    education: [
      {
        degree: "Master of Science in Computer Science",
        institution: "Stanford University",
        year: "2019"
      },
      {
        degree: "Bachelor of Science in Software Engineering",
        institution: "UC Berkeley",
        year: "2017"
      }
    ],
    resume: "resume.pdf"
  });

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
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{profile.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkedinIcon className="w-4 h-4" />
                      <span>{profile.linkedin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-700" />
                      <span>{profile.github}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleEdit('profile')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">About</h3>
              <button
                onClick={() => toggleEdit('about')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.about ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditing.about ? (
              <textarea
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                className="w-full p-3 border rounded-lg"
                rows="4"
              />
            ) : (
              <p className="text-gray-700">{profile.about}</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Skills</h3>
              <button
                onClick={() => toggleEdit('skills')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.skills ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {skill}
                  {isEditing.skills && (
                    <button
                      onClick={() => handleRemoveItem('skills', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing.skills && (
                <button
                  onClick={() => {
                    const newSkill = prompt('Enter new skill:');
                    if (newSkill) handleAddItem('skills', newSkill);
                  }}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200"
                >
                  + Add Skill
                </button>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
              <button
                onClick={() => toggleEdit('workExperience')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.workExperience ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.workExperience.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{exp.title}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                    {isEditing.workExperience && (
                      <button
                        onClick={() => handleRemoveItem('workExperience', idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing.workExperience && (
                <button
                  onClick={() => {
                    const newExp = {
                      title: prompt('Job Title:') || '',
                      company: prompt('Company:') || '',
                      duration: prompt('Duration:') || '',
                      description: prompt('Description:') || ''
                    };
                    if (newExp.title) handleAddItem('workExperience', newExp);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Experience
                </button>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Education</h3>
              <button
                onClick={() => toggleEdit('education')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.education ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                    {isEditing.education && (
                      <button
                        onClick={() => handleRemoveItem('education', idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing.education && (
                <button
                  onClick={() => {
                    const newEdu = {
                      degree: prompt('Degree:') || '',
                      institution: prompt('Institution:') || '',
                      year: prompt('Year:') || ''
                    };
                    if (newEdu.degree) handleAddItem('education', newEdu);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Education
                </button>
              )}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
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
                      <p className="text-blue-600 font-medium">{cert.issuer} • {cert.year}</p>
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
                    const newCert = {
                      name: prompt('Certification Name:') || '',
                      issuer: prompt('Issuer:') || '',
                      year: prompt('Year:') || ''
                    };
                    if (newCert.name) handleAddItem('certifications', newCert);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Certification
                </button>
              )}
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Languages</h3>
              <button
                onClick={() => toggleEdit('languages')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.languages ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.languages.map((lang, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{lang.name}</h4>
                      <p className="text-blue-600 font-medium">{lang.proficiency}</p>
                    </div>
                    {isEditing.languages && (
                      <button
                        onClick={() => handleRemoveItem('languages', idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing.languages && (
                <button
                  onClick={() => {
                    const newLang = {
                      name: prompt('Language:') || '',
                      proficiency: prompt('Proficiency (Native/Professional/Basic):') || ''
                    };
                    if (newLang.name) handleAddItem('languages', newLang);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Language
                </button>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
            <div className="bg-[#E6F0FF] border border-blue-200 rounded-xl p-8 text-center">
              {profile.resume ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">Current Resume</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 mb-4 text-sm">
                    {profile.resume}
                  </a>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                    Replace Resume
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 font-medium mb-4">No resume uploaded yet</p>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
