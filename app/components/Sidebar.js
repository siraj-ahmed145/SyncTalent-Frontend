"use client";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Search, Briefcase, BarChart, FileText, Users, Sparkles, Bookmark, FileCheck } from "lucide-react";

// Candidate navigation links
const candidateNavLinks = [
  { label: "Search Job", icon: Search, href: "/candidate/job-search" },
  { label: "Job Applications", icon: FileCheck, href: "/candidate/job-applications" },
  { label: "Job Recommendations", icon: Sparkles, href: "/candidate/job-recommendations" },
  { label: "Saved Jobs", icon: Bookmark, href: "/candidate/saved-jobs" },
];

// Employer navigation links
const employerNavLinks = [
  { label: "Dashboard", icon: LayoutGrid, href: "/employer/dashboard" },
  { label: "Create Job Post", icon: FileText, href: "/employer/create-job-post" },
];

export default function Sidebar({ active = "Dashboard", type = "candidate" }) {
  // Select navigation links based on type
  const navLinks = type === "employer" ? employerNavLinks : candidateNavLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col items-center md:items-stretch z-40 transition-all overflow-y-auto">
      {/* SyncTalent Header */}
      <div className="flex items-center justify-center gap-2 md:gap-3 px-2 md:px-6 py-4 border-b border-white/10">
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
          <Image
            src="/Icon.png"
            alt="SyncTalent Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-lg md:text-xl font-bold text-white">
          SyncTalent
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2 pt-4 md:pt-4 px-0 md:px-0 pb-6">
        {navLinks.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`group flex items-center justify-start gap-4 px-4 md:px-8 py-3 rounded-none md:rounded-2xl text-white text-base font-medium hover:bg-white/10 transition-colors ${
              active === label ? "bg-white/10" : ""
            }`}
          >
            <Icon size={24} className="shrink-0" strokeWidth={2} />
            <span className="hidden md:inline-block align-middle leading-tight whitespace-nowrap">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
