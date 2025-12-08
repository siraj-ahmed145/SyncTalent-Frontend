'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { FileText, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

// Dummy data for jobs (same as in dashboard/view-job)
const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Lahore, Pakistan",
    workMode: "On-site",
    jobType: "Full-time",
    level: "Senior",
    skills: ["React", "Javascript", "Tailwind CSS"],
    applications: 14,
    time: "2 days ago",
    status: "Active",
    salary: "$80k - $120k",
    postedDate: "Nov 27, 2025",
    description: "Join our fast-paced team to create beautiful and performant web interfaces. You'll use React, Tailwind CSS, and newest technologies to build scalable products, work closely with UI/UX, and deliver first-class user experiences.",
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
    title: "Backend Engineer",
    location: "Remote",
    workMode: "Remote",
    jobType: "Part-time",
    level: "Junior",
    skills: ["Node.js", "Express", "MongoDB"],
    applications: 8,
    time: "4 days ago",
    status: "Active",
    salary: "$50k - $70k",
    postedDate: "Nov 25, 2025",
    description: "We are seeking a backend engineer to design RESTful APIs and maintain resilient server-side infrastructure. Responsibilities include database management, system integration, and enhancing real-time features of our product stack.",
    responsibilities: [
      "Design and implement RESTful APIs using Node.js and Express",
      "Manage MongoDB databases and optimize queries",
      "Integrate third-party services and APIs",
      "Write clean, maintainable, and well-documented code",
      "Collaborate with frontend developers on API design"
    ],
    requirements: [
      "2+ years of experience with Node.js and Express",
      "Strong knowledge of MongoDB and database design",
      "Understanding of RESTful API principles",
      "Experience with version control (Git)",
      "Good problem-solving and communication skills"
    ],
    benefits: [
      "Fully remote position",
      "Flexible part-time hours (20-30 hours/week)",
      "Opportunity to work with modern tech stack",
      "Collaborative team environment",
      "Growth opportunities"
    ]
  },
  {
    id: 3,
    title: "Full Stack Developer",
    location: "Karachi, Pakistan",
    workMode: "Hybrid",
    jobType: "Contract",
    level: "Junior",
    skills: ["React", "Node.js", "AWS"],
    applications: 21,
    time: "1 week ago",
    status: "Closed",
    salary: "$60k - $90k",
    postedDate: "Nov 22, 2025",
    description: "Take ownership of projects from frontend through backend deployment. You'll architect solutions, code both client/server, automate deployments on AWS, and collaborate across disciplines to launch new features.",
    responsibilities: [
      "Develop full-stack applications using React and Node.js",
      "Deploy and manage applications on AWS infrastructure",
      "Design database schemas and implement data models",
      "Write unit and integration tests",
      "Participate in agile development processes"
    ],
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React, Node.js, and AWS services",
      "Experience with CI/CD pipelines",
      "Knowledge of containerization (Docker)",
      "Strong understanding of software design patterns"
    ],
    benefits: [
      "6-month contract with extension possibility",
      "Hybrid work model (3 days office, 2 days remote)",
      "Access to modern development tools",
      "Professional learning opportunities",
      "Collaborative startup environment"
    ]
  },
  {
    id: 4,
    title: "UI/UX Designer",
    location: "Islamabad, Pakistan",
    workMode: "On-site",
    jobType: "Full-time",
    level: "Mid-Level",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    applications: 12,
    time: "3 days ago",
    status: "Active",
    salary: "$55k - $85k",
    postedDate: "Nov 26, 2025",
    description: "Design beautiful user interfaces and create intuitive user experiences. Work with product teams to translate requirements into elegant designs that users love.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with developers to ensure design implementation",
      "Maintain and evolve design system",
      "Present design concepts to stakeholders"
    ],
    requirements: [
      "3-5 years of UI/UX design experience",
      "Expert proficiency in Figma and Adobe XD",
      "Strong portfolio demonstrating design process",
      "Understanding of user-centered design principles",
      "Excellent communication and presentation skills"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Annual design conference budget",
      "Latest design tools and software",
      "Creative and collaborative work environment"
    ]
  },
  {
    id: 5,
    title: "DevOps Engineer",
    location: "Remote",
    workMode: "Remote",
    jobType: "Full-time",
    level: "Senior",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    applications: 18,
    time: "5 days ago",
    status: "Active",
    salary: "$90k - $130k",
    postedDate: "Nov 24, 2025",
    description: "Build and maintain scalable infrastructure. Implement CI/CD pipelines, monitor systems, and ensure high availability of our services.",
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage Kubernetes clusters and containerized applications",
      "Monitor system performance and troubleshoot issues",
      "Automate infrastructure provisioning using Terraform",
      "Implement security best practices"
    ],
    requirements: [
      "5+ years of DevOps experience",
      "Strong knowledge of Docker and Kubernetes",
      "Experience with AWS services (EC2, S3, RDS, etc.)",
      "Proficiency in scripting (Bash, Python)",
      "Understanding of networking and security concepts"
    ],
    benefits: [
      "Fully remote position with flexible hours",
      "Top-tier compensation and equity",
      "Learning and certification budget",
      "Latest hardware and tools",
      "Work-life balance focused culture"
    ]
  },
  {
    id: 6,
    title: "Data Analyst",
    location: "Karachi, Pakistan",
    workMode: "Hybrid",
    jobType: "Full-time",
    level: "Junior",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    applications: 16,
    time: "1 week ago",
    status: "Closed",
    salary: "$45k - $65k",
    postedDate: "Nov 22, 2025",
    description: "Analyze data to extract meaningful insights. Create reports and dashboards to help stakeholders make data-driven decisions.",
    responsibilities: [
      "Analyze large datasets to identify trends and patterns",
      "Create interactive dashboards using Power BI",
      "Write SQL queries to extract and manipulate data",
      "Prepare reports and presentations for stakeholders",
      "Collaborate with teams to understand data needs"
    ],
    requirements: [
      "2+ years of data analysis experience",
      "Strong SQL and Excel skills",
      "Experience with Python for data analysis",
      "Proficiency in Power BI or similar tools",
      "Analytical mindset with attention to detail"
    ],
    benefits: [
      "Hybrid work arrangement",
      "Health insurance",
      "Professional development opportunities",
      "Modern office facilities",
      "Friendly team culture"
    ]
  },
  {
    id: 7,
    title: "Mobile App Developer",
    location: "Lahore, Pakistan",
    workMode: "On-site",
    jobType: "Full-time",
    level: "Senior",
    skills: ["React Native", "Flutter", "Swift"],
    applications: 22,
    time: "3 days ago",
    status: "Active",
    salary: "$70k - $110k",
    postedDate: "Nov 26, 2025",
    description: "Develop high-performance mobile applications for iOS and Android. Create seamless user experiences and maintain code quality standards.",
    responsibilities: [
      "Develop cross-platform mobile applications using React Native or Flutter",
      "Optimize mobile app performance and user experience",
      "Integrate backend APIs and third-party services",
      "Participate in code reviews and best practices",
      "Release and manage app store submissions"
    ],
    requirements: [
      "4+ years of mobile development experience",
      "Proficiency in React Native or Flutter",
      "Understanding of iOS and Android platforms",
      "Experience with mobile testing frameworks",
      "Strong problem-solving skills"
    ],
    benefits: [
      "Competitive salary and bonus",
      "Health and wellness program",
      "Latest development devices",
      "Learning and conference budget",
      "Flexible work arrangements"
    ]
  },
  {
    id: 8,
    title: "Cloud Architect",
    location: "Remote",
    workMode: "Remote",
    jobType: "Full-time",
    level: "Senior",
    skills: ["AWS", "Azure", "Terraform"],
    applications: 11,
    time: "6 days ago",
    status: "Active",
    salary: "$120k - $160k",
    postedDate: "Nov 23, 2025",
    description: "Design and implement scalable cloud infrastructure solutions. Lead cloud migration initiatives and optimize cloud costs.",
    responsibilities: [
      "Design cloud architecture for scalability and reliability",
      "Lead cloud migration projects",
      "Implement security best practices in cloud infrastructure",
      "Optimize cloud costs and resource utilization",
      "Provide technical guidance to development teams"
    ],
    requirements: [
      "7+ years of cloud architecture experience",
      "Expert knowledge of AWS or Azure",
      "Experience with Infrastructure as Code (Terraform)",
      "Strong understanding of cloud security",
      "Leadership and communication skills"
    ],
    benefits: [
      "Highest tier compensation",
      "Stock options and equity",
      "Unlimited learning budget",
      "Fully remote with flexible hours",
      "Executive perks and benefits"
    ]
  },
  {
    id: 9,
    title: "QA Engineer",
    location: "Karachi, Pakistan",
    workMode: "Hybrid",
    jobType: "Full-time",
    level: "Mid-Level",
    skills: ["Selenium", "TestNG", "JIRA"],
    applications: 9,
    time: "4 days ago",
    status: "Active",
    salary: "$40k - $60k",
    postedDate: "Nov 25, 2025",
    description: "Ensure product quality through comprehensive testing. Develop automated test scripts and report quality metrics.",
    responsibilities: [
      "Design and execute automated test suites",
      "Perform manual and exploratory testing",
      "Report and track software defects",
      "Collaborate with development teams",
      "Maintain test documentation"
    ],
    requirements: [
      "2+ years of QA testing experience",
      "Proficiency in test automation frameworks",
      "Knowledge of SQL and databases",
      "Experience with testing tools like JIRA",
      "Strong attention to detail"
    ],
    benefits: [
      "Health insurance",
      "Flexible work hours",
      "Professional training",
      "Modern testing tools",
      "Career growth opportunities"
    ]
  },
  {
    id: 10,
    title: "Product Manager",
    location: "Lahore, Pakistan",
    workMode: "Hybrid",
    jobType: "Full-time",
    level: "Senior",
    skills: ["Product Strategy", "Analytics", "Leadership"],
    applications: 15,
    time: "2 days ago",
    status: "Active",
    salary: "$80k - $120k",
    postedDate: "Nov 27, 2025",
    description: "Lead product vision and strategy. Manage product roadmap and oversee product launches.",
    responsibilities: [
      "Define product vision and strategy",
      "Manage product roadmap and prioritization",
      "Conduct market research and competitive analysis",
      "Lead cross-functional product teams",
      "Monitor product metrics and KPIs"
    ],
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and strategic thinking skills",
      "Experience with product management tools",
      "Excellent communication skills",
      "Track record of successful product launches"
    ],
    benefits: [
      "Competitive salary and bonus",
      "Stock options",
      "Leadership development program",
      "Hybrid work flexibility",
      "Executive coaching"
    ]
  },
];

export default function EditJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = parseInt(searchParams.get("jobId"));
  
  const selectedJob = JOBS.find(job => job.id === jobId);

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
    shortlistedCandidates: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Initialize form with job data
  useEffect(() => {
    if (selectedJob) {
      setFormData({
        jobTitle: selectedJob.title,
        jobDescription: selectedJob.description,
        requiredExperience: selectedJob.level,
        salaryRange: selectedJob.salary,
        jobType: selectedJob.jobType.toLowerCase(),
        workMode: selectedJob.workMode.toLowerCase(),
        jobLocation: selectedJob.location,
        skills: selectedJob.skills || [],
        responsibilities: selectedJob.responsibilities || [],
        requirements: selectedJob.requirements || [],
        benefits: selectedJob.benefits || [],
        shortlistedCandidates: '10',
      });
    }
  }, [selectedJob]);

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar active="Dashboard" type="employer" />
        <div className="flex-1 flex flex-col md:ml-64 ml-20">
          <Topbar />
          <main className="p-6 md:p-10 flex-1">
            <div className="text-center text-gray-500">Job not found</div>
          </main>
        </div>
      </div>
    );
  }

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
    console.log('Updated Form Data:', formData);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds and redirect
    setTimeout(() => {
      setShowSuccessMessage(false);
      router.push(`/employer/view-job-post?jobId=${jobId}`);
    }, 2000);
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
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        
        {/* Success Notification */}
        {showSuccessMessage && (
          <div className="fixed top-0 left-0 right-0 md:ml-64 ml-20 flex justify-center pt-6 z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">Job Post updated successfully</span>
            </div>
          </div>
        )}
        
        <main className="p-6 md:p-10 flex-1 flex justify-center">
          <div className="w-full max-w-5xl">
            {/* Back Button */}
            <button
              onClick={() => router.push(`/employer/view-job-post?jobId=${jobId}`)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Job Post</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 leading-none -mt-1">Edit Job Post</h1>
              </div>
              <p className="text-base text-gray-500 ml-[52px] -mt-1">
                Update the details of your job post
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

                {/* Add Skills */}
                <div className="mb-6">
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

                {/* Shortlisted Candidates */}
                <div className="mb-6">
                  <label htmlFor="shortlistedCandidates" className="block text-base font-medium text-gray-900 mb-2">
                    How many candidates to be shortlisted? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="shortlistedCandidates"
                    name="shortlistedCandidates"
                    value={formData.shortlistedCandidates}
                    onChange={handleInputChange}
                    placeholder="e.g. 10"
                    min="1"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Top N candidates based on match scores will be shortlisted.
                  </p>
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
