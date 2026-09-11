import React from "react";
import { Clock, ArrowRight, UserCheck, Eye, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const RecentActivityWidget = ({ forms = [], onSelectClient }) => {
  const recentForms = forms.slice(0, 4);

  if (recentForms.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 text-center shadow-lg">
        <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-slate-300">No Recent Activity</h4>
        <p className="text-[11px] text-slate-500 mt-1">Create your first proposal datasheet to view live updates here.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Recent Client Activity</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Latest {recentForms.length} proposals
        </span>
      </div>

      <div className="space-y-3">
        {recentForms.map((form) => {
          const clientName = form.section1?.fullName || "Client";
          const policyNo = form.section7?.policyNo || "N/A";
          const sumAssured = form.section7?.insuranceAmount || 0;
          const dateStr = form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "Just now";
          const initial = clientName ? clientName[0].toUpperCase() : "C";

          return (
            <div
              key={form._id}
              onClick={() => onSelectClient && onSelectClient(form)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 transition cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                  {initial}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {clientName}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span className="font-mono text-blue-400">Pol #{policyNo}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {formatCurrency(sumAssured)}
                </div>
                <StatusBadge status="Active" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityWidget;
