import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, ChevronDown, ShieldCheck, Mail, Phone, Award } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ onOpenProfileModal }) => {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initial = user.fullName ? user.fullName[0].toUpperCase() : "A";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/40 px-3 py-1.5 rounded-full transition shadow-sm cursor-pointer group"
        title="Account details"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md border border-blue-400/30 shrink-0">
          {initial}
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-xs font-semibold text-slate-100 group-hover:text-blue-300 transition leading-tight">
            {user.fullName || user.userName || user.email}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">LIC Agent</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow">
                {initial}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{user.fullName || "Agent Profile"}</h4>
                <p className="text-[11px] text-slate-400 truncate">@{user.userName || "agent"}</p>
                <div className="inline-flex items-center space-x-1 text-[9px] font-semibold text-emerald-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Agent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfileModal) onOpenProfileModal();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>View Profile Details</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
