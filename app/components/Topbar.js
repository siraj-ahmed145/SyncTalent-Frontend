"use client";
import { Bell, MessageCircleMore, Search, Settings, User, LogOut, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Topbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

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
  
  // Determine if user is candidate or employer based on pathname
  const isCandidate = pathname.startsWith('/candidate');
  const isEmployer = pathname.startsWith('/employer');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-8 bg-white/80 backdrop-blur z-30 shadow-sm sticky top-0">
      {/* Left side - Empty for spacing */}
      <div className="flex items-center gap-3">
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
      <div className="relative">
        <button 
          ref={profileButtonRef}
          onClick={toggleDropdown}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <circle cx="32" cy="32" r="32" fill="#DCE1E8" />
              <circle cx="32" cy="24" r="13" fill="#5B6673" />
              <ellipse cx="32" cy="58" rx="22" ry="18" fill="#5B6673" />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-[#2845B8] via-[#3B4DBF] to-[#6B46C1] rounded-3xl shadow-2xl overflow-hidden z-50 border border-blue-500/20"
          >
            {/* Profile Header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white/20">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle cx="32" cy="32" r="32" fill="#DCE1E8" />
                    <circle cx="32" cy="24" r="13" fill="#5B6673" />
                    <ellipse cx="32" cy="58" rx="22" ry="18" fill="#5B6673" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-base">Antoine</h3>
                  </div>
                  <p className="text-blue-200 text-sm mt-0.5">antoine@domain.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* My Profile / Company Profile */}
              {isCandidate ? (
                <Link href="/candidate/my-profile" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">My Profile</span>
                </Link>
              ) : isEmployer ? (
                <Link href="/employer/my-profile" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Company Profile</span>
                </Link>
              ) : (
                <button className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">My Profile</span>
                </button>
              )}

              {/* Account Settings */}
              <button className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 flex items-center justify-center">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-base font-semibold">Settings</span>
              </button>

              {/* Divider */}
              <div className="my-2 mx-5 border-t border-white/10"></div>

              {/* Logout */}
              {isCandidate ? (
                <Link href="/candidate/login" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Sign Out</span>
                </Link>
              ) : isEmployer ? (
                <Link href="/employer/login" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Sign Out</span>
                </Link>
              ) : (
                <button className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
