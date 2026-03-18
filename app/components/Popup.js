"use client";

import { CheckCircle, XCircle } from "lucide-react";

/** Timeout in ms for all popups across the app */
export const POPUP_TIMEOUT = 3000;

/**
 * Reusable notification popup component.
 * @param {boolean} show - Whether to display the popup
 * @param {string} message - The message to display
 * @param {'success' | 'error'} type - 'success' for green, 'error' for red
 */
export default function Popup({ show, message, type = "success" }) {
  if (!show) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-6 z-50 pointer-events-none">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in`}
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-base">{message}</span>
      </div>
    </div>
  );
}
