'use client';

import { useState } from 'react';
import { MapPin, Briefcase, Clock, FileText, CheckCircle, XCircle, Loader } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// Dummy application data for UI
const APPLICATIONS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    workMode: "Full-time",
    salary: "$120k - $160k",
    level: "Senior",
    appliedDate: "Nov 20, 2025",
    status: "Shortlisted for Interview",
    matchScore: 92,
    tags: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    description: "We're seeking an experienced Senior Software Engineer to lead our engineering team. You'll work on cutting-edge projects using React, Node.js, and AWS...",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "AI Innovations Inc",
    location: "Remote",
    workMode: "Full-time",
    salary: "$140k - $180k",
    level: "Senior",
    appliedDate: "Nov 18, 2025",
    status: "In Progress",
    matchScore: 88,
    tags: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP"],
    description: "Join our ML team to build state-of-the-art machine learning models. Work on NLP, computer vision, recommendation systems. Experience with TensorFlow, PyTorch...",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    workMode: "Full-time",
    salary: "$130k - $170k",
    level: "Mid Senior",
    appliedDate: "Nov 15, 2025",
    status: "Rejected",
    matchScore: 75,
    tags: ["Product Strategy", "Agile", "User Research", "Analytics"],
    description: "Lead product development for our SaaS platform. Define product roadmap, work with cross-functional teams, drive product strategy. 5+ years of product management experience...",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "WebDev Agency",
    location: "Austin, TX",
    workMode: "Full-time",
    salary: "$100k - $140k",
    level: "Mid-Level",
    appliedDate: "Nov 12, 2025",
    status: "In Progress",
    matchScore: 85,
    tags: ["React", "Node.js", "MongoDB", "JavaScript", "REST API"],
    description: "Build modern web applications using React, Node.js, and MongoDB. Work in a collaborative environment with designers and other developers...",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Remote",
    workMode: "Full-time",
    salary: "$130k - $170k",
    level: "Senior",
    appliedDate: "Nov 10, 2025",
    status: "Shortlisted for Interview",
    matchScore: 95,
    tags: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    description: "Manage and optimize our cloud infrastructure. Implement CI/CD pipelines, monitor system performance, ensure high availability...",
  },
  {
    id: 6,
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    workMode: "Full-time",
    salary: "$90k - $130k",
    level: "Mid-Level",
    appliedDate: "Nov 8, 2025",
    status: "In Progress",
    matchScore: 78,
    tags: ["Figma", "UI Design", "UX Research", "Prototyping", "User Testing"],
    description: "Create beautiful and intuitive user interfaces for web/mobile applications. Proficiency in Figma valued. Collaborate with developers...",
  },
  {
    id: 7,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Boston, MA",
    workMode: "Hybrid",
    salary: "$110k - $150k",
    level: "Mid-Level",
    appliedDate: "Nov 5, 2025",
    status: "Rejected",
    matchScore: 68,
    tags: ["Python", "R", "SQL", "Statistics", "Data Visualization"],
    description: "Analyze complex datasets and provide actionable insights. Build predictive models and present findings to stakeholders...",
  },
  {
    id: 8,
    title: "Backend Developer",
    company: "Tech Innovators",
    location: "Seattle, WA",
    workMode: "Full-time",
    salary: "$115k - $145k",
    level: "Senior",
    appliedDate: "Nov 3, 2025",
    status: "Shortlisted for Interview",
    matchScore: 90,
    tags: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
    description: "Design and implement scalable backend systems. Work with modern technologies and cloud-native architecture...",
  },
];

export default function CandidateApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  // Calculate statistics
  const totalApplied = APPLICATIONS.length;
  const shortlisted = APPLICATIONS.filter(app => app.status === "Shortlisted for Interview").length;
  const rejected = APPLICATIONS.filter(app => app.status === "Rejected").length;
  const inProgress = APPLICATIONS.filter(app => app.status === "In Progress").length;

  // Filter applications
  const filteredApplications = statusFilter === "All" 
    ? APPLICATIONS 
    : APPLICATIONS.filter(app => app.status === statusFilter);

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case "Shortlisted for Interview":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle className="w-4 h-4" />
        };
      case "Rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: <XCircle className="w-4 h-4" />
        };
      case "In Progress":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Loader className="w-4 h-4" />
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <FileText className="w-4 h-4" />
        };
    }
  };

  // Get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Job Applications" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Header */}
              <div className="pt-4 pb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                  My Job Applications
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  Track the status of all your job applications
                </p>
              </div>

              {/* Statistics Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Applications */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Applied</p>
                      <p className="text-3xl font-bold text-gray-900">{totalApplied}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Shortlisted */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Shortlisted</p>
                      <p className="text-3xl font-bold text-green-600">{shortlisted}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Rejected */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Rejected</p>
                      <p className="text-3xl font-bold text-red-600">{rejected}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Loader className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {["All", "Shortlisted for Interview", "In Progress", "Rejected"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        statusFilter === filter
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Applications Grid */}
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-500">No applications match the selected filter.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {filteredApplications.map((app) => {
                    const statusBadge = getStatusBadge(app.status);
                    const matchScoreColor = getMatchScoreColor(app.matchScore);
                    
                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                      >
                        {/* Header with Title and Match Score */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                              {app.title}
                            </h3>
                          </div>
                          
                          {/* Match Score Badge */}
                          <div className="ml-3 text-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 font-medium mb-0.5">Match</div>
                            <div className={`text-2xl font-bold ${matchScoreColor}`}>
                              {app.matchScore}%
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 font-medium mb-1">{app.company}</p>

                        {/* Job Details */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {app.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" /> {app.workMode}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {app.salary}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs md:text-sm text-gray-700 mb-3 line-clamp-2">
                          {app.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-zinc-100 text-xs font-medium rounded border border-zinc-200 text-zinc-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer with Status and Date */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Applied: {app.appliedDate}</span>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.icon}
                            <span>{app.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

