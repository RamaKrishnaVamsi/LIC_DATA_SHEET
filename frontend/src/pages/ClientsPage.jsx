import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Phone,
  Mail,
  ShieldCheck,
  Briefcase,
  Filter,
  DollarSign,
  TrendingUp,
  FileText,
  UserCheck
} from "lucide-react";
import api from "../server/api.js";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import UserDetailsModal from "../components/UserDetailsModal.jsx";

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const ClientsPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedClientForm, setSelectedClientForm] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get("/insurance");
      if (response.data?.success) {
        setForms(response.data.data || []);
      }
    } catch (err) {
      console.error("Fetch clients error:", err);
      toast.error("Failed to load client database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtered clients list
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const name = form.section1?.fullName || "";
      const phone = form.section1?.cellNumber || "";
      const email = form.section2?.email || form.section1?.email || "";
      const policyNo = String(form.section7?.policyNo || "");
      const mode = form.section7?.paymentMode || "Yearly";
      const q = search.trim().toLowerCase();

      const matchesSearch =
        q === "" ||
        name.toLowerCase().includes(q) ||
        phone.includes(q) ||
        email.toLowerCase().includes(q) ||
        policyNo.toLowerCase().includes(q) ||
        `pol #${policyNo}`.toLowerCase().includes(q) ||
        `policy #${policyNo}`.toLowerCase().includes(q);

      const matchesMode = selectedMode === "all" || mode === selectedMode;

      return matchesSearch && matchesMode;
    });
  }, [forms, search, selectedMode]);

  // Aggregate stats
  const totalClients = forms.length;
  const totalSumAssured = forms.reduce(
    (acc, f) => acc + (Number(f.section7?.insuranceAmount) || 0),
    0
  );
  const totalPremiums = forms.reduce(
    (acc, f) => acc + (Number(f.section7?.premiumAmount) || 0),
    0
  );

  return (
    <AppLayout title="Clients Directory & CRM" search={search} setSearch={setSearch}>
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Client Portfolio Directory</h2>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive list of policyholders, contact details, sum assured & proposal datasheets.
            </p>
          </div>
        </div>

        <Link
          to="/insurance/new"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Client Proposal</span>
        </Link>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered Clients</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">{totalClients}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1 font-medium">
            <span>Verified Policy Holders</span>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Portfolio Sum</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-300 mt-2 font-mono">{formatCurrency(totalSumAssured)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cumulated Sum Assured</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Base Premium Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">{formatCurrency(totalPremiums)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Direct premium collections</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, policy..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline">Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-semibold"
            >
              <option value="all" className="bg-slate-900">All Modes</option>
              <option value="Yearly" className="bg-slate-900">Yearly</option>
              <option value="Half-Yearly" className="bg-slate-900">Half-Yearly</option>
              <option value="Quarterly" className="bg-slate-900">Quarterly</option>
              <option value="Monthly (SSS)" className="bg-slate-900">Monthly (SSS)</option>
              <option value="Single Premium" className="bg-slate-900">Single Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client List Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading clients ledger...</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Clients Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No policy records match your search criteria or payment mode filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((form) => {
            const name = form.section1?.fullName || "Unnamed Client";
            const cell = form.section1?.cellNumber || "N/A";
            const email = form.section1?.email || "N/A";
            const occupation = form.section1?.occupation || "N/A";
            const heightCm = form.section12?.heightCm;
            const weightKg = form.section12?.weightKg;
            const policyNo = form.section7?.policyNo || "N/A";
            const planName = form.section7?.planName || "Insurance Plan";
            const mode = form.section7?.paymentMode || "Yearly";
            const sumAssured = form.section7?.insuranceAmount || 0;
            const premium = form.section7?.premiumAmount || 0;
            const creationDate = form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "N/A";
            const initial = name ? name[0].toUpperCase() : "C";

            return (
              <div
                key={form._id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Client Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                        {initial}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-white group-hover:text-blue-400 transition truncate text-sm">
                          {name}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{occupation}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {mode}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-2 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Phone</span>
                      </span>
                      <span className="font-bold">{cell}</span>
                    </div>

                    {(heightCm || weightKg) && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Height & Weight</span>
                        <span className="font-bold text-emerald-400">
                          {heightCm ? `${heightCm} cm` : "N/A"} / {weightKg ? `${weightKg} kg` : "N/A"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-2 text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Policy No</span>
                      </span>
                      <span className="text-blue-400 font-bold">{policyNo}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/50">
                      <span className="text-slate-400">Commencement Date</span>
                      <span className="text-slate-200 font-bold">{creationDate}</span>
                    </div>
                  </div>

                  {/* Financial Overview */}
                  <div className="grid grid-cols-2 gap-2 my-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/50">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400 block">Sum Assured</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{formatCurrency(sumAssured)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400 block">Premium</span>
                      <span className="text-xs font-mono font-bold text-slate-200">{formatCurrency(premium)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between space-x-2 pt-2 border-t border-slate-800/50">
                  <button
                    onClick={() => setSelectedClientForm(form)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => navigate(`/insurance/view/${form._id}`)}
                    className="py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => navigate(`/insurance/edit/${form._id}`)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Details Modal */}
      {selectedClientForm && (
        <UserDetailsModal
          form={selectedClientForm}
          onClose={() => setSelectedClientForm(null)}
        />
      )}
    </AppLayout>
  );
};

export default ClientsPage;
