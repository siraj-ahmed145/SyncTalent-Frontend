"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Moon,
  Sun,
  Trash2,
  AlertTriangle,
  Settings,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import MessagePopup, {
  POPUP_TIMEOUT,
} from "../../components/MessagePopup";
import Loader from "../../../utils/loader";

import {
  isUserLoggedIn,
  clearSession,
} from "../../../utils/session";

import ChangePasswordModal from "../../components/updatePassword";

import {
  CANDIDATE_UPDATE_PASSWORD_API,
} from "../../../routes/candidate/updatepassword";
import {
  DELETE_CANDIDATE_PROFILE_API,
} from "../../../routes/candidate/deleteProfile";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ─────────────────────────────
  // Authentication Check
  // ─────────────────────────────
  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/candidate/login");
    } else {
      setLoading(false);

      // Load dark mode preference
      const savedDarkMode =
        localStorage.getItem("darkMode") === "true";

      setDarkMode(savedDarkMode);
      applyDarkMode(savedDarkMode);
    }
  }, [router]);

  // ─────────────────────────────
  // Apply Dark Mode
  // ─────────────────────────────
  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ─────────────────────────────
  // Toggle Dark Mode
  // ─────────────────────────────
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    localStorage.setItem("darkMode", newDarkMode);

    applyDarkMode(newDarkMode);

    setPopup({
      show: true,
      message: `Dark mode ${
        newDarkMode ? "enabled" : "disabled"
      }`,
      type: "success",
    });

    setTimeout(() => {
      setPopup({
        show: false,
        message: "",
        type: "success",
      });
    }, POPUP_TIMEOUT);
  };

  // ─────────────────────────────
  // Delete Profile
  // ─────────────────────────────
  const handleDeleteProfile = async () => {
    setSaving(true);

    try {
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      const response = await fetch(
        DELETE_CANDIDATE_PROFILE_API,
        {
          method: "DELETE",
          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete profile"
        );
      }

      clearSession();

      setPopup({
        show: true,
        message:
          "Your account and all data were permanently deleted. Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/candidate/login");
      }, 1500);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.message || "Failed to delete profile",
        type: "error",
      });

      setTimeout(() => {
        setPopup({
          show: false,
          message: "",
          type: "success",
        });
      }, POPUP_TIMEOUT);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // ─────────────────────────────
  // Loader
  // ─────────────────────────────
  if (loading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-white"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        active="Settings"
        type="candidate"
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 ml-20">
        <Topbar />

        <div className="flex justify-center min-h-[calc(100vh-80px)]">
          <div
            className={`p-4 md:p-8 max-w-4xl w-full ${
              darkMode
                ? "bg-gray-900"
                : "bg-gray-50"
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-lg p-2 md:p-3 flex-shrink-0">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-3xl md:text-4xl font-bold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Settings
                  </h1>
                  <p
                    className={`mt-2 ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Manage your account preferences and
                    security
                  </p>
                </div>
              </div>
            </div>

            {/* Popup */}
            {popup.show && (
              <MessagePopup
                message={popup.message}
                type={popup.type}
              />
            )}

            {/* Settings Sections */}
            <div className="space-y-6">

              {/* ───────────────────────────── */}
              {/* Dark Mode */}
              {/* ───────────────────────────── */}
              <div
                className={`rounded-2xl p-6 border transition-colors ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        darkMode
                          ? "bg-gray-700"
                          : "bg-blue-50"
                      }`}
                    >
                      {darkMode ? (
                        <Moon className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Sun className="w-6 h-6 text-blue-600" />
                      )}
                    </div>

                    <div>
                      <h2
                        className={`text-lg font-semibold ${
                          darkMode
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Dark Mode
                      </h2>

                      <p
                        className={`text-sm ${
                          darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        Toggle dark mode for easier
                        viewing
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={handleDarkModeToggle}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      darkMode
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 bg-white rounded-full absolute top-0.5 transition-transform ${
                        darkMode
                          ? "translate-x-7"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* ───────────────────────────── */}
              {/* Change Password */}
              {/* ───────────────────────────── */}
              <div
                className={`rounded-2xl p-6 border transition-colors ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode
                        ? "bg-gray-700"
                        : "bg-blue-50"
                    }`}
                  >
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Change Password
                    </h2>

                    <p
                      className={`text-sm ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      Update your account password
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowPasswordModal(true)
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                >
                  Change Password
                </button>
              </div>

              {/* ───────────────────────────── */}
              {/* Delete Profile */}
              {/* ───────────────────────────── */}
              <div
                className={`rounded-2xl p-6 border transition-colors ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode
                        ? "bg-red-900/30"
                        : "bg-red-50"
                    }`}
                  >
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>

                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Delete Profile
                    </h2>

                    <p
                      className={`text-sm ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      Permanently delete your account
                      and all data
                    </p>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() =>
                      setShowDeleteConfirm(true)
                    }
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
                  >
                    Delete Profile
                  </button>
                ) : (
                  <div
                    className={`rounded-lg p-4 mb-4 ${
                      darkMode
                        ? "bg-red-900/20 border border-red-900/30"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

                      <div>
                        <h3
                          className={`font-semibold ${
                            darkMode
                              ? "text-red-400"
                              : "text-red-900"
                          }`}
                        >
                          Are you sure?
                        </h3>

                        <p
                          className={`text-sm mt-1 ${
                            darkMode
                              ? "text-red-300/80"
                              : "text-red-800/80"
                          }`}
                        >
                          This action cannot be undone.
                          Your account and all your data will be
                          permanently deleted.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteProfile}
                        disabled={saving}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-all font-medium"
                      >
                        {saving
                          ? "Deleting..."
                          : "Yes, Delete Profile"}
                      </button>

                      <button
                        onClick={() =>
                          setShowDeleteConfirm(false)
                        }
                        className={`px-6 py-2.5 rounded-lg border transition-all font-medium ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────────────────────── */}
      {/* Change Password Modal */}
      {/* ───────────────────────────── */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() =>
          setShowPasswordModal(false)
        }
        apiEndpoint={
          CANDIDATE_UPDATE_PASSWORD_API
        }
        darkMode={darkMode}
      />
    </div>
  );
}