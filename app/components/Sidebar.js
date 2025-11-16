"use client";
import Link from "next/link";
import { LayoutGrid, Search, Briefcase, BarChart, FileText, Users } from "lucide-react";

// Candidate navigation links
const candidateNavLinks = [
  { label: "Dashboard", icon: LayoutGrid, href: "/candidate/dashboard" },
  { label: "Search Job", icon: Search, href: "/candidate/job-search" },
  { label: "Applications", icon: Briefcase, href: "/candidate/applications" },
  { label: "Statistics", icon: BarChart, href: "/candidate/statistics" },
];

// Employer navigation links
const employerNavLinks = [
  { label: "Dashboard", icon: LayoutGrid, href: "/employer/dashboard" },
  { label: "Post Job", icon: FileText, href: "/employer/job-post" },
  { label: "Candidates", icon: Users, href: "/employer/candidates" },
  { label: "Statistics", icon: BarChart, href: "/employer/statistics" },
];

export default function Sidebar({ active = "Dashboard", type = "candidate" }) {
  // Select navigation links based on type
  const navLinks = type === "employer" ? employerNavLinks : candidateNavLinks;

  return (
    <aside className="fixed md:relative left-0 top-0 h-full md:h-screen w-20 md:w-64 bg-linear-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col items-center md:items-stretch py-6 z-40 transition-all">
      <nav className="flex-1 flex flex-col gap-2 mt-8 md:mt-0">
        {navLinks.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`group flex items-center justify-center md:justify-start gap-4 px-4 py-3 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors ${
              active === label ? "bg-white/10" : ""
            }`}
          >
            <Icon size={22} className="shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
