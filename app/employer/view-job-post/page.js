"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, MapPin, Briefcase, Calendar, DollarSign, Clock, Building2, CheckCircle, X } from "lucide-react";
import { useState } from "react";

// Dummy data for jobs
const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Lahore, Pakistan",
    workMode: "On-site",
    jobType: "Full-time",
    level: "Senior",
    skills: ["React", "Javascript", "Tailwind CSS"],
    applications: 8,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
    applications: 5,
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
  }
];

export default function ViewJobPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = parseInt(searchParams.get("jobId"));
  
  // State for modals and notifications
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'close', 'reopen', 'delete'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
  
  // Handler functions
  const handleActionClick = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };
  
  const handleConfirmAction = () => {
    let message = '';
    switch (confirmAction) {
      case 'close':
        message = 'Job Post closed successfully';
        // Here you would update the job status in your backend
        break;
      case 'reopen':
        message = 'Job Post reopened successfully';
        // Here you would update the job status in your backend
        break;
      case 'delete':
        message = 'Job Post deleted successfully';
        // Here you would delete the job from your backend
        setTimeout(() => router.push('/employer/dashboard'), 1500);
        break;
    }
    
    setShowConfirmModal(false);
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  const getConfirmMessage = () => {
    switch (confirmAction) {
      case 'close':
        return 'Are you sure you want to close this job post?';
      case 'reopen':
        return 'Are you sure you want to reopen this job post?';
      case 'delete':
        return 'Are you sure you want to delete this job post?';
      default:
        return '';
    }
  };

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
              <span className="font-semibold text-base">{successMessage}</span>
            </div>
          </div>
        )}
        
        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">{getConfirmMessage()}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        
        <main className="p-6 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Back Button */}
            <button 
              onClick={() => router.push("/employer/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            {/* Job Details Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedJob.title}</h1>
                    <span className="px-3 py-1 text-sm rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                      {getLevelInYears(selectedJob.level)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${selectedJob.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} border ml-2 shrink-0`}>
                    {selectedJob.status}
                  </span>
                </div>
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
                      <Users className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Applications</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedJob.applications}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.skills.map((skill) => (
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
                <div className="flex justify-end mb-10">
                  <button 
                    onClick={() => router.push(`/employer/applications?jobId=${selectedJob.id}&jobTitle=${encodeURIComponent(selectedJob.title)}`)}
                    className="py-3 px-5 text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 font-semibold rounded-xl transition-all">
                    View Applications
                  </button>
                </div>
                
                {selectedJob.status === 'Active' ? (
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleActionClick('close')}
                      className="py-3 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 font-semibold rounded-xl transition-colors border">
                      Close Job Post
                    </button>
                    <button 
                      onClick={() => router.push(`/employer/edit-job-post?jobId=${selectedJob.id}`)}
                      className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                      Edit Job Post
                    </button>
                    <button 
                      onClick={() => handleActionClick('delete')}
                      className="py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-colors border border-red-400">
                      Delete Job Post
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleActionClick('reopen')}
                      className="py-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 font-semibold rounded-xl transition-colors border">
                      Reopen Job Post
                    </button>
                    <button 
                      onClick={() => handleActionClick('delete')}
                      className="py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-colors border border-red-400">
                      Delete Job Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

