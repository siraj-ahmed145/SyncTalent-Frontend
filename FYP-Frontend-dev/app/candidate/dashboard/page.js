"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function CandidateDashboard() {
  const [isEditing, setIsEditing] = useState({});
  const [profile, setProfile] = useState({
    name: "John Doe",
    title: "Senior Software Engineer",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
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
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-gray-600">{profile.title}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{profile.email}</span>
                    <span>{profile.phone}</span>
                    <span>{profile.location}</span>
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
              <h3 className="text-lg font-bold">Work Experience</h3>
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
              <h3 className="text-lg font-bold">Education</h3>
              <button
                onClick={() => toggleEdit('education')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.education ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
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
              <h3 className="text-lg font-bold">Certifications</h3>
              <button
                onClick={() => toggleEdit('certifications')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.certifications ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-3">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
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
              <h3 className="text-lg font-bold">Languages</h3>
              <button
                onClick={() => toggleEdit('languages')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isEditing.languages ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-2">
              {profile.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-sm text-gray-500">({lang.proficiency})</span>
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
            <h3 className="text-lg font-bold mb-4">Resume</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {profile.resume ? (
                <div>
                  <p className="text-gray-700 mb-2">Current Resume: {profile.resume}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Replace Resume
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">No resume uploaded yet</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
