"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, MapPin, Briefcase, Calendar, DollarSign, Clock, Building2, CheckCircle } from "lucide-react";
import { useState } from "react";

// Dummy data for jobs (same structure as job-search page)
const JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$120k - $160k",
    level: "Senior",
    experience: "5+ years",
    tags: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    time: "2 days ago",
    postedDate: "Dec 6, 2025",
    description:
      "Join our fast-paced team to create beautiful and performant web interfaces. You'll use React, Tailwind CSS, and newest technologies to build scalable products, work closely with UI/UX, and deliver first-class user experiences.",
    responsibilities: [
      "Develop and maintain user-facing features using React.js",
      "Build reusable components and front-end libraries",
      "Collaborate with UI/UX designers to implement pixel-perfect designs",
      "Optimize applications for maximum speed and scalability",
      "Participate in code reviews and provide constructive feedback"
    ],
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong understanding of HTML5, CSS3, and responsive design",
      "Experience with state management libraries (Redux, MobX)",
      "Familiarity with RESTful APIs and modern authorization mechanisms",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Professional development budget",
      "Modern office with latest technology"
    ]
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "AI Innovations Inc",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    salary: "$140k - $180k",
    level: "Senior",
    experience: "5+ years",
    tags: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP"],
    time: "1 day ago",
    postedDate: "Dec 7, 2025",
    description:
      "Join our ML team to build state-of-the-art machine learning models. Work on NLP, computer vision, recommendation systems with cutting-edge technologies.",
    responsibilities: [
      "Design and implement machine learning models",
      "Optimize model performance and scalability",
      "Collaborate with data engineers and product teams",
      "Research and implement latest ML techniques",
      "Deploy models to production environments"
    ],
    requirements: [
      "5+ years of ML engineering experience",
      "Strong knowledge of Python and ML frameworks",
      "Experience with deep learning and neural networks",
      "Understanding of MLOps and model deployment",
      "PhD or Master's degree in CS, ML, or related field preferred"
    ],
    benefits: [
      "Top-tier compensation package",
      "Remote-first culture",
      "Conference and learning budget",
      "Cutting-edge technology stack",
      "Collaborative research environment"
    ]
  },
  {
    id: 3,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    jobType: "Full-time",
    workMode: "Hybrid",
    salary: "$130k - $170k",
    level: "Mid-Level",
    experience: "2-4 years",
    tags: ["Product Strategy", "Agile", "User Research", "Analytics"],
    time: "3 days ago",
    postedDate: "Dec 5, 2025",
    description:
      "Lead product development for our SaaS platform. Define product roadmap, work with cross-functional teams, and drive product strategy.",
    responsibilities: [
      "Define product vision and strategy",
      "Manage product roadmap and prioritization",
      "Conduct market research and competitive analysis",
      "Lead cross-functional product teams",
      "Monitor product metrics and KPIs"
    ],
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and strategic thinking skills",
      "Experience with product management tools",
      "Excellent communication skills",
      "Track record of successful product launches"
    ],
    benefits: [
      "Competitive salary and equity",
      "Hybrid work flexibility",
      "Professional development opportunities",
      "Health and wellness benefits",
      "Collaborative startup environment"
    ]
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "WebDev Agency",
    location: "Austin, TX",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$100k - $140k",
    level: "Mid-Level",
    experience: "2-4 years",
    tags: ["React", "Node.js", "MongoDB", "JavaScript", "REST API"],
    time: "5 days ago",
    postedDate: "Dec 3, 2025",
    description:
      "Build modern web applications using React, Node.js, and MongoDB. Work in a collaborative environment with designers and other developers.",
    responsibilities: [
      "Develop full-stack applications using React and Node.js",
      "Design and implement REST APIs",
      "Work with MongoDB databases",
      "Collaborate with design team",
      "Write clean, maintainable code"
    ],
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React and Node.js",
      "Experience with MongoDB or similar databases",
      "Understanding of REST API principles",
      "Good problem-solving skills"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Professional development",
      "Modern office space",
      "Team outings and events"
    ]
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    salary: "$130k - $170k",
    level: "Senior",
    experience: "5+ years",
    tags: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    time: "4 days ago",
    postedDate: "Dec 4, 2025",
    description:
      "Manage and optimize our cloud infrastructure. Implement CI/CD pipelines, monitor system performance, and ensure high availability.",
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage Kubernetes clusters",
      "Monitor system performance",
      "Automate infrastructure provisioning",
      "Implement security best practices"
    ],
    requirements: [
      "5+ years of DevOps experience",
      "Strong knowledge of Kubernetes and Docker",
      "Experience with AWS services",
      "Proficiency in Infrastructure as Code",
      "Understanding of security best practices"
    ],
    benefits: [
      "Fully remote position",
      "Top-tier compensation",
      "Learning and certification budget",
      "Latest tools and hardware",
      "Work-life balance focused"
    ]
  },
  {
    id: 6,
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$90k - $130k",
    level: "Mid-Level",
    experience: "2-4 years",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping", "User Testing"],
    time: "1 week ago",
    postedDate: "Dec 1, 2025",
    description:
      "Create beautiful and intuitive user interfaces for web/mobile applications. Proficiency in Figma valued. Collaborate with developers.",
    responsibilities: [
      "Create wireframes and prototypes",
      "Conduct user research and testing",
      "Design UI components and systems",
      "Collaborate with development team",
      "Present designs to stakeholders"
    ],
    requirements: [
      "3+ years of UI/UX design experience",
      "Expert proficiency in Figma",
      "Strong portfolio of design work",
      "Understanding of user-centered design",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Design conference budget",
      "Latest design tools",
      "Creative work environment"
    ]
  },
];

export default function CandidateViewJobPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = parseInt(searchParams.get("jobId"));
  const from = searchParams.get("from"); // 'recommendations', 'applications', or null (default to 'search')
  const matchScore = searchParams.get("matchScore");
  
  // Application modal states
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationStep, setApplicationStep] = useState('choice');
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [showApplicationNotification, setShowApplicationNotification] = useState(false);
  
  // Helper function to convert level to experience years
  const getLevelInYears = (level) => {
    const levelMap = {
      'Junior': '0-1 years',
      'Mid-Level': '2-4 years',
      'Senior': '5+ years'
    };
    return levelMap[level] || level;
  };
  
  const selectedJob = JOBS.find(job => job.id === jobId);
  
  // Determine active sidebar item based on where user came from
  const getActivePage = () => {
    if (from === 'recommendations') return 'Job Recommendations';
    if (from === 'applications') return 'Job Applications';
    if (from === 'saved') return 'Saved Jobs';
    return 'Search Job';
  };
  
  const handleApplyClick = () => {
    setIsApplicationModalOpen(true);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
  };

  const closeModal = () => {
    setIsApplicationModalOpen(false);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
  };

  const handleResumeChoice = (useCustom) => {
    setUseCustomResume(useCustom);
    if (useCustom) {
      setApplicationStep('upload');
    } else {
      setApplicationStep('confirm');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedResume(file);
      setApplicationStep('confirm');
    }
  };

  const handleSubmitApplication = () => {
    console.log('Submitting application:', {
      job: selectedJob,
      useCustomResume,
      resume: uploadedResume
    });
    
    // Close modal and reset
    setIsApplicationModalOpen(false);
    setApplicationStep('choice');
    setUseCustomResume(false);
    setUploadedResume(null);
    
    // Show success notification
    setShowApplicationNotification(true);
    setTimeout(() => setShowApplicationNotification(false), 3000);
  };

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active={getActivePage()} type="candidate" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1">
            <div className="text-center text-gray-500">Job not found</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active={getActivePage()} type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        
        {/* Application Submitted Notification */}
        {showApplicationNotification && (
          <div className="fixed top-0 left-0 right-0 md:ml-64 ml-20 flex justify-center pt-6 z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">Application Submitted Successfully</span>
            </div>
          </div>
        )}
        
        <main className="p-6 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Back Button */}
            <button 
              onClick={() => {
                if (from === 'recommendations') {
                  router.push("/candidate/job-recommendations");
                } else if (from === 'applications') {
                  router.push("/candidate/job-applications");
                } else if (from === 'saved') {
                  router.push("/candidate/saved-jobs");
                } else {
                  router.push("/candidate/job-search");
                }
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>
                {from === 'recommendations' ? 'Back to Job Recommendations' : 
                 from === 'applications' ? 'Back to Job Applications' : 
                 from === 'saved' ? 'Back to Saved Jobs' :
                 'Back to Job Search'}
              </span>
            </button>

            {/* Job Details Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedJob.title}</h1>
                  </div>
                  
                  {/* Match Score Badge (only shown when coming from recommendations) */}
                  {matchScore && (
                    <div className="ml-3 text-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200 shadow-sm shrink-0">
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Match</div>
                      <div className={`text-3xl font-bold ${
                        parseInt(matchScore) >= 90 ? 'text-green-600' : 
                        parseInt(matchScore) >= 80 ? 'text-blue-600' : 
                        parseInt(matchScore) >= 70 ? 'text-yellow-600' : 
                        'text-orange-600'
                      }`}>
                        {matchScore}%
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-lg font-semibold text-blue-600 mb-3 mt-1">{selectedJob.company}</p>
                <div className="flex flex-wrap gap-3 text-base text-gray-600">
                  {selectedJob.workMode !== 'Remote' && <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{selectedJob.location}</span>}
                  <span className="flex items-center gap-1"><Building2 className="w-5 h-5" />{selectedJob.workMode}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-5 h-5" />{selectedJob.jobType}</span>
                  {selectedJob.salary && <span className="flex items-center gap-1"><DollarSign className="w-5 h-5" />{selectedJob.salary}</span>}
                </div>
              </div>

              {/* Job Overview */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Key Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Posted Date</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedJob.postedDate}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Experience Required</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedJob.experience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.tags.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-600 text-base font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h2>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <span className="text-blue-600 text-lg shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <span className="text-blue-600 text-lg shrink-0">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h2>
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <span className="text-green-600 text-lg shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply Now Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button 
                  onClick={handleApplyClick}
                  className="px-6 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 text-base font-semibold rounded-lg transition-all">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Apply for Position</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Job Details Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedJob.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedJob.company}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedJob.location}
                  </span>
                  <span>•</span>
                  <span>{selectedJob.workMode}</span>
                  <span>•</span>
                  <span>{selectedJob.salary}</span>
                </div>
              </div>

              {/* Step 1: Resume Choice */}
              {applicationStep === 'choice' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Resume Option</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Would you like to use your default resume or upload a custom one for this application?
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Use Default Resume */}
                    <button
                      onClick={() => handleResumeChoice(false)}
                      className="w-full text-left p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Use Default Resume</h4>
                          <p className="text-sm text-gray-600">Apply with your profile resume (Quick Apply)</p>
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Upload Custom Resume */}
                    <button
                      onClick={() => handleResumeChoice(true)}
                      className="w-full text-left p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Upload Custom Resume</h4>
                          <p className="text-sm text-gray-600">Upload a tailored resume for this position</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Resume Upload */}
              {applicationStep === 'upload' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a PDF or Word document (Max 5MB)
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max. 5MB)</p>
                    </label>
                  </div>

                  <button
                    onClick={() => setApplicationStep('choice')}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to options
                  </button>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {applicationStep === 'confirm' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Review your application before submitting
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Resume Type</p>
                      <p className="font-medium text-gray-900">
                        {useCustomResume ? `Custom Resume: ${uploadedResume?.name}` : 'Default Profile Resume'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setApplicationStep('choice')}
                      className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

