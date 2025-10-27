"use client";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function CandidateDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col md:ml-64 ml-20">
        <Topbar />
        <main className="p-6 md:p-10 flex-1">
          <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>
          <div className="bg-white rounded-2xl shadow p-6 min-h-[40vh] flex items-center justify-center">
            Welcome to your dashboard!
          </div>
        </main>
      </div>
    </div>
  );
}
