"use client";
import { Settings, User, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { clearSession, isUserLoggedIn } from "../../utils/session";
import { clearEmployerSession, isEmployerLoggedIn } from "../../utils/employerSession";
import Loader from "../../utils/loader";
import { GET_CANDIDATE_PROFILE_API } from "../../routes/candidate/getCandidateProfile";
import { GET_EMPLOYER_PROFILE_API } from "../../routes/employer/employerProfile";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [profileHeaderName, setProfileHeaderName] = useState("");
  const [profileHeaderEmail, setProfileHeaderEmail] = useState("");
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleSignOut = () => {
    setSignOutLoading(true);
    setIsDropdownOpen(false);
    if (pathname.startsWith("/candidate")) {
      clearSession();
      router.push("/candidate/login?loggedOut=1");
    } else if (pathname.startsWith("/employer")) {
      clearEmployerSession();
      router.push("/employer/login?loggedOut=1");
    } else {
      clearSession();
      clearEmployerSession();
      router.push("/");
    }
  };

  const isCandidate = pathname.startsWith("/candidate");
  const isEmployer = pathname.startsWith("/employer");

  useEffect(() => {
    setProfileHeaderName("");
    setProfileHeaderEmail("");
  }, [isCandidate, isEmployer]);

  useEffect(() => {
    if (!isDropdownOpen || typeof window === "undefined") return;

    const canFetchCandidate = isCandidate && isUserLoggedIn();
    const canFetchEmployer = isEmployer && isEmployerLoggedIn();
    if (!canFetchCandidate && !canFetchEmployer) {
      setProfileHeaderName("");
      setProfileHeaderEmail("");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setProfileHeaderName("");
      setProfileHeaderEmail("");
      return;
    }

    const url = canFetchCandidate ? GET_CANDIDATE_PROFILE_API : GET_EMPLOYER_PROFILE_API;
    if (!url || String(url).includes("undefined")) {
      setProfileHeaderName("");
      setProfileHeaderEmail("");
      return;
    }

    const controller = new AbortController();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    (async () => {
      try {
        const res = await fetch(url, { headers, signal: controller.signal });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          setProfileHeaderName("");
          setProfileHeaderEmail("");
          return;
        }
        const rawName = canFetchCandidate
          ? data.full_name ?? ""
          : data.company_name ?? "";
        const rawEmail = data.email ?? "";
        setProfileHeaderName(String(rawName).trim());
        setProfileHeaderEmail(String(rawEmail).trim());
      } catch (e) {
        if (e?.name !== "AbortError") {
          setProfileHeaderName("");
          setProfileHeaderEmail("");
        }
      }
    })();

    return () => controller.abort();
  }, [isDropdownOpen, isCandidate, isEmployer]);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {signOutLoading && <Loader text="Signing out..." />}
      <header className="w-full flex items-center justify-end px-4 md:px-8 bg-white dark:bg-[#0f1729] z-30 sticky top-0 border-b border-gray-200 dark:border-gray-700/60 shadow-[0_4px_20px_0_rgba(99,102,241,0.15)] dark:shadow-[0_4px_24px_0_rgba(0,0,0,0.6)]" style={{ height: "73px" }}>

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
                  <div className="flex-1 flex items-center">
                    <div>
                      {profileHeaderName ? (
                        <h3 className="text-white font-semibold text-base">{profileHeaderName}</h3>
                      ) : null}
                      {profileHeaderEmail ? (
                        <p className="text-blue-200 text-sm mt-0.5">{profileHeaderEmail}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
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

                {isCandidate ? (
                  <Link href="/candidate/settings" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-base font-semibold">Settings</span>
                  </Link>
                ) : isEmployer ? (
                  <Link href="/employer/settings" className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-base font-semibold">Settings</span>
                  </Link>
                ) : (
                  <button className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-base font-semibold">Settings</span>
                  </button>
                )}

                <div className="my-2 mx-5 border-t border-white/10"></div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full px-5 py-2.5 flex items-center gap-3 text-white hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-9 h-9 flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}