import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import api from "../server/api.js";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import AnalyticsCard from "../components/AnalyticsCard.jsx";
import UserDetailsModal from "../components/UserDetailsModal.jsx";
import PaymentModeClientsModal from "../components/PaymentModeClientsModal.jsx";

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const AnalyticsPage = () => {
  const [forms, setForms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClientForm, setSelectedClientForm] = useState(null);
  const [activePaymentModalMode, setActivePaymentModalMode] = useState(null);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/insurance");
      if (response.data?.success) {
        setForms(response.data.data || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Top 5 High Value Policies
  const topHighValuePolicies = useMemo(() => {
    return [...forms]
      .sort((a, b) => (Number(b.section7?.insuranceAmount) || 0) - (Number(a.section7?.insuranceAmount) || 0))
      .slice(0, 5);
  }, [forms]);

  // Payment Mode breakdown
  const paymentModeBreakdown = useMemo(() => {
    const counts = { Yearly: 0, "Half-Yearly": 0, Quarterly: 0, Monthly: 0, Single: 0 };
    forms.forEach((f) => {
      const mode = (f.section7?.paymentMode || "Yearly").toLowerCase();
      if (mode.includes("half")) counts["Half-Yearly"]++;
      else if (mode.includes("quarter")) counts["Quarterly"]++;
      else if (mode.includes("month")) counts["Monthly"]++;
      else if (mode.includes("single")) counts["Single"]++;
      else counts["Yearly"]++;
    });
    return counts;
  }, [forms]);

  return (
    <AppLayout title="Business Analytics & Reports" search={search} setSearch={setSearch}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Portfolio & Revenue Intelligence</h2>
            <p className="text-xs text-slate-400 mt-1">
              In-depth breakdown of policy distribution, payment modes, sum assured exposure, and top accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-mono font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Realtime Ledger Sync</span>
          </span>
        </div>
      </div>

      {/* Main Analytics Cards Grid */}
      <div className="space-y-8">
        {/* Core Component Analytics Card */}
        <AnalyticsCard
          forms={forms}
          onSelectClient={(form) => setSelectedClientForm(form)}
          onFilterMainTable={(mode) => setActivePaymentModalMode(mode)}
        />

        {/* Extended Insights & Top Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 5 High Value Accounts */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Top High-Value Policies</h3>
                  <p className="text-xs text-slate-400">Largest sum assured proposals registered</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                Top 5
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Loading analytics...</div>
            ) : topHighValuePolicies.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No proposals recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {topHighValuePolicies.map((form, idx) => {
                  const clientName = form.section1?.fullName || "Client";
                  const policyNo = form.section7?.policyNo || "N/A";
                  const sumAssured = form.section7?.insuranceAmount || 0;
                  const premium = form.section7?.premiumAmount || 0;
                  const mode = form.section7?.paymentMode || "Yearly";

                  return (
                    <div
                      key={form._id}
                      onClick={() => setSelectedClientForm(form)}
                      className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-100 group-hover:text-amber-400 text-xs sm:text-sm transition truncate">
                            {clientName}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400 block truncate">
                            Pol #{policyNo} • {mode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 shrink-0 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sum Assured</span>
                          <span className="font-mono text-xs sm:text-sm font-black text-emerald-400">{formatCurrency(sumAssured)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Premium</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">{formatCurrency(premium)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Mode Distribution Summary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Payment Distribution</h3>
                  <p className="text-xs text-slate-400">Policy payment frequency</p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(paymentModeBreakdown).map(([mode, count]) => {
                  return (
                    <div key={mode} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">{mode} Mode</span>
                      <span className="text-slate-400 font-mono">{count} proposals</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Automated portfolio calculation active</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedClientForm && (
        <UserDetailsModal
          form={selectedClientForm}
          onClose={() => setSelectedClientForm(null)}
        />
      )}

      {/* Payment Mode Clients Modal */}
      {activePaymentModalMode && (
        <PaymentModeClientsModal
          mode={activePaymentModalMode}
          forms={forms}
          onClose={() => setActivePaymentModalMode(null)}
          onSelectClient={(form) => setSelectedClientForm(form)}
        />
      )}
    </AppLayout>
  );
};

export default AnalyticsPage;
