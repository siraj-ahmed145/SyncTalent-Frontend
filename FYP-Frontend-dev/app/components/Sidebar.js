"use client";
import Link from "next/link";
import { LayoutGrid, Search, Briefcase, BarChart } from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Search Job", icon: Search, href: "/search-job" },
  { label: "Applications", icon: Briefcase, href: "/applications" },
  { label: "Statistics", icon: BarChart, href: "/statistics" },
];

export default function Sidebar({ active = "Dashboard" }) {
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
