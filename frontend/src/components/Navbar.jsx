import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, PlusCircle, LayoutDashboard, LogOut, User, ShieldCheck, ChevronDown, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import AgentProfileModal from "./AgentProfileModal.jsx";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0">
              <img src="/LIC.jpg" alt="LIC Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-200">
                DataSheet Hub
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Insurance Proposal Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/")
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/insurance/new"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/insurance/new")
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-blue-600/20"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Proposal</span>
            </Link>
          </nav>

          {/* Right Action Items & Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/40 px-2.5 sm:px-3 py-1.5 rounded-full transition shadow-sm group cursor-pointer"
                title="Click to view Agent Profile details"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow shrink-0">
                  {user.fullName ? user.fullName[0].toUpperCase() : "A"}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-semibold text-slate-100 group-hover:text-blue-300 transition">
                    {user.fullName || user.userName || user.email}
                  </span>
                  <span className="block text-[10px] text-slate-400 leading-none">LIC Agent</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition hidden sm:block" />
              </button>
            )}

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              isActive("/")
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-200 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/insurance/new"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              isActive("/insurance/new")
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Proposal</span>
          </Link>

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowProfileModal(true);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 border border-slate-800 transition text-left"
            >
              <User className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="block text-slate-100">{user.fullName || user.userName}</span>
                <span className="block text-xs text-slate-400 font-normal">View Agent Profile</span>
              </div>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Account</span>
          </button>
        </div>
      )}

      {/* Agent Profile Modal */}
      <AgentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

export default Navbar;
