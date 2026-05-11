"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Eye, EyeOff, X, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * ChangePasswordModal
 *
 * Props:
 *  - isOpen       {boolean}  – controls visibility
 *  - onClose      {function} – called when modal should close
 *  - apiEndpoint  {string}   – full URL to the update-password endpoint
 *                              e.g. EMPLOYER_UPDATE_PASSWORD_API or CANDIDATE_UPDATE_PASSWORD_API
 *  - darkMode     {boolean}  – inherit dark-mode state from parent page
 */
export default function ChangePasswordModal({ isOpen, onClose, apiEndpoint, darkMode = false }) {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showFields, setShowFields] = useState({
    old_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  const [status, setStatus] = useState({ type: null, message: "" }); // type: "error" | "success" | null
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const firstInputRef = useRef(null);

  // Focus first input when opened
  useEffect(() => {
    if (isOpen) {
      setStatus({ type: null, message: "" });
      setFormData({ old_password: "", new_password: "", confirm_new_password: "" });
      setClosing(false);
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen && !loading) handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading]);

  const handleClose = () => {
    if (loading) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.type === "error") setStatus({ type: null, message: "" });
  };

  const toggleShow = (field) => {
    setShowFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    if (!formData.old_password.trim())
      return "Please enter your current password.";
    if (!formData.new_password.trim())
      return "Please enter a new password.";
    if (formData.new_password.length < 6)
      return "New password must be at least 6 characters.";
    if (formData.new_password === formData.old_password)
      return "New password cannot be the same as your current password.";
    if (formData.new_password !== formData.confirm_new_password)
      return "New password and confirmation do not match.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token");

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
          confirm_new_password: formData.confirm_new_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to update password.");
      }

      setStatus({ type: "success", message: "Password updated successfully!" });
      setFormData({ old_password: "", new_password: "", confirm_new_password: "" });

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ------- Field config -------
  const fields = [
    { name: "old_password", label: "Current Password", placeholder: "Enter your current password" },
    { name: "new_password", label: "New Password", placeholder: "Enter your new password" },
    { name: "confirm_new_password", label: "Confirm New Password", placeholder: "Re-enter your new password" },
  ];

  const dm = darkMode;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      />

      {/* ── Modal panel ── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto w-full max-w-md rounded-2xl shadow-2xl transition-all duration-200 ${
            closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } ${dm ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
          style={{ transformOrigin: "center" }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 pt-6 pb-4 border-b ${
              dm ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
              >
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className={`text-lg font-bold tracking-tight ${
                    dm ? "text-white" : "text-gray-900"
                  }`}
                >
                  Change Password
                </h2>
                <p className={`text-xs ${dm ? "text-gray-400" : "text-gray-500"}`}>
                  Keep your account secure
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                dm
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              } disabled:opacity-40`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* Status banner */}
            {status.type && (
              <div
                className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${
                  status.type === "success"
                    ? dm
                      ? "bg-green-900/30 border border-green-700/40 text-green-300"
                      : "bg-green-50 border border-green-200 text-green-700"
                    : dm
                    ? "bg-red-900/30 border border-red-700/40 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Fields */}
            {fields.map((field, idx) => (
              <div key={field.name}>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    dm ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {field.label}
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      dm ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <Lock size={15} />
                  </div>
                  <input
                    ref={idx === 0 ? firstInputRef : undefined}
                    type={showFields[field.name] ? "text" : "password"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    disabled={loading || status.type === "success"}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm outline-none transition-all
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        dm
                          ? "bg-gray-700/70 border-gray-600 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => toggleShow(field.name)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      dm
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showFields[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className={`flex gap-3 px-6 pb-6 pt-2`}
          >
            <button
              onClick={handleSubmit}
              disabled={loading || status.type === "success"}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:brightness-110 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Updating…
                </span>
              ) : status.type === "success" ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={15} /> Done!
                </span>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all
                disabled:opacity-40 active:scale-[0.98]
                ${
                  dm
                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}