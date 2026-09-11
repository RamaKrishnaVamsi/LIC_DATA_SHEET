import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, ShieldCheck, Calendar, X, LogOut, Award, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AgentProfileModal = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    onClose();
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initial = user.fullName ? user.fullName[0].toUpperCase() : "A";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header with cover pattern */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-center border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-xl border-2 border-blue-400/30 mb-3">
            {initial}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">{user.fullName || "Agent Profile"}</h2>
          <p className="text-xs text-blue-300 font-mono mt-0.5">@{user.userName || "agent"}</p>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mt-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Active LIC Representative</span>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="p-6 space-y-4 text-sm">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3 text-slate-400">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium">Full Name</span>
              </div>
              <span className="font-semibold text-slate-100">{user.fullName || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3 text-slate-400">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium">Username</span>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-200">{user.userName || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium">Email Address</span>
              </div>
              <span className="font-medium text-slate-200 text-xs">{user.email || "N/A"}</span>
            </div>

            {user.phoneNo && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-3 text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium">Phone Number</span>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-200">{user.phoneNo}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium">Account Access</span>
              </div>
              <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Authorized Agent
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition shadow-lg shadow-rose-600/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileModal;
