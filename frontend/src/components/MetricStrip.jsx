import React from "react";
import { FileText, ShieldCheck, TrendingUp, Users, ArrowUpRight } from "lucide-react";

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const MetricStrip = ({ stats = {} }) => {
  const totalForms = stats.totalForms || 0;
  const sumAssured = stats.totalSumAssured || 0;
  const premium = stats.totalYearlyPremium || stats.totalPremiumAmount || 0;
  const avgSum = totalForms > 0 ? Math.round(sumAssured / totalForms) : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
        {/* Metric 1: Total Proposals */}
        <div className="pt-4 sm:pt-0 sm:pr-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Proposals</p>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight mt-1">{totalForms}</h3>
            <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14%
              </span>
              <span>vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Sum Assured */}
        <div className="pt-4 sm:pt-0 sm:px-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Sum Assured</p>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono tracking-tight mt-1">
              {formatCurrency(sumAssured)}
            </h3>
            <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.5%
              </span>
              <span>portfolio growth</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Premium Collected */}
        <div className="pt-4 sm:pt-0 sm:px-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Premium Collected</p>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight mt-1">
              {formatCurrency(premium)}
            </h3>
            <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                Annualized
              </span>
              <span>premium revenue</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Average Policy Value */}
        <div className="pt-4 sm:pt-0 sm:pl-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Sum / Policy</p>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-amber-400 font-mono tracking-tight mt-1">
              {formatCurrency(avgSum)}
            </h3>
            <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
              <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {totalForms} Clients
              </span>
              <span>active policies</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricStrip;
