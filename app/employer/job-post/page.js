'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Briefcase, MapPin } from 'lucide-react';

export default function JobPostPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    requiredExperience: '',
    salaryRange: '',
    jobType: '',
    workMode: '',
    jobLocation: '',
    skills: [],
  });

  const [skillInput, setSkillInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API integration here
    console.log('Form Data:', formData);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Post Job" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Post a New Job</h1>
            </div>
            <p className="text-base text-gray-500 ml-[52px] -mt-1">
              Fill in the details below to create a new job posting and attract top talent
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-5xl">
            {/* Job Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Job Information</h2>
                <p className="text-base text-blue-600">
                  Provide the basic details about the job position
                </p>
              </div>

              {/* Job Title */}
              <div className="mb-6">
                <label htmlFor="jobTitle" className="block text-base font-medium text-gray-900 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label htmlFor="jobDescription" className="block text-base font-medium text-gray-900 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Required Experience and Salary Range */}
              <div className="grid grid-cols-2 gap-6 mb-0">
                <div>
                  <label htmlFor="requiredExperience" className="block text-base font-medium text-gray-900 mb-2">
                    Required Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="requiredExperience"
                    name="requiredExperience"
                    value={formData.requiredExperience}
                    onChange={handleInputChange}
                    placeholder="e.g. 3-5 years"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="salaryRange" className="block text-base font-medium text-gray-900 mb-2">
                    Salary Range (Optional)
                  </label>
                  <input
                    type="text"
                    id="salaryRange"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleInputChange}
                    placeholder="e.g. $100k - $140k"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Job Details</h2>
                <p className="text-base text-blue-600">
                  Specify the employment type and work arrangement
                </p>
              </div>

              {/* Job Type and Work Mode */}
              <div className="grid grid-cols-2 gap-6 mb-0">
                <div>
                  <label htmlFor="jobType" className="block text-base font-medium text-gray-900 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem',
                    }}
                  >
                    <option value="" disabled>
                      Select job type
                    </option>
                    <option value="full-time">Full time</option>
                    <option value="part-time">Part time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="workMode" className="block text-base font-medium text-gray-900 mb-2">
                    Work Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem',
                    }}
                  >
                    <option value="" disabled>
                      Select work mode
                    </option>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Job Location - Conditional */}
              {(formData.workMode === 'on-site' || formData.workMode === 'hybrid') && (
                <div className="mt-6">
                  <label htmlFor="jobLocation" className="block text-base font-medium text-gray-900 mb-2">
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="jobLocation"
                      name="jobLocation"
                      value={formData.jobLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, USA or Karachi, Pakistan"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Required Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Required Skills</h2>
                <p className="text-base text-blue-600">
                  Add the skills and technologies required for this position
                </p>
              </div>

              {/* Add Skills */}
              <div>
                <label htmlFor="skillInput" className="block text-base font-medium text-gray-900 mb-2">
                  Add Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="skillInput"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. React, Node.js, Python"
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-lg leading-none">+</span>
                    Add
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Press Enter or click Add to include a skill
                </p>

                {/* Skills Tags */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-base font-medium rounded-lg border border-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{ width: 'clamp(180px, 22%, 300px)' }}
              >
                <Briefcase className="w-4 h-4" />
                Post Job
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

