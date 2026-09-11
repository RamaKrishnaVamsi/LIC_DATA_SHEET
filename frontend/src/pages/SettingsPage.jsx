import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Key,
  CheckCircle2,
  Save,
  Globe,
  Smartphone,
  Info
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "Lic Agent Representative",
    agencyCode: user?.agencyCode || "LIC-882910",
    branchName: user?.branchName || "Main Branch - 881",
    email: user?.email || "agent@lic.in",
    mobile: user?.mobile || "+91 9876543210",
    defaultPaymentFilter: "all",
    autoSync: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings updated successfully!");
  };

  return (
    <AppLayout title="Portal Settings & Preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-blue-400 shadow-lg border border-slate-700 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">System & Account Configurations</h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage your agent identity, database auto-sync preferences, and security settings.
            </p>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Agent Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
              activeTab === "preferences"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
              activeTab === "system"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>System Status</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Agent Representative Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Agency Code</label>
                <input
                  type="text"
                  name="agencyCode"
                  value={formData.agencyCode}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Branch Name / No.</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "preferences" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Dashboard Preferences</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white">Auto-Sync DataSheet Ledger</h4>
                  <p className="text-slate-400 mt-0.5">Automatically sync updates with backend database server</p>
                </div>
                <input
                  type="checkbox"
                  name="autoSync"
                  checked={formData.autoSync}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">System Health & Status</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-200">Backend API Server</span>
                </div>
                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-slate-200">MongoDB Database</span>
                </div>
                <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
