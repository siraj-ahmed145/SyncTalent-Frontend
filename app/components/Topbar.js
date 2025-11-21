"use client";
import { Bell, MessageCircleMore, Menu, Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  // Function to get page name from pathname
  const getPageName = (path) => {
    // Remove leading slash and split by /
    const segments = path.split('/').filter(Boolean);
    
    // If no segments (root path), return Dashboard
    if (segments.length === 0) return "Dashboard";
    
    // Get the last segment (actual page)
    const lastSegment = segments[segments.length - 1];
    
    // Convert kebab-case or snake_case to Title Case
    const pageName = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return pageName;
  };

  const currentPage = getPageName(pathname);

  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-8 bg-white/80 backdrop-blur z-30 shadow-sm sticky top-0">
      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-3">
        <button className="p-2 flex items-center justify-center">
          <Menu size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{currentPage}</h1>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-md mx-4 md:mx-8 relative">
        <input
          type="text"
          placeholder="Search something here..."
          className="w-full rounded-full border border-gray-200 px-5 py-2.5 pr-12 focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-600 placeholder:text-gray-400"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Search size={20} />
        </button>
      </div>

      {/* Center - Notification Icons */}
      <div className="flex items-center gap-3 md:gap-4 mx-4 md:mx-6">
        {/* Message Icon with Badge */}
        <button className="relative p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <MessageCircleMore size={20} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            4
          </span>
        </button>

        {/* Notification Icon with Badge */}
        <button className="relative p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </button>
      </div>

      {/* Right side - Profile */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
          {/* Dummy profile SVG */}
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <circle cx="20" cy="20" r="20" fill="#e5e7eb"/>
            <ellipse cx="20" cy="15" rx="6" ry="6" fill="#9ca3af"/>
            <rect x="9" y="26" width="22" height="7" rx="3.5" fill="#9ca3af"/>
          </svg>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Ogle Dink</p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">Super Admin</p>
        </div>
      </div>
    </header>
  );
}
