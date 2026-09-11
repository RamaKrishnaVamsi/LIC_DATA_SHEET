import React from "react";
import { X, Eye, Users, ShieldCheck, ArrowRight, Filter } from "lucide-react";

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

const PaymentModeClientsModal = ({ mode, forms = [], onClose, onSelectClient, onFilterMainTable }) => {
  if (!mode) return null;

  const matchingForms = forms.filter((f) => {
    const pMode = f.section7?.paymentMode || "Yearly";
    if (mode === "Yearly") return pMode === "Yearly" || (pMode.toLowerCase().includes("year") && !pMode.toLowerCase().includes("half"));
    if (mode === "Half-Yearly") return pMode.toLowerCase().includes("half");
    if (mode === "Quarterly") return pMode.toLowerCase().includes("quarter");
    if (mode === "Monthly (SSS)" || mode === "Monthly") return pMode.toLowerCase().includes("month");
    return pMode === mode;
  });

  const totalSumAssured = matchingForms.reduce(
    (acc, f) => acc + (Number(f.section7?.insuranceAmount) || 0),
    0
  );

  const totalYearlyPremium = matchingForms.reduce((acc, f) => {
    const prem = Number(f.section7?.premiumAmount) || 0;
    const mult = getYearlyMultiplier(f.section7?.paymentMode);
    return acc + prem * mult;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">{mode} Mode Clients</h3>
                <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                  {matchingForms.length} Clients
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Premium Collection: <span className="font-mono text-slate-200 font-bold">{formatCurrency(totalYearlyPremium)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {matchingForms.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-300">No Clients Found</h4>
              <p className="text-xs text-slate-500 mt-1">There are no client proposals registered under {mode} payment mode.</p>
            </div>
          ) : (
            matchingForms.map((form) => {
              const clientName = form.section1?.fullName || "Client";
              const cell = form.section1?.cellNumber || "N/A";
              const policyNo = form.section7?.policyNo || "N/A";
              const sumAssured = form.section7?.insuranceAmount || 0;
              const premium = form.section7?.premiumAmount || 0;
              const agentName = form.agentDetails?.agentName || "N/A";
              const initial = clientName ? clientName[0].toUpperCase() : "C";

              return (
                <div
                  key={form._id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-blue-400 text-sm transition">
                        {clientName}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-blue-400">Pol #{policyNo}</span>
                        <span>•</span>
                        <span>Ph: {cell}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sum Assured</span>
                      <span className="font-mono text-sm font-bold text-emerald-400">{formatCurrency(sumAssured)}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Premium</span>
                      <span className="font-mono text-sm font-bold text-slate-200">{formatCurrency(premium)}</span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectClient(form);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Showing all {matchingForms.length} {mode} mode policies
          </span>
          {onFilterMainTable && (
            <button
              onClick={() => {
                onFilterMainTable(mode);
                onClose();
              }}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-semibold transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Filter Main Table by {mode}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModeClientsModal;
