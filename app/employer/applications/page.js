"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { ArrowLeft, Users, CheckCircle, XCircle, Star, Mail, Phone, MapPin, Clock, Download } from "lucide-react";

// Dummy candidates data with matching scores
const CANDIDATES_DATA = {
  1: [
    {
      id: 1,
      name: "Ahmed Hassan",
      title: "Senior React Developer",
      email: "ahmed@example.com",
      phone: "+92 300 1234567",
      location: "Lahore, Pakistan",
      matchingScore: 92,
      status: "shortlisted",
      skills: ["React", "JavaScript", "Tailwind CSS", "Next.js"],
      experience: "6 years",
      about: "Expert in building scalable React applications with modern development practices.",
      resume: "ahmed_resume.pdf",
      // Full profile data
      profilePicture: "A",
      workExperience: [
        {
          title: "Senior React Developer",
          company: "Tech Solutions Inc",
          duration: "2022 - Present",
          description: "Led frontend development of multiple projects. Mentored junior developers and implemented best practices."
        },
        {
          title: "React Developer",
          company: "StartupXYZ",
          duration: "2019 - 2022",
          description: "Developed web applications using React and Node.js. Collaborated with UI/UX team."
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "FAST-NUCES Lahore",
          year: "2019"
        }
      ],
      certifications: [
        { name: "AWS Certified Solutions Architect", issuer: "Amazon", year: "2023" },
        { name: "React Advanced Patterns", issuer: "Udemy", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 2,
      name: "Fatima Khan",
      title: "Full-stack Developer",
      email: "fatima@example.com",
      phone: "+92 301 9876543",
      location: "Karachi, Pakistan",
      matchingScore: 88,
      status: "shortlisted",
      skills: ["React", "Node.js", "JavaScript", "MongoDB"],
      experience: "5 years",
      about: "Passionate developer with strong backend and frontend skills.",
      resume: "fatima_resume.pdf",
      // Full profile data
      profilePicture: "F",
      workExperience: [
        {
          title: "Full-Stack Developer",
          company: "Digital Innovations",
          duration: "2021 - Present",
          description: "Developed end-to-end web applications using MERN stack. Managed databases and APIs."
        },
        {
          title: "Frontend Developer",
          company: "Web Design Studio",
          duration: "2018 - 2021",
          description: "Created responsive web interfaces and improved UX/performance."
        }
      ],
      education: [
        {
          degree: "Bachelor of Engineering in Software Engineering",
          institution: "NED University",
          year: "2018"
        }
      ],
      certifications: [
        { name: "MongoDB Certified Associate", issuer: "MongoDB", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 3,
      name: "Ali Raza",
      title: "Junior Frontend Developer",
      email: "ali@example.com",
      phone: "+92 302 5555555",
      location: "Islamabad, Pakistan",
      matchingScore: 45,
      status: "rejected",
      skills: ["React", "CSS", "JavaScript"],
      experience: "1 year",
      about: "Beginner developer looking to grow in frontend development.",
      resume: "ali_resume.pdf",
      // Full profile data
      profilePicture: "A",
      workExperience: [
        {
          title: "Junior Frontend Developer",
          company: "Tech Startup",
          duration: "2024 - Present",
          description: "Working on React components and learning best practices."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "IBA Islamabad",
          year: "2024"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 4,
      name: "Sara Ahmed",
      title: "Frontend Engineer",
      email: "sara@example.com",
      phone: "+92 303 7777777",
      location: "Remote",
      matchingScore: 85,
      status: "shortlisted",
      skills: ["React", "JavaScript", "Tailwind CSS", "TypeScript"],
      experience: "4 years",
      about: "Detail-oriented developer focused on user experience and responsive design.",
      resume: "sara_resume.pdf",
      // Full profile data
      profilePicture: "S",
      workExperience: [
        {
          title: "Senior Frontend Engineer",
          company: "Design Company Pro",
          duration: "2021 - Present",
          description: "Led frontend architecture and collaborated with designers."
        }
      ],
      education: [
        {
          degree: "Master of Science in Computer Science",
          institution: "COMSATS Islamabad",
          year: "2021"
        }
      ],
      certifications: [
        { name: "Advanced React", issuer: "Frontend Masters", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 5,
      name: "Hassan Malik",
      title: "Backend Developer",
      email: "hassan@example.com",
      phone: "+92 304 3333333",
      location: "Lahore, Pakistan",
      matchingScore: 52,
      status: "rejected",
      skills: ["Python", "Django", "PostgreSQL"],
      experience: "3 years",
      about: "Backend specialist but lacks required frontend skills.",
      resume: "hassan_resume.pdf",
      // Full profile data
      profilePicture: "H",
      workExperience: [
        {
          title: "Backend Developer",
          company: "Enterprise Solutions",
          duration: "2021 - Present",
          description: "Developed REST APIs and managed databases."
        }
      ],
      education: [
        {
          degree: "Bachelor of Information Technology",
          institution: "UET Lahore",
          year: "2021"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 6,
      name: "Zainab Ali",
      title: "React Specialist",
      email: "zainab@example.com",
      phone: "+92 305 1111111",
      location: "Karachi, Pakistan",
      matchingScore: 90,
      status: "shortlisted",
      skills: ["React", "JavaScript", "Tailwind CSS", "Redux", "Next.js"],
      experience: "5 years",
      about: "Highly experienced React developer with expertise in modern tooling.",
      resume: "zainab_resume.pdf",
      // Full profile data
      profilePicture: "Z",
      workExperience: [
        {
          title: "React Specialist",
          company: "Tech Giants Inc",
          duration: "2020 - Present",
          description: "Specialized in React optimization and state management."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "NED University",
          year: "2020"
        }
      ],
      certifications: [
        { name: "React Professional", issuer: "React Community", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 7,
      name: "Muhammad Hasan",
      title: "UI Developer",
      email: "hasan@example.com",
      phone: "+92 306 9999999",
      location: "Remote",
      matchingScore: 40,
      status: "rejected",
      skills: ["HTML", "CSS", "JavaScript"],
      experience: "2 years",
      about: "Good at UI but limited experience with React framework.",
      resume: "hasan_resume.pdf",
      // Full profile data
      profilePicture: "M",
      workExperience: [
        {
          title: "UI Developer",
          company: "Design Studio",
          duration: "2022 - Present",
          description: "Creating UI components and styling."
        }
      ],
      education: [
        {
          degree: "Diploma in Web Design",
          institution: "Training Institute",
          year: "2022"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 8,
      name: "Amina Fatima",
      title: "Full Stack Engineer",
      email: "amina@example.com",
      phone: "+92 307 6666666",
      location: "Islamabad, Pakistan",
      matchingScore: 87,
      status: "shortlisted",
      skills: ["React", "Node.js", "JavaScript", "Tailwind CSS", "MongoDB"],
      experience: "4 years",
      about: "Strong full-stack developer with solid experience in MERN stack.",
      resume: "amina_resume.pdf",
      // Full profile data
      profilePicture: "A",
      workExperience: [
        {
          title: "Full Stack Engineer",
          company: "Web Solutions Ltd",
          duration: "2021 - Present",
          description: "Developed complete web applications using MERN stack."
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "FAST-NUCES Islamabad",
          year: "2021"
        }
      ],
      certifications: [
        { name: "MERN Stack Developer", issuer: "Udemy", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  2: [
    {
      id: 101,
      name: "Khalid Ahmed",
      title: "Backend Engineer",
      email: "khalid@example.com",
      phone: "+92 308 1234567",
      location: "Lahore, Pakistan",
      matchingScore: 94,
      status: "shortlisted",
      skills: ["Node.js", "Express", "MongoDB"],
      experience: "4 years",
      about: "Expert backend engineer with extensive experience in Node.js and database design.",
      resume: "khalid_resume.pdf",
      profilePicture: "K",
      workExperience: [
        {
          title: "Senior Backend Engineer",
          company: "Enterprise Tech",
          duration: "2021 - Present",
          description: "Led backend architecture and API development."
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "UET Lahore",
          year: "2020"
        }
      ],
      certifications: [
        { name: "Node.js Professional", issuer: "Node.js Foundation", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 102,
      name: "Nida Khan",
      title: "DevOps Engineer",
      email: "nida@example.com",
      phone: "+92 309 9876543",
      location: "Remote",
      matchingScore: 55,
      status: "rejected",
      skills: ["Docker", "Kubernetes", "AWS"],
      experience: "2 years",
      about: "DevOps focused but lacks backend development experience.",
      resume: "nida_resume.pdf",
      profilePicture: "N",
      workExperience: [
        {
          title: "DevOps Engineer",
          company: "Cloud Systems",
          duration: "2022 - Present",
          description: "Managing infrastructure and CI/CD pipelines."
        }
      ],
      education: [
        {
          degree: "Bachelor of Information Technology",
          institution: "COMSATS Islamabad",
          year: "2022"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  3: [
    {
      id: 201,
      name: "Imran Hassan",
      title: "Full Stack Developer",
      email: "imran@example.com",
      phone: "+92 310 1234567",
      location: "Karachi, Pakistan",
      matchingScore: 91,
      status: "shortlisted",
      skills: ["React", "Node.js", "AWS"],
      experience: "5 years",
      about: "Experienced full-stack developer with AWS expertise.",
      resume: "imran_resume.pdf",
      profilePicture: "I",
      workExperience: [
        {
          title: "Full Stack Developer",
          company: "Digital Solutions",
          duration: "2020 - Present",
          description: "Building scalable web applications on AWS."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "NED University",
          year: "2020"
        }
      ],
      certifications: [
        { name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 202,
      name: "Leila Ahmed",
      title: "Junior Developer",
      email: "leila@example.com",
      phone: "+92 311 5555555",
      location: "Remote",
      matchingScore: 48,
      status: "rejected",
      skills: ["React", "Node.js"],
      experience: "1 year",
      about: "Junior with basic full-stack skills but limited AWS experience.",
      resume: "leila_resume.pdf",
      profilePicture: "L",
      workExperience: [
        {
          title: "Junior Full Stack Developer",
          company: "Tech Startup",
          duration: "2024 - Present",
          description: "Learning MERN stack and building projects."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "IBA Karachi",
          year: "2024"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ]
};

export default function ViewApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("jobTitle");
  
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Load candidates for the selected job
    if (jobId && CANDIDATES_DATA[jobId]) {
      setCandidates(CANDIDATES_DATA[jobId]);
    }
  }, [jobId]);

  const shortlistedCandidates = candidates.filter(c => c.status === "shortlisted");
  const rejectedCandidates = candidates.filter(c => c.status === "rejected");

  // Filter candidates based on selected status
  const getFilteredCandidates = () => {
    switch(filterStatus) {
      case "shortlisted":
        return shortlistedCandidates;
      case "rejected":
        return rejectedCandidates;
      default:
        return candidates;
    }
  };

  const filteredCandidates = getFilteredCandidates();

  const handleBack = () => {
    router.push("/employer/dashboard");
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return "bg-green-50";
    if (score >= 70) return "bg-blue-50";
    if (score >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getScoreBorderColor = (score) => {
    if (score >= 85) return "border-green-200";
    if (score >= 70) return "border-blue-200";
    if (score >= 60) return "border-yellow-200";
    return "border-red-200";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Dashboard" type="employer" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          {!selectedCandidate ? (
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>

              {/* Page Header */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {jobTitle || "Job"} - Applications
                </h1>
                <p className="text-gray-600">
                  Review applications and see how candidates match your job requirements
                </p>
              </div>

              {/* Stats Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Applications */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Shortlisted */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Shortlisted</p>
                        <p className="text-3xl font-bold text-green-600">{shortlistedCandidates.length}</p>
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
                        <p className="text-3xl font-bold text-red-600">{rejectedCandidates.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                      filterStatus === "all"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("shortlisted")}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                      filterStatus === "shortlisted"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Shortlisted
                  </button>
                  <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                      filterStatus === "rejected"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* Candidates List */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {filterStatus === "all"
                        ? "All Candidates"
                        : filterStatus === "shortlisted"
                        ? "Shortlisted Candidates"
                        : "Rejected Candidates"}
                    </h2>
                  </div>

                  {filteredCandidates.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No candidates found in this filter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCandidates
                        .sort((a, b) => b.matchingScore - a.matchingScore)
                        .map((candidate) => {
                          const isShortlisted = candidate.status === "shortlisted";
                          return (
                            <div
                              key={candidate.id}
                              className={`rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between ${
                                isShortlisted
                                  ? "bg-green-50 border-green-100"
                                  : "bg-red-50 border-red-100 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${
                                  isShortlisted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}>
                                  {candidate.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 truncate">{candidate.name}</h3>
                                </div>
                              </div>

                              <div className={`flex items-center gap-4 flex-shrink-0 ml-4`}>
                                <div className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${getScoreBgColor(candidate.matchingScore)} ${getScoreBorderColor(candidate.matchingScore)}`}>
                                  <p className="text-xs text-gray-600 font-medium">Match</p>
                                  <p className={`text-2xl font-bold ${getScoreColor(candidate.matchingScore)}`}>
                                    {candidate.matchingScore}%
                                  </p>
                                </div>

                                <button 
                                  onClick={() => setSelectedCandidate(candidate)}
                                  className="font-semibold text-sm text-blue-600 px-4 py-2 rounded-full bg-transparent hover:bg-blue-50 hover:text-blue-700 transition-all focus:outline-none whitespace-nowrap"
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Candidate Detail View */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              {/* Back Button */}
              <button
                onClick={() => setSelectedCandidate(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Applications</span>
              </button>

              {/* Candidate Details Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                        {selectedCandidate.name.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{selectedCandidate.name}</h1>
                        <p className="text-lg text-gray-600 mt-1">{selectedCandidate.title}</p>
                      </div>
                    </div>
                    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 ${getScoreBgColor(selectedCandidate.matchingScore)} ${getScoreBorderColor(selectedCandidate.matchingScore)}`}>
                      <Star className={`w-6 h-6 mb-2 ${getScoreColor(selectedCandidate.matchingScore)}`} />
                      <p className={`text-3xl font-bold ${getScoreColor(selectedCandidate.matchingScore)}`}>
                        {selectedCandidate.matchingScore}%
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Job Match Score</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {selectedCandidate.status === "shortlisted" ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                          Shortlisted
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-sm">
                          Rejected
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-medium text-gray-900">{selectedCandidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-base font-medium text-gray-900">{selectedCandidate.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-base font-medium text-gray-900">{selectedCandidate.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-base font-medium text-gray-900">{selectedCandidate.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedCandidate.about}
                  </p>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-base font-medium rounded-full border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Work Experience Section */}
                {selectedCandidate.workExperience && selectedCandidate.workExperience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Work Experience</h2>
                    <div className="space-y-4">
                      {selectedCandidate.workExperience.map((exp, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-bold text-gray-900">{exp.title}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                          <p className="text-gray-700 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {selectedCandidate.education && selectedCandidate.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
                    <div className="space-y-4">
                      {selectedCandidate.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications Section */}
                {selectedCandidate.certifications && selectedCandidate.certifications.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Certifications</h2>
                    <div className="space-y-3">
                      {selectedCandidate.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages Section */}
                {selectedCandidate.languages && selectedCandidate.languages.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Languages</h2>
                    <div className="space-y-2">
                      {selectedCandidate.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{lang.name}</span>
                            <span className="text-sm text-gray-500">({lang.proficiency})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume Section */}
                {selectedCandidate.resume && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Resume</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Download className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 mb-3">Current Resume: {selectedCandidate.resume}</p>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        View Resume
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-xl transition-colors border border-green-300">
                      Send Message
                    </button>
                    <button className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                      {selectedCandidate.status === "shortlisted" ? "Move to Rejected" : "Shortlist"}
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
