'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { FileText, MapPin, ArrowLeft } from 'lucide-react';
import MessagePopup, { POPUP_TIMEOUT } from '../../components/MessagePopup';
import Loader from '../../../utils/loader';
import { GET_JOBS_API } from '../../../routes/employer/getJobs';
import { UPDATE_JOB_API } from '../../../routes/employer/updateJob';

function EditJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = parseInt(searchParams.get("jobId"));

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

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const resp = await fetch(GET_JOBS_API, { method: 'GET', headers });
        const data = await resp.json();

        if (!resp.ok) {
          setError(data?.message || data?.detail || 'Failed to fetch jobs');
          setJob(null);
          return;
        }

        let jobs = [];
        if (Array.isArray(data)) {
          jobs = data;
        } else if (data.jobs && Array.isArray(data.jobs)) {
          jobs = data.jobs;
        } else if (data.data && Array.isArray(data.data)) {
          jobs = data.data;
        }

        const found = jobs.find(j => j.id === jobId || j.job_id === jobId);
        if (found) {
          setJob(found);
          setFormData({
            jobTitle: found.title ?? found.jobTitle ?? '',
            jobDescription: found.description ?? found.jobDescription ?? '',
            requiredExperience: found.level ?? found.requiredExperience ?? '',
            salaryRange: found.salary ?? found.salaryRange ?? '',
            jobType: (found.jobType ?? found.job_type ?? '').toLowerCase(),
            workMode: (found.workMode ?? found.work_mode ?? '').toLowerCase(),
            jobLocation: found.location ?? found.jobLocation ?? '',
            skills: found.skills ?? [],
            responsibilities: found.responsibilities ?? found.keyResponsibilities ?? [],
            requirements: found.requirements ?? [],
            benefits: found.benefits ?? [],
          });
        } else {
          setError('Job not found');
          setJob(null);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load job');
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) loadJob();
  }, [jobId]);

  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
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

  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
        <Sidebar active="Dashboard" type="employer" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1">
            <div className="text-center text-red-500">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((_, index) => index !== indexToRemove) }));
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() !== '') {
      setFormData((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, responsibilityInput.trim()] }));
      setResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, responsibilities: prev.responsibilities.filter((_, index) => index !== indexToRemove) }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim() !== '') {
      setFormData((prev) => ({ ...prev, requirements: [...prev.requirements, requirementInput.trim()] }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, requirements: prev.requirements.filter((_, index) => index !== indexToRemove) }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() !== '') {
      setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, benefitInput.trim()] }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, benefits: prev.benefits.filter((_, index) => index !== indexToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const jobTypeMap = { 'full-time': 'Full-time', 'part-time': 'Part-time', 'contract': 'Contract' };
      const workModeMap = { 'on-site': 'On-site', 'remote': 'Remote', 'hybrid': 'Hybrid' };

      const { jobTitle, jobDescription, responsibilities, requirements, benefits, requiredExperience, salaryRange, jobType, workMode, jobLocation, skills } = formData;

      const apiBody = {
        jobTitle,
        jobDescription,
        keyResponsibilities: responsibilities,
        requirements,
        benefits,
        requiredExperience,
        salaryRange: salaryRange || '',
        jobType: jobTypeMap[jobType] || jobType,
        workMode: workModeMap[workMode] || workMode,
        jobLocation,
        skills,
      };

      const resp = await fetch(`${UPDATE_JOB_API}/${jobId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(apiBody),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.message || data?.detail || 'Failed to update job');
      } else {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          router.push(`/employer/view-job-post?jobId=${jobId}`);
        }, POPUP_TIMEOUT);
      }
    } catch (err) {
      setError(err?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } };
  const handleResponsibilityKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddResponsibility(); } };
  const handleRequirementKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequirement(); } };
  const handleBenefitKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f1729] transition-colors">
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />

        <MessagePopup show={showSuccessMessage} message="Job Post updated successfully" type="success" />

        <main className="p-6 md:p-10 flex-1 flex justify-center">
          <div className="w-full max-w-5xl">
            <button
              onClick={() => router.push(`/employer/view-job-post?jobId=${jobId}`)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Job Post</span>
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 leading-none -mt-1">Edit Job Post</h1>
              </div>
              <p className="text-base text-gray-500 dark:text-gray-400 ml-[52px] -mt-1">
                Update the details of your job post
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-[#1a2332] rounded-xl shadow-sm dark:shadow-gray-900/25 border border-gray-200 dark:border-gray-700 p-8 mb-8">

                {/* Job Title */}
                <div className="mb-6">
                  <label htmlFor="jobTitle" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label htmlFor="jobDescription" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleInputChange}
                    rows={5} placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Key Responsibilities */}
                <div className="mb-6">
                  <label htmlFor="responsibilityInput" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text" id="responsibilityInput" value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)} onKeyDown={handleResponsibilityKeyDown}
                      placeholder="e.g. Develop and maintain user-facing features"
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={handleAddResponsibility} className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <span className="text-lg leading-none">+</span> Add
                    </button>
                  </div>
                  {formData.responsibilities.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 text-base rounded-lg border border-blue-200">
                          <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                          <span className="flex-1">{resp}</span>
                          <button type="button" onClick={() => handleRemoveResponsibility(index)} className="text-blue-500 hover:text-blue-700 transition-colors text-xl leading-none shrink-0">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <label htmlFor="requirementInput" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Requirements <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text" id="requirementInput" value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)} onKeyDown={handleRequirementKeyDown}
                      placeholder="e.g. 5+ years of experience with React"
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={handleAddRequirement} className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <span className="text-lg leading-none">+</span> Add
                    </button>
                  </div>
                  {formData.requirements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 text-base rounded-lg border border-blue-200">
                          <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                          <span className="flex-1">{req}</span>
                          <button type="button" onClick={() => handleRemoveRequirement(index)} className="text-blue-500 hover:text-blue-700 transition-colors text-xl leading-none shrink-0">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label htmlFor="skillInput" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Add Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text" id="skillInput" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="e.g. React, Node.js, Python"
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={handleAddSkill} className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <span className="text-lg leading-none">+</span> Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-base font-medium rounded-lg border border-blue-200">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(index)} className="text-blue-500 hover:text-blue-700 transition-colors">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <label htmlFor="benefitInput" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text" id="benefitInput" value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)} onKeyDown={handleBenefitKeyDown}
                      placeholder="e.g. Health insurance coverage"
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={handleAddBenefit} className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <span className="text-lg leading-none">+</span> Add
                    </button>
                  </div>
                  {formData.benefits.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 px-4 py-2.5 bg-green-50 text-green-700 text-base rounded-lg border border-green-200">
                          <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                          <span className="flex-1">{benefit}</span>
                          <button type="button" onClick={() => handleRemoveBenefit(index)} className="text-green-500 hover:text-green-700 transition-colors text-xl leading-none shrink-0">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience & Salary */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="requiredExperience" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Required Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" id="requiredExperience" name="requiredExperience" value={formData.requiredExperience} onChange={handleInputChange}
                      placeholder="e.g. 3-5 years"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="salaryRange" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Salary Range (Optional)
                    </label>
                    <input
                      type="text" id="salaryRange" name="salaryRange" value={formData.salaryRange} onChange={handleInputChange}
                      placeholder="e.g. $100k - $140k"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Location, Job Type, Work Mode */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="jobLocation" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Job Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text" id="jobLocation" name="jobLocation" value={formData.jobLocation} onChange={handleInputChange}
                        placeholder="e.g. San Francisco, USA"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="jobType" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="jobType" name="jobType" value={formData.jobType} onChange={handleInputChange}
                        className="w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select job type</option>
                        <option value="full-time">Full time</option>
                        <option value="part-time">Part time</option>
                        <option value="contract">Contract</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="workMode" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Work Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="workMode" name="workMode" value={formData.workMode} onChange={handleInputChange}
                        className="w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-[#141d2e] border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select work mode</option>
                        <option value="on-site">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ width: 'clamp(250px, 30%, 350px)' }}
                >
                  <FileText className="w-4 h-4" />
                  Update Job Post
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Default export wraps the page in Suspense to satisfy Next.js
// useSearchParams() requires a Suspense boundary for static prerendering
export default function EditJobPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1729]">
        <Loader />
      </div>
    }>
      <EditJobPage />
    </Suspense>
  );
}