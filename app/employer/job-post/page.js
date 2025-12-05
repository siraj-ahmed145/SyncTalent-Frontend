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
    responsibilities: [],
    requirements: [],
    benefits: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

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

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
      }));
      setResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, index) => index !== indexToRemove),
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

  const handleResponsibilityKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddResponsibility();
    }
  };

  const handleRequirementKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const handleBenefitKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBenefit();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Post Job" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1 flex justify-center">
          <div className="w-full max-w-5xl">
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
            <form onSubmit={handleSubmit}>
              {/* Single Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
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

                {/* Key Responsibilities */}
                <div className="mb-6">
                  <label htmlFor="responsibilityInput" className="block text-base font-medium text-gray-900 mb-2">
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="responsibilityInput"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={handleResponsibilityKeyDown}
                      placeholder="e.g. Develop and maintain user-facing features"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add
                    </button>
                  </div>

                  {/* Responsibilities List */}
                  {formData.responsibilities.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.responsibilities.map((resp, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 text-base rounded-lg border border-blue-200"
                        >
                          <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                          <span className="flex-1">{resp}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveResponsibility(index)}
                            className="text-blue-500 hover:text-blue-700 transition-colors text-xl leading-none shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <label htmlFor="requirementInput" className="block text-base font-medium text-gray-900 mb-2">
                    Requirements <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="requirementInput"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={handleRequirementKeyDown}
                      placeholder="e.g. 5+ years of experience with React"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add
                    </button>
                  </div>

                  {/* Requirements List */}
                  {formData.requirements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 text-base rounded-lg border border-blue-200"
                        >
                          <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                          <span className="flex-1">{req}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRequirement(index)}
                            className="text-blue-500 hover:text-blue-700 transition-colors text-xl leading-none shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <label htmlFor="benefitInput" className="block text-base font-medium text-gray-900 mb-2">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="benefitInput"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={handleBenefitKeyDown}
                      placeholder="e.g. Health insurance coverage"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add
                    </button>
                  </div>

                  {/* Benefits List */}
                  {formData.benefits.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 px-4 py-2.5 bg-green-50 text-green-700 text-base rounded-lg border border-green-200"
                        >
                          <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                          <span className="flex-1">{benefit}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            className="text-green-500 hover:text-green-700 transition-colors text-xl leading-none shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Required Experience and Salary Range */}
                <div className="grid grid-cols-2 gap-6 mb-6">
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

                {/* Job Location, Job Type, Work Mode */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
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
                        placeholder="e.g. San Francisco, USA"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
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

                {/* Add Skills */}
                <div className="mb-0">
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
          </div>
        </main>
      </div>
    </div>
  );
}