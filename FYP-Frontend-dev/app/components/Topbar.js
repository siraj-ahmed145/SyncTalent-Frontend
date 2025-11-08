"use client";
import { Bell, Mail } from "lucide-react";
import Image from "next/image";

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between py-3 px-4 md:px-8 bg-white/80 backdrop-blur z-30 shadow-sm sticky top-0">
      {/* Search bar */}
      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder="Search something here..."
          className="w-full rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-400 text-sm bg-gray-50"
        />
      </div>
      {/* Centered actions */}
      <div className="flex items-center gap-4 ml-4 md:ml-10">
        <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Mail size={22} className="text-gray-700" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Bell size={22} className="text-gray-700" />
        </button>
      </div>
      {/* Profile */}
      <div className="flex items-center ml-4 md:ml-8">
        <span className="block w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-blue-600">
          {/* Dummy profile SVG */}
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <circle cx="20" cy="20" r="20" fill="#d1d5db"/>
            <ellipse cx="20" cy="15" rx="6" ry="6" fill="#a3a3a3"/>
            <rect x="9" y="26" width="22" height="7" rx="3.5" fill="#a3a3a3"/>
          </svg>
        </span>
      </div>
    </header>
  );
}
