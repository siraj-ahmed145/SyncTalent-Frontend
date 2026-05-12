"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { setSession, isUserLoggedIn } from "../../../utils/session";
import { LOGIN_API } from "../../../routes/candidate/login";
import Loader from "../../../utils/loader";
import MessagePopup, { POPUP_TIMEOUT } from "../../components/MessagePopup";

export default function CandidateLogin() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepLoggedIn: false,
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Show popup helper
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
  };

  // Auto hide popup
  useEffect(() => {
    if (!popup.show) return;
    const t = setTimeout(
      () => setPopup((prev) => ({ ...prev, show: false })),
      POPUP_TIMEOUT
    );
    return () => clearTimeout(t);
  }, [popup.show]);

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && isUserLoggedIn()) {
      router.push("/candidate/my-profile");
    }
  }, [router]);

  // ✅ FIXED: replaced useSearchParams with window API (Turbopack-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("loggedOut") === "1") {
      showPopup("Signed out successfully", "success");
      router.replace("/candidate/login");
    }
  }, [router]);

  // Signup success message from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const flag = localStorage.getItem("signup_success_candidate");
    if (flag === "1") {
      localStorage.removeItem("signup_success_candidate");
      setPopup({
        show: true,
        message: "Account created successfully. Please sign in.",
        type: "success",
      });
    }
  }, []);

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        const msg = "Please fill in all fields";
        setError(msg);
        showPopup(msg, "error");
        setLoading(false);
        return;
      }

      if (isUserLoggedIn()) {
        const msg = "Another user is already logged in. Please logout first.";
        setError(msg);
        showPopup(msg, "error");
        setLoading(false);
        return;
      }

      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data.message || "Login failed. Please check your credentials.";
        setError(msg);
        showPopup(msg, "error");
        setLoading(false);
        return;
      }

      const token = data?.access_token;

      if (token && data?.candidiate_id) {
        setSession(data, token, 1440);

        if (typeof window !== "undefined") {
          localStorage.setItem("login_success_candidate", "1");
        }

        router.push("/candidate/my-profile");
      } else {
        const msg = "Invalid response from server.";
        setError(msg);
        showPopup(msg, "error");
        setLoading(false);
      }
    } catch (err) {
      const msg = err.message || "Login failed. Please check your credentials.";
      setError(msg);
      showPopup(msg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <MessagePopup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      {loading && <Loader text="Signing in..." />}

      {/* Left Side */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0f1729] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-xl"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl pr-12"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/candidate/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <Image
            src="/icon.png"
            alt="logo"
            width={80}
            height={80}
          />
          <h2 className="text-4xl font-bold mt-4">SyncTalent</h2>
          <p>Sync Your Skills with Opportunities</p>
        </div>
      </div>
    </div>
  );
}