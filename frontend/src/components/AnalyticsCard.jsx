import React, { useState } from "react";
import { BarChart3, Zap, ChevronRight } from "lucide-react";
import PaymentModeClientsModal from "./PaymentModeClientsModal";

const getYearlyMultiplier = (mode) => {
  if (!mode) return 1;
  const m = String(mode).trim().toLowerCase();
  if (m.includes("half")) return 2;
  if (m.includes("quarter")) return 4;
  if (m.includes("month")) return 12;
  return 1;
};

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const AnalyticsCard = ({ forms = [], onSelectClient, onFilterMainTable }) => {
  const [activeModalMode, setActiveModalMode] = useState(null);

  const modeStats = {
    Yearly: { count: 0, sum: 0 },
    "Half-Yearly": { count: 0, sum: 0 },
    Quarterly: { count: 0, sum: 0 },
    "Monthly (SSS)": { count: 0, sum: 0 },
  };

  forms.forEach((f) => {
    const mode = f.section7?.paymentMode || "Yearly";
    const prem = Number(f.section7?.premiumAmount) || 0;
    const mult = getYearlyMultiplier(mode);
    const yearlyPrem = prem * mult;

    if (modeStats[mode]) {
      modeStats[mode].count += 1;
      modeStats[mode].sum += yearlyPrem;
    } else {
      modeStats["Yearly"].count += 1;
      modeStats["Yearly"].sum += yearlyPrem;
    }
  });

  const colors = [
    { label: "Yearly", bg: "bg-blue-500", text: "text-blue-400" },
    { label: "Half-Yearly", bg: "bg-indigo-500", text: "text-indigo-400" },
    { label: "Quarterly", bg: "bg-cyan-500", text: "text-cyan-400" },
    { label: "Monthly (SSS)", bg: "bg-emerald-500", text: "text-emerald-400" },
  ];

  return (
    <div className="w-full">
      {/* Annualized Premium Revenue Analytics Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Premium Revenue Breakdown</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any payment mode to view all individual clients
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Breakdown</span>
          </span>
        </div>

        {/* Payment Mode Rows */}
        <div className="space-y-3">
          {colors.map((c) => {
            const data = modeStats[c.label] || { count: 0, sum: 0 };

            return (
              <div
                key={c.label}
                onClick={() => setActiveModalMode(c.label)}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-800/50 rounded-xl p-3.5 transition cursor-pointer group"
                title={`Click to view all ${c.label} mode clients`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-3 h-3 rounded-full ${c.bg} shadow`}></span>
                    <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {c.label} Mode
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">({data.count} proposals)</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold flex items-center">
                      View Clients <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-100 text-sm">{formatCurrency(data.sum)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Mode Clients Modal */}
      {activeModalMode && (
        <PaymentModeClientsModal
          mode={activeModalMode}
          forms={forms}
          onClose={() => setActiveModalMode(null)}
          onSelectClient={onSelectClient}
          onFilterMainTable={onFilterMainTable}
        />
      )}
    </div>
  );
};

export default AnalyticsCard;
