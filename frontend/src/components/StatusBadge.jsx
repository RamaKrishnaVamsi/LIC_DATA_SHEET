import React from "react";
import { CheckCircle2, Clock, AlertCircle, ShieldAlert } from "lucide-react";

const StatusBadge = ({ status = "Active" }) => {
  const s = String(status).toLowerCase();

  if (s.includes("active") || s.includes("issued") || s.includes("paid")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Active</span>
      </span>
    );
  }

  if (s.includes("pending") || s.includes("draft") || s.includes("review")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        <span>Pending</span>
      </span>
    );
  }

  if (s.includes("lapsed") || s.includes("expired") || s.includes("canceled")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        <span>Lapsed</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
