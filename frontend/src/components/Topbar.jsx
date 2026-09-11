import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, PlusCircle, Menu, ShieldCheck, CheckCircle2 } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import toast from "react-hot-toast";

const Topbar = ({ title = "Dashboard Overview", onToggleMobileSidebar, onOpenAgentModal, search, setSearch }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    toast.success("All systems operational. DataSheet Hub live sync active.", { id: "sys-status" });
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>{title}</span>
              </h1>
              <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>LIC Insurance Proposal Portal</span>
              </div>
            </div>
          </div>

          {/* Center: Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={search || ""}
                onChange={(e) => setSearch && setSearch(e.target.value)}
                placeholder="Quick search by client, policy no, phone, agent code..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 pl-10 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right: Actions, Notifications & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* New Proposal CTA Button */}
            <Link
              to="/insurance/new"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/20 transition active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>New Proposal</span>
            </Link>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition relative"
                title="Notifications & System Status"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                      System Healthy
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">DataSheet Hub Active</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">MongoDB database connection operational.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu Dropdown */}
            <ProfileMenu onOpenProfileModal={onOpenAgentModal} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
