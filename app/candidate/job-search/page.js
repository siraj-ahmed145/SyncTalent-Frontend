'use client';

import { useState } from 'react';
import { MapPin, Briefcase, Clock, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// Randomized dropdown lists as described
const REGIONS = [
  "All Regions",
  "New York, US",
  "Paris, France",
  "Karachi, Pakistan",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Lahore, Pakistan",
  "London, UK",
  "Dubai, UAE",
  "Remote, Global"
];
const MODES = ["All Work Modes", "Remote", "On-site", "Hybrid"];
const TYPES = ["All Types", "Full time", "Part time", "Contract"];
const SORTS = ["Most Relevant", "Newest", "Oldest", "Highest Salary"];

// Dummy job data for UI only
const JOBS = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    workMode: "Full-time",
    salary: "$120k - $160k",
    level: "Senior",
    tags: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    time: "2 days ago",
    description:
      "We're seeking an experienced Senior Software Engineer to lead our engineering team. You'll work on cutting-edge projects using React, Node.js, and AWS...",
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Innovations Inc",
    location: "Remote",
    workMode: "Full-time",
    salary: "$140k - $180k",
    level: "Senior",
    tags: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP"],
    time: "1 day ago",
    description:
      "Join our ML team to build state-of-the-art machine learning models. Work on NLP, computer vision, recommendation systems. Experience with TensorFlow, PyTorch...",
  },
  {
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    workMode: "Full-time",
    salary: "$130k - $170k",
    level: "Mid Senior",
    tags: ["Product Strategy", "Agile", "User Research", "Analytics"],
    time: "3 days ago",
    description:
      "Lead product development for our SaaS platform. Define product roadmap, work with cross-functional teams, drive product strategy. 5+ years of product management experience...",
  },
  {
    title: "Full Stack Developer",
    company: "WebDev Agency",
    location: "Austin, TX",
    workMode: "Full-time",
    salary: "$100k - $140k",
    level: "Mid-Level",
    tags: ["React", "Node.js", "MongoDB", "JavaScript", "REST API"],
    time: "5 days ago",
    description:
      "Build modern web applications using React, Node.js, and MongoDB. Work in a collaborative environment with designers and other developers...",
  },
  {
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Remote",
    workMode: "Full-time",
    salary: "$130k - $170k",
    level: "Senior",
    tags: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    time: "4 days ago",
    description:
      "Manage and optimize our cloud infrastructure. Implement CI/CD pipelines, monitor system performance, ensure high availability...",
  },
  {
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    workMode: "Full-time",
    salary: "$90k - $130k",
    level: "Mid-Level",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping", "User Testing"],
    time: "1 week ago",
    description:
      "Create beautiful and intuitive user interfaces for web/mobile applications. Proficiency in Figma valued. Collaborate with developers...",
  },
];

export default function CandidateJobSearchPage() {
  const [region, setRegion] = useState(REGIONS[0]);
  const [mode, setMode] = useState(MODES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [sort, setSort] = useState(SORTS[0]);
  const [search, setSearch] = useState("");

  // For UI, all jobs are shown - for real implementation add filtering logic

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Search Job" type="candidate" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <section className="w-full pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div className="pt-4 pb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                  Find Your Next Opportunity
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  Search through thousands of job opportunities
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-center">
                <div className="flex-1 flex items-center w-full">
                  {/* Search input with matching height to button */}
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by job title, company, or skills..."
                    className="w-full max-w-md h-10 rounded-xl bg-zinc-100 border border-zinc-100 px-3 text-base placeholder:text-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm flex items-center"
                    style={{backgroundClip: 'padding-box'}}
                  />
                  <button className="h-10 ml-2 md:ml-3 mr-4 md:mr-6 flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:gap-3 mt-2 md:mt-0">
                  {/* Dropdowns with bg color and no border or matching border */}
                  <select value={region} onChange={e => setRegion(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                    {REGIONS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                  </select>
                  <select value={mode} onChange={e => setMode(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                    {MODES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                  </select>
                  <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                    {TYPES.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 mb-3">
                <p className="text-sm text-gray-600">Showing 12 jobs</p>
                <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl bg-zinc-100 border border-zinc-100 px-3 py-2 h-10 text-base text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm w-44">
                  {SORTS.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {JOBS.map((job, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col h-full transition-all duration-200 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.level.includes('Senior') ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'} border border-blue-200 whitespace-nowrap`}>
                        {job.level}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 font-medium mb-1">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.workMode}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.salary}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-xs font-medium rounded border border-zinc-200 text-zinc-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-gray-400">{job.time}</span>
                      <button className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
