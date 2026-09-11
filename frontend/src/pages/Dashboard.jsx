import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, FileSpreadsheet } from "lucide-react";
import api from "../server/api.js";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import MetricStrip from "../components/MetricStrip.jsx";
import RecentActivityWidget from "../components/RecentActivityWidget.jsx";
import AnalyticsCard from "../components/AnalyticsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ProposalTable from "../components/ProposalTable.jsx";
import UserDetailsModal from "../components/UserDetailsModal.jsx";
import AgentProfileModal from "../components/AgentProfileModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);
  const [selectedClientForm, setSelectedClientForm] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSumAssured: 0,
    totalPremiumAmount: 0,
    totalYearlyPremium: 0,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    clientName: "",
  });

  const navigate = useNavigate();

  const fetchForms = async (querySearch = search, year = selectedYear) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/insurance?search=${encodeURIComponent(querySearch)}&year=${encodeURIComponent(year)}`
      );
      if (response.data?.success) {
        setForms(response.data.data || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        if (response.data.availableYears && response.data.availableYears.length > 0) {
          setAvailableYears(response.data.availableYears);
        }
      }
    } catch (err) {
      console.error("Fetch forms error:", err);
      toast.error("Failed to load proposal data sheets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(search, selectedYear);
  }, [search, selectedYear]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const response = await api.delete(`/insurance/${deleteModal.id}`);
      if (response.data?.success) {
        toast.success("Insurance proposal deleted successfully.");
        setDeleteModal({ isOpen: false, id: null, clientName: "" });
        fetchForms(search, selectedYear);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete proposal data sheet.");
    }
  };

  // Client-side Filter & Sort
  const processedForms = useMemo(() => {
    let result = [...forms];

    if (selectedMode && selectedMode !== "all") {
      result = result.filter((f) => (f.section7?.paymentMode || "Yearly") === selectedMode);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "sum_desc") {
      result.sort((a, b) => (Number(b.section7?.insuranceAmount) || 0) - (Number(a.section7?.insuranceAmount) || 0));
    } else if (sortBy === "prem_desc") {
      result.sort((a, b) => (Number(b.section7?.premiumAmount) || 0) - (Number(a.section7?.premiumAmount) || 0));
    }

    return result;
  }, [forms, selectedMode, sortBy]);

  return (
    <AppLayout title="Dashboard Overview" search={search} setSearch={setSearch}>
      {/* 1. Header & Logged-in Agent Identity (Unboxed, Intentional Whitespace) */}
      <DashboardHeader
        forms={processedForms}
        onOpenAgentModal={() => setShowAgentModal(true)}
      />

      {/* 2. Key Performance Metrics Strip (Unified borderless strip) */}
      <MetricStrip stats={stats} />

      {/* 3. Main Content Area: Proposal Table Focus */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <span>Proposals & Datasheet Registry</span>
              <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                {processedForms.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Primary ledger of client policy datasheets, insured sums, and payment schedules.
            </p>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          loading={loading}
          onRefresh={() => fetchForms(search, selectedYear)}
        />

        {/* Proposal Table Component */}
        <ProposalTable
          forms={processedForms}
          loading={loading}
          search={search}
          onSelectClient={(form) => setSelectedClientForm(form)}
          onOpenDeleteModal={(id, clientName) =>
            setDeleteModal({ isOpen: true, id, clientName })
          }
        />
      </div>

      {/* 4. Secondary Section: Client Activity & Derived Portfolio Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <RecentActivityWidget
            forms={forms}
            onSelectClient={(form) => setSelectedClientForm(form)}
          />
        </div>
        <div className="lg:col-span-2">
          <AnalyticsCard
            forms={forms}
            onSelectClient={(form) => setSelectedClientForm(form)}
            onFilterMainTable={(mode) => setSelectedMode(mode)}
          />
        </div>
      </div>

      {/* User Details Modal */}
      {selectedClientForm && (
        <UserDetailsModal
          form={selectedClientForm}
          onClose={() => setSelectedClientForm(null)}
        />
      )}

      {/* Agent Profile Modal */}
      <AgentProfileModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Insurance Form?</h3>
            <p className="text-sm text-slate-400 mt-2">
              Are you sure you want to delete proposal form for{" "}
              <span className="font-semibold text-slate-200">"{deleteModal.clientName}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null, clientName: "" })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                Delete Form
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;

