"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Search, MapPin, ArrowLeft, Calendar, DollarSign, Clock } from "lucide-react";
import api from "../../lib/api";

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
  }
];

const REGIONS = [
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "Remote",
];
const MODES = ["On-site", "Remote", "Hybrid"];
const TYPES = ["Full-time", "Part-time", "Contract"];
const STATUS = ["Active", "Closed"];
const SORTS = ["Most Relevant", "Newest", "Oldest", "Most Applications"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [region, setRegion] = useState("All Regions");
  const [mode, setMode] = useState("All Work Modes");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState(SORTS[0]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // Filtered jobs (UI only)
  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesRegion = region === "All Regions" || job.location === region;
    const matchesMode = mode === "All Work Modes" || job.workMode === mode;
    const matchesType = type === "All Types" || job.jobType === type;
    const matchesStatus = status === "All Status" || job.status === status;
    return matchesSearch && matchesRegion && matchesMode && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          {!selectedJob ? (
            <>
              {/* Top stats */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Jobs Posted</p>
                        <p className="text-3xl font-bold text-gray-900">{JOBS.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-purple-600">{JOBS.reduce((acc, j) => acc + j.applications, 0)}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-center mb-6">
                  <div className="flex-1 flex items-center w-full">
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search by job title, company, or skills..."
                      className="w-full max-w-md h-10 rounded-xl bg-zinc-100 border border-zinc-100 px-3 text-base placeholder:text-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm flex items-center"
                      style={{ backgroundClip: 'padding-box' }}
                    />
                    <button className="h-10 ml-2 md:ml-3 mr-4 md:mr-6 flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:gap-3 mt-2 md:mt-0">
                    <select value={region} onChange={e => setRegion(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Regions">Regions</option>
                      {REGIONS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={mode} onChange={e => setMode(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Work Modes">Work Modes</option>
                      {MODES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                      <option value="All Types">Types</option>
                      {TYPES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 mb-3">
                  <p className="text-sm text-gray-600">Showing {filteredJobs.length} jobs</p>
                  <div className="flex items-center gap-3">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-32">
                      <option value="All Status">Status</option>
                      {STATUS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-44">
                      {SORTS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                {/* Job List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
                  <h2 className="text-xl font-bold mb-4 text-blue-700">Your Job Posts</h2>
                  {filteredJobs.length === 0 ? (
                    <div className="text-gray-500 text-center p-6">No job posts found.</div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-2xl"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900">{job.title}</h3>
                            <div className="flex items-center gap-2 ml-2">
                              {/* Level badge */}
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.level.includes('Senior') ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'} border border-blue-200 whitespace-nowrap`}>
                                {job.level}
                              </span>
                              {/* Status badge */}
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} border whitespace-nowrap`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 mr-0.5" />{job.location}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 mr-0.5" />{job.jobType}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 mr-0.5" />{job.workMode}</span>
                          </div>
                          {/* Job description (clamped) */}
                          {job.description && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                          )}
                          {/* Skills badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills && job.skills.map((skill) => (
                              <span key={skill} className="px-2 py-0.5 bg-zinc-100 text-xs font-medium rounded border border-zinc-200 text-zinc-600">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {/* Bottom row: posted and total applications */}
                          <div className="mt-auto flex items-end flex-row justify-between pt-4 border-t border-gray-100 text-sm gap-2">
                            <span className="text-gray-400">Job Posted: {job.time}</span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200"><Users className="w-4 h-4" />{job.applications} Applications</span>
                          </div>
                          <div className="w-full mt-auto flex justify-center mb">
                            <button 
                              onClick={() => setSelectedJob(job)}
                              className="font-bold text-sm text-blue-600 px-5 py-2 rounded-full bg-transparent hover:bg-blue-50 hover:text-blue-700 transition-all focus:outline-none"
                            >
                              View Job Post
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Job Details Page */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Back Button */}
              <button 
                onClick={() => setSelectedJob(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Job Posts</span>
              </button>

              {/* Job Details Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">{selectedJob.title}</h1>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${selectedJob.level.includes('Senior') ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'} border border-blue-200`}>
                        {selectedJob.level}
                      </span>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${selectedJob.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} border`}>
                      {selectedJob.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-base text-gray-600">
                    <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{selectedJob.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-5 h-5" />{selectedJob.workMode}</span>
                    <span className="flex items-center gap-1"><Clock className="w-5 h-5" />{selectedJob.jobType}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-5 h-5" />{selectedJob.salary}</span>
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
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
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
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
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
                      className="py-3 px-5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold rounded-xl transition-colors">
                      View Applications
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-300">
                      Edit Job Post
                    </button>
                    <button className={`py-3 font-semibold rounded-xl transition-colors border ${selectedJob.status === 'Active' ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-300'}`}>
                      {selectedJob.status === 'Active' ? 'Close Job Post' : 'Reopen Job Post'}
                    </button>
                    <button className="py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-colors border border-red-400">
                      Delete Job Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}