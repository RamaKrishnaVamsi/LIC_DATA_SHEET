import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Download, Sparkles, UserCheck, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DashboardHeader = ({ forms = [], onOpenAgentModal }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const agentName = user?.fullName || user?.userName || "Agent";
  const agentCode = user?.userName || "LIC-AGENT-884";

  // CSV Export handler
  const handleExportCSV = () => {
    if (!forms || forms.length === 0) {
      toast.error("No proposal records to export.");
      return;
    }

    const headers = [
      "Client Name",
      "Cell Number",
      "Gender",
      "Age",
      "Policy Number",
      "Sum Assured (INR)",
      "Premium (INR)",
      "Payment Mode",
      "Agent Name",
      "Agent Code",
      "Created Date",
    ];

    const rows = forms.map((f) => [
      `"${f.section1?.fullName || ""}"`,
      `"${f.section1?.cellNumber || ""}"`,
      `"${f.section1?.gender || ""}"`,
      `"${f.section1?.age || ""}"`,
      `"${f.section7?.policyNo || ""}"`,
      `"${f.section7?.insuranceAmount || 0}"`,
      `"${f.section7?.premiumAmount || 0}"`,
      `"${f.section7?.paymentMode || ""}"`,
      `"${f.agentDetails?.agentName || ""}"`,
      `"${f.agentDetails?.agentCode || ""}"`,
      `"${f.createdAt ? new Date(f.createdAt).toISOString().split("T")[0] : ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LIC_Proposals_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${forms.length} proposal records to CSV!`);
  };

  return (
    <div className="relative mb-8 pb-2">
      {/* Background Subtle Gradient Mesh - Intentional Whitespace */}
      <div className="absolute -top-16 left-1/4 -z-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -top-16 right-1/4 -z-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* User Identity & Greeting */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise LIC Portal</span>
            </span>

            <button
              onClick={onOpenAgentModal}
              className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono font-medium transition cursor-pointer"
              title="Click to view full agent profile"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Agent:</span>
              <span className="text-slate-200 font-bold">{agentCode}</span>
            </button>

            <span className="hidden sm:inline-flex items-center space-x-1 text-slate-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Authorized Representative</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white">{agentName}</span>
          </h1>
          <p className="mt-1.5 text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Welcome to your proposal management workspace. Monitor active client policies, analyze premium collections, and generate LIC datasheets.
          </p>
        </div>

        {/* Action CTAs - Primary CTA "New Proposal" is Visually Prominent */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex-1 lg:flex-none inline-flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold px-4 py-3 rounded-xl shadow-md transition active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/insurance/new"
            className="flex-1 lg:flex-none inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 border border-blue-400/30 transition-all duration-200 hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-blue-100" />
            <span className="tracking-wide">Create New Proposal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
