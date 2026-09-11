import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, onOpenAgentModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Proposals", icon: FileText, path: "/" },
    { label: "Create Proposal", icon: PlusCircle, path: "/insurance/new", isCta: true },
    { label: "Clients", icon: Users, path: "/clients" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Documents", icon: FolderOpen, path: "/documents" },
  ];

  const secondaryItems = [
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Help & Support", icon: HelpCircle, path: "/help" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-900 border-r border-slate-800/90 text-slate-300 select-none">
      {/* Top Header Logo */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0 border border-blue-400/30">
              <img src="/LIC.jpg" alt="LIC Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-white tracking-tight">
                  DataSheet Hub
                </span>
                <span className="block text-[9px] uppercase tracking-widest font-bold text-slate-400 leading-none mt-0.5">
                  Insurance Proposal Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.isCta) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition shadow-md ${
                    isCollapsed && !isMobileOpen ? "justify-center" : ""
                  } bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-blue-600/30 my-2.5`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isCollapsed && !isMobileOpen ? "justify-center" : ""
                } ${
                  active
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                }`}
                title={item.label}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r-md"></span>
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-blue-400" : "text-slate-400"}`} />
                {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary Links & Footer Profile */}
      <div className="p-3 space-y-3">
        <div className="space-y-1 border-t border-slate-800/80 pt-3">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition ${
                  isCollapsed && !isMobileOpen ? "justify-center" : ""
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* User Card at Bottom */}
        {user && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 transition">
            <div
              onClick={() => {
                if (onOpenAgentModal) onOpenAgentModal();
                setIsMobileOpen(false);
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                {user.fullName ? user.fullName[0].toUpperCase() : "A"}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex-1 overflow-hidden">
                  <span className="block text-xs font-bold text-slate-100 group-hover:text-blue-400 transition truncate">
                    {user.fullName || user.userName}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">LIC Representative</span>
                </div>
              )}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <button
                onClick={handleLogout}
                className="w-full mt-2.5 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
