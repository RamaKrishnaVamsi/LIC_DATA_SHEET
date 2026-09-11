import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, trendText = "vs last month", isPositive = true, color = "blue" }) => {
  const colorMap = {
    blue: {
      borderTop: "border-t-blue-500",
      iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-blue-500/10",
      glow: "hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5",
    },
    emerald: {
      borderTop: "border-t-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10",
      glow: "hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5",
    },
    indigo: {
      borderTop: "border-t-indigo-500",
      iconBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-indigo-500/10",
      glow: "hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5",
    },
    amber: {
      borderTop: "border-t-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10",
      glow: "hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5",
    },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-slate-900/90 border border-slate-800 border-t-2 ${currentTheme.borderTop} rounded-2xl p-5 shadow-lg transition-all duration-300 ${currentTheme.glow} group relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow ${currentTheme.iconBg} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <span className={`flex items-center font-bold px-2 py-0.5 rounded-md text-[11px] ${
            isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> : <TrendingDown className="w-3 h-3 mr-1 shrink-0" />}
            {trend}
          </span>
          <span className="text-slate-400 text-[11px] font-medium">{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
