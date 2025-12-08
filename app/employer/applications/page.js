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
    },
    {
      id: 103,
      name: "Bilal Shah",
      title: "Node.js Developer",
      email: "bilal@example.com",
      phone: "+92 312 4444444",
      location: "Lahore, Pakistan",
      matchingScore: 78,
      status: "shortlisted",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
      experience: "3 years",
      about: "Experienced Node.js developer with strong backend skills.",
      resume: "bilal_resume.pdf",
      profilePicture: "B",
      workExperience: [
        {
          title: "Backend Developer",
          company: "Tech Corp",
          duration: "2021 - Present",
          description: "Developed scalable REST APIs and microservices."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "UET Lahore",
          year: "2021"
        }
      ],
      certifications: [
        { name: "Node.js Certification", issuer: "Node.js Foundation", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 104,
      name: "Sana Malik",
      title: "Backend Engineer",
      email: "sana@example.com",
      phone: "+92 313 8888888",
      location: "Karachi, Pakistan",
      matchingScore: 72,
      status: "shortlisted",
      skills: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
      experience: "2.5 years",
      about: "Backend engineer with experience in both SQL and NoSQL databases.",
      resume: "sana_resume.pdf",
      profilePicture: "S",
      workExperience: [
        {
          title: "Backend Engineer",
          company: "Data Systems",
          duration: "2022 - Present",
          description: "Building robust backend systems and APIs."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "NED University",
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
      id: 105,
      name: "Omar Khan",
      title: "Junior Backend Developer",
      email: "omar@example.com",
      phone: "+92 314 2222222",
      location: "Islamabad, Pakistan",
      matchingScore: 58,
      status: "rejected",
      skills: ["Node.js", "Express", "JavaScript"],
      experience: "1.5 years",
      about: "Junior developer with basic Node.js skills, needs more experience.",
      resume: "omar_resume.pdf",
      profilePicture: "O",
      workExperience: [
        {
          title: "Junior Backend Developer",
          company: "Startup Inc",
          duration: "2023 - Present",
          description: "Learning backend development and building small projects."
        }
      ],
      education: [
        {
          degree: "Bachelor of Information Technology",
          institution: "COMSATS Islamabad",
          year: "2023"
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
    },
    {
      id: 203,
      name: "Fahad Ali",
      title: "Full Stack Developer",
      email: "fahad@example.com",
      phone: "+92 315 7777777",
      location: "Lahore, Pakistan",
      matchingScore: 84,
      status: "shortlisted",
      skills: ["React", "Node.js", "AWS", "Docker"],
      experience: "4 years",
      about: "Skilled full-stack developer with cloud deployment experience.",
      resume: "fahad_resume.pdf",
      profilePicture: "F",
      workExperience: [
        {
          title: "Full Stack Developer",
          company: "Cloud Tech",
          duration: "2021 - Present",
          description: "Developed and deployed full-stack applications on AWS."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "UET Lahore",
          year: "2021"
        }
      ],
      certifications: [
        { name: "AWS Developer Associate", issuer: "Amazon", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 204,
      name: "Ayesha Tariq",
      title: "Cloud Developer",
      email: "ayesha@example.com",
      phone: "+92 316 3333333",
      location: "Islamabad, Pakistan",
      matchingScore: 79,
      status: "shortlisted",
      skills: ["React", "Node.js", "AWS", "Lambda"],
      experience: "3.5 years",
      about: "Cloud-focused developer with strong AWS and serverless expertise.",
      resume: "ayesha_resume.pdf",
      profilePicture: "A",
      workExperience: [
        {
          title: "Cloud Developer",
          company: "Enterprise Cloud",
          duration: "2021 - Present",
          description: "Building serverless applications and managing cloud infrastructure."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "FAST-NUCES Islamabad",
          year: "2021"
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
      id: 205,
      name: "Usman Ahmed",
      title: "Software Engineer",
      email: "usman@example.com",
      phone: "+92 317 5555555",
      location: "Karachi, Pakistan",
      matchingScore: 67,
      status: "rejected",
      skills: ["React", "Node.js", "MongoDB"],
      experience: "2 years",
      about: "Software engineer with MERN stack experience but limited AWS knowledge.",
      resume: "usman_resume.pdf",
      profilePicture: "U",
      workExperience: [
        {
          title: "Software Engineer",
          company: "Web Solutions",
          duration: "2022 - Present",
          description: "Developing web applications using MERN stack."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "NED University",
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
  4: [
    {
      id: 301,
      name: "Faisal Mahmood",
      title: "UI/UX Designer",
      email: "faisal@example.com",
      phone: "+92 318 1234567",
      location: "Islamabad, Pakistan",
      matchingScore: 88,
      status: "shortlisted",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      experience: "4 years",
      about: "Experienced UI/UX designer with a passion for creating intuitive designs.",
      resume: "faisal_resume.pdf",
      profilePicture: "F",
      workExperience: [
        {
          title: "Senior UI/UX Designer",
          company: "Design Studio Pro",
          duration: "2021 - Present",
          description: "Leading design projects and mentoring junior designers."
        }
      ],
      education: [
        {
          degree: "Bachelor of Fine Arts",
          institution: "National College of Arts",
          year: "2020"
        }
      ],
      certifications: [
        { name: "UX Design Professional", issuer: "Google", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 302,
      name: "Mariam Khan",
      title: "Product Designer",
      email: "mariam@example.com",
      phone: "+92 319 8888888",
      location: "Islamabad, Pakistan",
      matchingScore: 82,
      status: "shortlisted",
      skills: ["Figma", "Adobe XD", "Sketch", "Wireframing"],
      experience: "3.5 years",
      about: "Product designer focused on user-centered design principles.",
      resume: "mariam_resume.pdf",
      profilePicture: "M",
      workExperience: [
        {
          title: "Product Designer",
          company: "Tech Products Inc",
          duration: "2021 - Present",
          description: "Designing product interfaces and conducting user research."
        }
      ],
      education: [
        {
          degree: "Bachelor of Design",
          institution: "NUST Islamabad",
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
      id: 303,
      name: "Ahmed Raza",
      title: "UX Designer",
      email: "ahmed.r@example.com",
      phone: "+92 320 5555555",
      location: "Rawalpindi, Pakistan",
      matchingScore: 75,
      status: "shortlisted",
      skills: ["Figma", "Prototyping", "User Testing"],
      experience: "3 years",
      about: "UX designer specializing in mobile app design and user research.",
      resume: "ahmed_r_resume.pdf",
      profilePicture: "A",
      workExperience: [
        {
          title: "UX Designer",
          company: "Mobile Apps Co",
          duration: "2022 - Present",
          description: "Designing mobile app experiences and conducting usability tests."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "COMSATS Islamabad",
          year: "2022"
        }
      ],
      certifications: [
        { name: "UX Research Fundamentals", issuer: "Nielsen Norman Group", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 304,
      name: "Hina Ali",
      title: "Visual Designer",
      email: "hina@example.com",
      phone: "+92 321 7777777",
      location: "Islamabad, Pakistan",
      matchingScore: 70,
      status: "rejected",
      skills: ["Adobe XD", "Illustrator", "Photoshop"],
      experience: "2.5 years",
      about: "Visual designer with strong graphic design skills but limited UX experience.",
      resume: "hina_resume.pdf",
      profilePicture: "H",
      workExperience: [
        {
          title: "Visual Designer",
          company: "Creative Agency",
          duration: "2022 - Present",
          description: "Creating visual assets and brand materials."
        }
      ],
      education: [
        {
          degree: "Bachelor of Fine Arts",
          institution: "Punjab University",
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
      id: 305,
      name: "Bilal Hassan",
      title: "Interaction Designer",
      email: "bilal.h@example.com",
      phone: "+92 322 3333333",
      location: "Islamabad, Pakistan",
      matchingScore: 78,
      status: "shortlisted",
      skills: ["Figma", "Adobe XD", "Animation", "Prototyping"],
      experience: "3 years",
      about: "Interaction designer skilled in creating engaging micro-interactions.",
      resume: "bilal_h_resume.pdf",
      profilePicture: "B",
      workExperience: [
        {
          title: "Interaction Designer",
          company: "Digital Studio",
          duration: "2022 - Present",
          description: "Designing interactive experiences and animations."
        }
      ],
      education: [
        {
          degree: "Bachelor of Multimedia Arts",
          institution: "NUST Islamabad",
          year: "2022"
        }
      ],
      certifications: [
        { name: "Advanced Prototyping", issuer: "Interaction Design Foundation", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  5: [
    {
      id: 401,
      name: "Tariq Mehmood",
      title: "Senior DevOps Engineer",
      email: "tariq@example.com",
      phone: "+92 323 1234567",
      location: "Remote",
      matchingScore: 92,
      status: "shortlisted",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
      experience: "6 years",
      about: "Expert DevOps engineer with extensive cloud and containerization experience.",
      resume: "tariq_resume.pdf",
      profilePicture: "T",
      workExperience: [
        {
          title: "Senior DevOps Engineer",
          company: "Cloud Services Ltd",
          duration: "2020 - Present",
          description: "Managing cloud infrastructure and implementing DevOps best practices."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Engineering",
          institution: "NUST Islamabad",
          year: "2018"
        }
      ],
      certifications: [
        { name: "AWS Solutions Architect Professional", issuer: "Amazon", year: "2022" },
        { name: "Certified Kubernetes Administrator", issuer: "CNCF", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 402,
      name: "Sadia Malik",
      title: "DevOps Specialist",
      email: "sadia@example.com",
      phone: "+92 324 8888888",
      location: "Lahore, Pakistan",
      matchingScore: 85,
      status: "shortlisted",
      skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Python"],
      experience: "5 years",
      about: "DevOps specialist with strong automation and scripting skills.",
      resume: "sadia_resume.pdf",
      profilePicture: "S",
      workExperience: [
        {
          title: "DevOps Specialist",
          company: "Tech Infrastructure Co",
          duration: "2020 - Present",
          description: "Automating infrastructure and managing CI/CD pipelines."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "UET Lahore",
          year: "2020"
        }
      ],
      certifications: [
        { name: "AWS DevOps Engineer Professional", issuer: "Amazon", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 403,
      name: "Rizwan Ahmed",
      title: "Cloud Engineer",
      email: "rizwan@example.com",
      phone: "+92 325 5555555",
      location: "Remote",
      matchingScore: 78,
      status: "shortlisted",
      skills: ["AWS", "Docker", "Terraform", "Linux"],
      experience: "4 years",
      about: "Cloud engineer experienced in AWS infrastructure and automation.",
      resume: "rizwan_resume.pdf",
      profilePicture: "R",
      workExperience: [
        {
          title: "Cloud Engineer",
          company: "Enterprise Cloud",
          duration: "2021 - Present",
          description: "Managing AWS infrastructure and implementing IaC."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "FAST-NUCES Islamabad",
          year: "2021"
        }
      ],
      certifications: [
        { name: "AWS Solutions Architect Associate", issuer: "Amazon", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 404,
      name: "Zara Khan",
      title: "DevOps Engineer",
      email: "zara@example.com",
      phone: "+92 326 7777777",
      location: "Karachi, Pakistan",
      matchingScore: 72,
      status: "rejected",
      skills: ["Docker", "Kubernetes", "Git", "Jenkins"],
      experience: "3 years",
      about: "DevOps engineer with good containerization skills but limited AWS experience.",
      resume: "zara_resume.pdf",
      profilePicture: "Z",
      workExperience: [
        {
          title: "DevOps Engineer",
          company: "Software Solutions",
          duration: "2022 - Present",
          description: "Managing containerized applications and CI/CD pipelines."
        }
      ],
      education: [
        {
          degree: "Bachelor of Information Technology",
          institution: "NED University",
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
      id: 405,
      name: "Hamza Yousaf",
      title: "Infrastructure Engineer",
      email: "hamza@example.com",
      phone: "+92 327 3333333",
      location: "Remote",
      matchingScore: 80,
      status: "shortlisted",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Python"],
      experience: "4.5 years",
      about: "Infrastructure engineer with comprehensive DevOps and cloud skills.",
      resume: "hamza_resume.pdf",
      profilePicture: "H",
      workExperience: [
        {
          title: "Infrastructure Engineer",
          company: "Digital Infrastructure",
          duration: "2021 - Present",
          description: "Building and maintaining cloud infrastructure and automation tools."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Engineering",
          institution: "GIKI",
          year: "2020"
        }
      ],
      certifications: [
        { name: "HashiCorp Certified Terraform Associate", issuer: "HashiCorp", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  6: [
    {
      id: 501,
      name: "Nasir Ali",
      title: "Data Analyst",
      email: "nasir@example.com",
      phone: "+92 328 1234567",
      location: "Karachi, Pakistan",
      matchingScore: 79,
      status: "shortlisted",
      skills: ["Python", "SQL", "Excel", "Power BI", "Tableau"],
      experience: "3 years",
      about: "Data analyst with strong analytical skills and visualization expertise.",
      resume: "nasir_resume.pdf",
      profilePicture: "N",
      workExperience: [
        {
          title: "Data Analyst",
          company: "Analytics Corp",
          duration: "2022 - Present",
          description: "Analyzing data and creating dashboards for business insights."
        }
      ],
      education: [
        {
          degree: "Bachelor of Business Administration",
          institution: "IBA Karachi",
          year: "2022"
        }
      ],
      certifications: [
        { name: "Data Analysis with Python", issuer: "IBM", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 502,
      name: "Rabia Ahmed",
      title: "Business Analyst",
      email: "rabia@example.com",
      phone: "+92 329 8888888",
      location: "Karachi, Pakistan",
      matchingScore: 74,
      status: "shortlisted",
      skills: ["SQL", "Excel", "Power BI", "Analytics"],
      experience: "2.5 years",
      about: "Business analyst with data analysis and reporting experience.",
      resume: "rabia_resume.pdf",
      profilePicture: "R",
      workExperience: [
        {
          title: "Business Analyst",
          company: "Business Solutions",
          duration: "2022 - Present",
          description: "Creating reports and analyzing business metrics."
        }
      ],
      education: [
        {
          degree: "Bachelor of Commerce",
          institution: "Karachi University",
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
      id: 503,
      name: "Kamran Malik",
      title: "Data Scientist",
      email: "kamran@example.com",
      phone: "+92 330 5555555",
      location: "Lahore, Pakistan",
      matchingScore: 85,
      status: "shortlisted",
      skills: ["Python", "SQL", "Machine Learning", "Power BI"],
      experience: "3.5 years",
      about: "Data scientist with strong Python and analytics background.",
      resume: "kamran_resume.pdf",
      profilePicture: "K",
      workExperience: [
        {
          title: "Data Scientist",
          company: "Data Tech",
          duration: "2021 - Present",
          description: "Building ML models and analyzing large datasets."
        }
      ],
      education: [
        {
          degree: "Master of Data Science",
          institution: "LUMS",
          year: "2021"
        }
      ],
      certifications: [
        { name: "Machine Learning Specialization", issuer: "Stanford Online", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 504,
      name: "Samina Hassan",
      title: "Junior Data Analyst",
      email: "samina@example.com",
      phone: "+92 331 7777777",
      location: "Karachi, Pakistan",
      matchingScore: 62,
      status: "rejected",
      skills: ["Excel", "SQL", "Power BI"],
      experience: "1.5 years",
      about: "Junior analyst with basic skills but limited Python experience.",
      resume: "samina_resume.pdf",
      profilePicture: "S",
      workExperience: [
        {
          title: "Junior Data Analyst",
          company: "Consulting Firm",
          duration: "2023 - Present",
          description: "Creating reports and basic data analysis."
        }
      ],
      education: [
        {
          degree: "Bachelor of Statistics",
          institution: "Karachi University",
          year: "2023"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 505,
      name: "Waqar Hussain",
      title: "Analytics Specialist",
      email: "waqar@example.com",
      phone: "+92 332 3333333",
      location: "Karachi, Pakistan",
      matchingScore: 76,
      status: "shortlisted",
      skills: ["Python", "SQL", "Excel", "Power BI", "Statistics"],
      experience: "3 years",
      about: "Analytics specialist with comprehensive data analysis toolkit.",
      resume: "waqar_resume.pdf",
      profilePicture: "W",
      workExperience: [
        {
          title: "Analytics Specialist",
          company: "Finance Corp",
          duration: "2022 - Present",
          description: "Performing financial data analysis and reporting."
        }
      ],
      education: [
        {
          degree: "Bachelor of Economics",
          institution: "IBA Karachi",
          year: "2022"
        }
      ],
      certifications: [
        { name: "Power BI Data Analyst", issuer: "Microsoft", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  7: [
    {
      id: 601,
      name: "Asad Malik",
      title: "Senior Mobile Developer",
      email: "asad@example.com",
      phone: "+92 333 1234567",
      location: "Lahore, Pakistan",
      matchingScore: 90,
      status: "shortlisted",
      skills: ["React Native", "Flutter", "Swift", "Kotlin"],
      experience: "5 years",
      about: "Expert mobile developer with cross-platform and native development experience.",
      resume: "asad_resume.pdf",
      profilePicture: "A",
      workExperience: [
        {
          title: "Senior Mobile Developer",
          company: "Mobile Solutions Ltd",
          duration: "2020 - Present",
          description: "Leading mobile app development for iOS and Android."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "LUMS",
          year: "2019"
        }
      ],
      certifications: [
        { name: "iOS Development Professional", issuer: "Apple", year: "2021" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 602,
      name: "Maryam Fatima",
      title: "Flutter Developer",
      email: "maryam@example.com",
      phone: "+92 334 8888888",
      location: "Lahore, Pakistan",
      matchingScore: 83,
      status: "shortlisted",
      skills: ["Flutter", "Dart", "Firebase", "REST APIs"],
      experience: "4 years",
      about: "Flutter specialist with experience in building cross-platform apps.",
      resume: "maryam_resume.pdf",
      profilePicture: "M",
      workExperience: [
        {
          title: "Flutter Developer",
          company: "App Development Co",
          duration: "2021 - Present",
          description: "Developing cross-platform mobile applications with Flutter."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "UET Lahore",
          year: "2021"
        }
      ],
      certifications: [
        { name: "Flutter Development", issuer: "Google", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 603,
      name: "Naveed Hassan",
      title: "React Native Developer",
      email: "naveed@example.com",
      phone: "+92 335 5555555",
      location: "Islamabad, Pakistan",
      matchingScore: 78,
      status: "shortlisted",
      skills: ["React Native", "JavaScript", "Redux", "TypeScript"],
      experience: "3.5 years",
      about: "React Native developer with strong JavaScript fundamentals.",
      resume: "naveed_resume.pdf",
      profilePicture: "N",
      workExperience: [
        {
          title: "React Native Developer",
          company: "Tech Startup",
          duration: "2021 - Present",
          description: "Building mobile apps using React Native."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "FAST-NUCES Islamabad",
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
      id: 604,
      name: "Shazia Khan",
      title: "iOS Developer",
      email: "shazia@example.com",
      phone: "+92 336 7777777",
      location: "Lahore, Pakistan",
      matchingScore: 72,
      status: "rejected",
      skills: ["Swift", "iOS", "Xcode"],
      experience: "3 years",
      about: "iOS specialist but limited experience with cross-platform frameworks.",
      resume: "shazia_resume.pdf",
      profilePicture: "S",
      workExperience: [
        {
          title: "iOS Developer",
          company: "Apple Dev Shop",
          duration: "2022 - Present",
          description: "Developing native iOS applications."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "COMSATS Lahore",
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
      id: 605,
      name: "Talha Ahmed",
      title: "Mobile App Developer",
      email: "talha@example.com",
      phone: "+92 337 3333333",
      location: "Lahore, Pakistan",
      matchingScore: 81,
      status: "shortlisted",
      skills: ["React Native", "Flutter", "JavaScript", "Dart"],
      experience: "4 years",
      about: "Versatile mobile developer proficient in multiple frameworks.",
      resume: "talha_resume.pdf",
      profilePicture: "T",
      workExperience: [
        {
          title: "Mobile App Developer",
          company: "Digital Apps",
          duration: "2021 - Present",
          description: "Developing mobile apps for various clients using React Native and Flutter."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "Punjab University",
          year: "2021"
        }
      ],
      certifications: [
        { name: "React Native Certification", issuer: "Meta", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  8: [
    {
      id: 701,
      name: "Yasir Mehmood",
      title: "Cloud Solutions Architect",
      email: "yasir@example.com",
      phone: "+92 338 1234567",
      location: "Remote",
      matchingScore: 94,
      status: "shortlisted",
      skills: ["AWS", "Azure", "Terraform", "Cloud Security"],
      experience: "8 years",
      about: "Expert cloud architect with extensive multi-cloud experience.",
      resume: "yasir_resume.pdf",
      profilePicture: "Y",
      workExperience: [
        {
          title: "Cloud Solutions Architect",
          company: "Enterprise Cloud Services",
          duration: "2019 - Present",
          description: "Designing and implementing cloud architectures for enterprise clients."
        }
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "NUST Islamabad",
          year: "2017"
        }
      ],
      certifications: [
        { name: "AWS Solutions Architect Professional", issuer: "Amazon", year: "2021" },
        { name: "Azure Solutions Architect Expert", issuer: "Microsoft", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 702,
      name: "Nadia Akhtar",
      title: "Senior Cloud Engineer",
      email: "nadia@example.com",
      phone: "+92 339 8888888",
      location: "Karachi, Pakistan",
      matchingScore: 88,
      status: "shortlisted",
      skills: ["AWS", "Terraform", "CloudFormation", "Python"],
      experience: "7 years",
      about: "Senior cloud engineer specializing in AWS infrastructure automation.",
      resume: "nadia_resume.pdf",
      profilePicture: "N",
      workExperience: [
        {
          title: "Senior Cloud Engineer",
          company: "Cloud Infrastructure Co",
          duration: "2019 - Present",
          description: "Managing large-scale AWS deployments and automation."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Engineering",
          institution: "NED University",
          year: "2018"
        }
      ],
      certifications: [
        { name: "AWS DevOps Engineer Professional", issuer: "Amazon", year: "2021" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 703,
      name: "Kashif Ali",
      title: "Cloud Architect",
      email: "kashif@example.com",
      phone: "+92 340 5555555",
      location: "Remote",
      matchingScore: 85,
      status: "shortlisted",
      skills: ["Azure", "AWS", "Terraform", "DevOps"],
      experience: "6.5 years",
      about: "Cloud architect with strong multi-cloud and DevOps background.",
      resume: "kashif_resume.pdf",
      profilePicture: "K",
      workExperience: [
        {
          title: "Cloud Architect",
          company: "Digital Cloud Solutions",
          duration: "2020 - Present",
          description: "Architecting cloud solutions and leading migration projects."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "FAST-NUCES Karachi",
          year: "2018"
        }
      ],
      certifications: [
        { name: "Azure Solutions Architect", issuer: "Microsoft", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 704,
      name: "Lubna Hassan",
      title: "Infrastructure Architect",
      email: "lubna@example.com",
      phone: "+92 341 7777777",
      location: "Lahore, Pakistan",
      matchingScore: 79,
      status: "rejected",
      skills: ["AWS", "Terraform", "Kubernetes"],
      experience: "5 years",
      about: "Infrastructure architect with good AWS skills but limited Azure experience.",
      resume: "lubna_resume.pdf",
      profilePicture: "L",
      workExperience: [
        {
          title: "Infrastructure Architect",
          company: "Tech Infrastructure",
          duration: "2020 - Present",
          description: "Designing infrastructure solutions on AWS."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "UET Lahore",
          year: "2020"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 705,
      name: "Qasim Raza",
      title: "Principal Cloud Architect",
      email: "qasim@example.com",
      phone: "+92 342 3333333",
      location: "Remote",
      matchingScore: 91,
      status: "shortlisted",
      skills: ["AWS", "Azure", "Terraform", "Security", "Cost Optimization"],
      experience: "9 years",
      about: "Principal architect with comprehensive cloud expertise and leadership skills.",
      resume: "qasim_resume.pdf",
      profilePicture: "Q",
      workExperience: [
        {
          title: "Principal Cloud Architect",
          company: "Global Cloud Services",
          duration: "2018 - Present",
          description: "Leading cloud architecture initiatives and mentoring teams."
        }
      ],
      education: [
        {
          degree: "Master of Software Engineering",
          institution: "LUMS",
          year: "2016"
        }
      ],
      certifications: [
        { name: "AWS Solutions Architect Professional", issuer: "Amazon", year: "2020" },
        { name: "Azure Solutions Architect Expert", issuer: "Microsoft", year: "2021" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  9: [
    {
      id: 801,
      name: "Adnan Khan",
      title: "Senior QA Engineer",
      email: "adnan@example.com",
      phone: "+92 343 1234567",
      location: "Karachi, Pakistan",
      matchingScore: 82,
      status: "shortlisted",
      skills: ["Selenium", "TestNG", "JIRA", "Automation", "API Testing"],
      experience: "4 years",
      about: "Senior QA engineer with comprehensive testing and automation expertise.",
      resume: "adnan_resume.pdf",
      profilePicture: "A",
      workExperience: [
        {
          title: "Senior QA Engineer",
          company: "Quality Assurance Corp",
          duration: "2021 - Present",
          description: "Leading QA automation and testing initiatives."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "IBA Karachi",
          year: "2021"
        }
      ],
      certifications: [
        { name: "ISTQB Advanced Test Automation", issuer: "ISTQB", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 802,
      name: "Farah Ahmed",
      title: "Test Automation Engineer",
      email: "farah@example.com",
      phone: "+92 344 8888888",
      location: "Karachi, Pakistan",
      matchingScore: 76,
      status: "shortlisted",
      skills: ["Selenium", "Java", "TestNG", "JIRA"],
      experience: "3 years",
      about: "Automation engineer focused on building robust test frameworks.",
      resume: "farah_resume.pdf",
      profilePicture: "F",
      workExperience: [
        {
          title: "Test Automation Engineer",
          company: "Software Testing Solutions",
          duration: "2022 - Present",
          description: "Developing automated test suites and frameworks."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "NED University",
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
      id: 803,
      name: "Irfan Malik",
      title: "QA Analyst",
      email: "irfan@example.com",
      phone: "+92 345 5555555",
      location: "Lahore, Pakistan",
      matchingScore: 71,
      status: "shortlisted",
      skills: ["Manual Testing", "Selenium", "JIRA", "SQL"],
      experience: "2.5 years",
      about: "QA analyst with both manual and automation testing experience.",
      resume: "irfan_resume.pdf",
      profilePicture: "I",
      workExperience: [
        {
          title: "QA Analyst",
          company: "Tech QA Services",
          duration: "2022 - Present",
          description: "Performing manual and automated testing."
        }
      ],
      education: [
        {
          degree: "Bachelor of Information Technology",
          institution: "Punjab University",
          year: "2022"
        }
      ],
      certifications: [
        { name: "ISTQB Foundation Level", issuer: "ISTQB", year: "2023" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 804,
      name: "Saima Hassan",
      title: "Manual QA Tester",
      email: "saima@example.com",
      phone: "+92 346 7777777",
      location: "Karachi, Pakistan",
      matchingScore: 58,
      status: "rejected",
      skills: ["Manual Testing", "JIRA", "Test Cases"],
      experience: "2 years",
      about: "Manual tester with limited automation experience.",
      resume: "saima_resume.pdf",
      profilePicture: "S",
      workExperience: [
        {
          title: "Manual QA Tester",
          company: "Testing Solutions",
          duration: "2023 - Present",
          description: "Performing manual testing and writing test cases."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "Karachi University",
          year: "2023"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 805,
      name: "Waseem Ahmed",
      title: "QA Engineer",
      email: "waseem@example.com",
      phone: "+92 347 3333333",
      location: "Karachi, Pakistan",
      matchingScore: 79,
      status: "shortlisted",
      skills: ["Selenium", "TestNG", "JIRA", "Python", "API Testing"],
      experience: "3.5 years",
      about: "QA engineer with strong automation and API testing skills.",
      resume: "waseem_resume.pdf",
      profilePicture: "W",
      workExperience: [
        {
          title: "QA Engineer",
          company: "Quality Tech",
          duration: "2021 - Present",
          description: "Automating tests and ensuring software quality."
        }
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          institution: "FAST-NUCES Karachi",
          year: "2021"
        }
      ],
      certifications: [
        { name: "Selenium WebDriver Certification", issuer: "Udemy", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    }
  ],
  10: [
    {
      id: 901,
      name: "Imtiaz Hassan",
      title: "Senior Product Manager",
      email: "imtiaz@example.com",
      phone: "+92 348 1234567",
      location: "Lahore, Pakistan",
      matchingScore: 89,
      status: "shortlisted",
      skills: ["Product Strategy", "Analytics", "Leadership", "Roadmapping"],
      experience: "6 years",
      about: "Experienced product manager with proven track record of successful launches.",
      resume: "imtiaz_resume.pdf",
      profilePicture: "I",
      workExperience: [
        {
          title: "Senior Product Manager",
          company: "Tech Products Inc",
          duration: "2020 - Present",
          description: "Leading product strategy and managing cross-functional teams."
        }
      ],
      education: [
        {
          degree: "MBA",
          institution: "LUMS",
          year: "2019"
        }
      ],
      certifications: [
        { name: "Product Management Professional", issuer: "Product School", year: "2021" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 902,
      name: "Kiran Malik",
      title: "Product Manager",
      email: "kiran@example.com",
      phone: "+92 349 8888888",
      location: "Lahore, Pakistan",
      matchingScore: 83,
      status: "shortlisted",
      skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
      experience: "4.5 years",
      about: "Product manager with strong analytical and stakeholder management skills.",
      resume: "kiran_resume.pdf",
      profilePicture: "K",
      workExperience: [
        {
          title: "Product Manager",
          company: "Digital Products Co",
          duration: "2021 - Present",
          description: "Managing product lifecycle and coordinating with teams."
        }
      ],
      education: [
        {
          degree: "Bachelor of Business Administration",
          institution: "IBA Lahore",
          year: "2020"
        }
      ],
      certifications: [
        { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 903,
      name: "Owais Ahmed",
      title: "Technical Product Manager",
      email: "owais@example.com",
      phone: "+92 350 5555555",
      location: "Islamabad, Pakistan",
      matchingScore: 86,
      status: "shortlisted",
      skills: ["Product Strategy", "Technical Analysis", "Leadership", "SQL"],
      experience: "5 years",
      about: "Technical PM with engineering background and strong leadership skills.",
      resume: "owais_resume.pdf",
      profilePicture: "O",
      workExperience: [
        {
          title: "Technical Product Manager",
          company: "Software Solutions Ltd",
          duration: "2020 - Present",
          description: "Bridging technical and business requirements for product success."
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "FAST-NUCES Islamabad",
          year: "2019"
        }
      ],
      certifications: [
        { name: "Technical Product Management", issuer: "Pragmatic Institute", year: "2021" }
      ],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 904,
      name: "Rida Khan",
      title: "Associate Product Manager",
      email: "rida@example.com",
      phone: "+92 351 7777777",
      location: "Lahore, Pakistan",
      matchingScore: 68,
      status: "rejected",
      skills: ["Product Strategy", "Analytics", "Communication"],
      experience: "2 years",
      about: "Junior PM with good potential but limited senior-level experience.",
      resume: "rida_resume.pdf",
      profilePicture: "R",
      workExperience: [
        {
          title: "Associate Product Manager",
          company: "Startup Products",
          duration: "2023 - Present",
          description: "Supporting product initiatives and learning product management."
        }
      ],
      education: [
        {
          degree: "Bachelor of Business Administration",
          institution: "LUMS",
          year: "2023"
        }
      ],
      certifications: [],
      languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Urdu", proficiency: "Native" }
      ]
    },
    {
      id: 905,
      name: "Tanveer Hassan",
      title: "Product Manager",
      email: "tanveer@example.com",
      phone: "+92 352 3333333",
      location: "Lahore, Pakistan",
      matchingScore: 80,
      status: "shortlisted",
      skills: ["Product Strategy", "Analytics", "Leadership", "Market Research"],
      experience: "5 years",
      about: "Product manager with comprehensive experience in B2B and B2C products.",
      resume: "tanveer_resume.pdf",
      profilePicture: "T",
      workExperience: [
        {
          title: "Product Manager",
          company: "Enterprise Software",
          duration: "2020 - Present",
          description: "Managing enterprise product portfolio and driving growth."
        }
      ],
      education: [
        {
          degree: "MBA",
          institution: "IBA Karachi",
          year: "2020"
        }
      ],
      certifications: [
        { name: "Product Management Certification", issuer: "General Assembly", year: "2021" }
      ],
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
  const jobId = parseInt(searchParams.get("jobId"));
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
    router.push(`/employer/view-job-post?jobId=${jobId}`);
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
              {/* Page Header */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium mb-6 transition-colors px-3 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to View Job Post</span>
                </button>

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
                                  : "bg-red-50 border-red-100"
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
                                  className="font-semibold text-sm text-blue-700 px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-200 active:text-blue-800 transition-all focus:outline-none whitespace-nowrap"
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
