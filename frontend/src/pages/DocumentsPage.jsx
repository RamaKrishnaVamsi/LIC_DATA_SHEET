import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  FileText,
  Search,
  Eye,
  Printer,
  Download,
  ShieldCheck,
  Calendar,
  User,
  PlusCircle,
  FileCheck,
  ExternalLink
} from "lucide-react";
import api from "../server/api.js";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";

const DocumentsPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/insurance");
      if (response.data?.success) {
        setForms(response.data.data || []);
      }
    } catch (err) {
      console.error("Fetch documents error:", err);
      toast.error("Failed to load proposal document repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const name = form.section1?.fullName || "";
      const policyNo = String(form.section7?.policyNo || "");
      const agentCode = form.agentDetails?.agentCode || "";
      const q = search.trim().toLowerCase();

      return (
        q === "" ||
        name.toLowerCase().includes(q) ||
        policyNo.toLowerCase().includes(q) ||
        `pol #${policyNo}`.toLowerCase().includes(q) ||
        agentCode.toLowerCase().includes(q)
      );
    });
  }, [forms, search]);

  return (
    <AppLayout title="Document Registry" search={search} setSearch={setSearch}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Official Proposal Document Vault</h2>
            <p className="text-xs text-slate-400 mt-1">
              Store, inspect, print, and generate LIC Insurance Proposal DataSheets.
            </p>
          </div>
        </div>

        <Link
          to="/insurance/new"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Proposal Form</span>
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document by client, policy no..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Vault Documents: <span className="text-white font-bold">{filteredForms.length}</span>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading document repository...</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Documents Found</h3>
          <p className="text-xs text-slate-500 mt-1">No proposal data sheets match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((form) => {
            const clientName = form.section1?.fullName || "Client Proposal Sheet";
            const policyNo = form.section7?.policyNo || "P-PENDING";
            const planName = form.section7?.planName || "LIC Endowments";
            const createdAt = form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "N/A";

            return (
              <div
                key={form._id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between group transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                      PDF Ready
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition truncate">
                    {clientName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{planName}</p>

                  <div className="mt-4 space-y-1.5 py-3 border-y border-slate-800/80 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Policy Number:</span>
                      <span className="text-blue-400 font-bold">{policyNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created Date:</span>
                      <span>{createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-2 pt-4">
                  <button
                    onClick={() => navigate(`/insurance/view/${form._id}`)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Sheet</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/insurance/view/${form._id}`);
                      setTimeout(() => window.print(), 500);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default DocumentsPage;
