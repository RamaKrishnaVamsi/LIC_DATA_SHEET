import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Printer,
  Edit,
  Trash2,
  FileText,
  PlusCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User
} from "lucide-react";
import StatusBadge from "./StatusBadge";

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

const ProposalTable = ({
  forms = [],
  loading = false,
  search = "",
  onSelectClient,
  onOpenDeleteModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(forms.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForms = forms.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-16 text-center text-slate-400 shadow-xl">
        <RefreshCw className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <h4 className="text-base font-bold text-slate-200">Loading DataSheets...</h4>
        <p className="text-xs text-slate-400 mt-1">Synchronizing proposal records from backend server</p>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 sm:p-16 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">No Insurance Proposals Found</h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 mb-6 max-w-md mx-auto">
          {search ? "No datasheet records matched your current filter criteria." : "You haven't recorded any client proposal datasheets yet."}
        </p>
        <Link
          to="/insurance/new"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Proposal</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* MOBILE CARDS VIEW (< md screens) */}
      <div className="block md:hidden divide-y divide-slate-800/80">
        {paginatedForms.map((form) => {
          const clientName = form.section1?.fullName || "N/A";
          const cell = form.section1?.cellNumber || "N/A";
          const gender = form.section1?.gender || "";
          const age = form.section1?.age ? `${form.section1.age} yrs` : "";
          const policyNo = form.section7?.policyNo || "N/A";
          const paymentMode = form.section7?.paymentMode || "N/A";
          const sumAssured = form.section7?.insuranceAmount || 0;
          const premium = form.section7?.premiumAmount || 0;
          const agentName = form.agentDetails?.agentName || "N/A";
          const agentCode = form.agentDetails?.agentCode || "";
          const dateStr = form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "N/A";

          const mult = getYearlyMultiplier(paymentMode);
          const yearlyPrem = (Number(premium) || 0) * mult;
          const initial = clientName ? clientName[0].toUpperCase() : "C";

          return (
            <div key={form._id} className="p-4 space-y-3 hover:bg-slate-800/40 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow border border-blue-400/20">
                    {initial}
                  </div>
                  <div>
                    <button
                      onClick={() => onSelectClient(form)}
                      className="font-bold text-slate-100 hover:text-blue-400 text-left flex items-center space-x-1.5 transition cursor-pointer text-base"
                    >
                      <span>{clientName}</span>
                      <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                    </button>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {cell} {gender && `• ${gender}`} {age && `(${age})`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    Pol #{policyNo}
                  </div>
                  <StatusBadge status="Active" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Sum Assured</span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">{formatCurrency(sumAssured)}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Premium ({paymentMode})</span>
                  <span className="font-semibold text-slate-200 font-mono">{formatCurrency(premium)}</span>
                  {mult > 1 && (
                    <span className="text-[10px] text-indigo-400 font-semibold block font-mono">
                      ({formatCurrency(yearlyPrem)}/yr)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div>
                  <span className="text-slate-300 font-medium">{agentName}</span>
                  {agentCode && <span className="ml-1 text-[11px]">({agentCode})</span>}
                </div>
                <div className="text-[11px] font-mono">{dateStr}</div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectClient(form)}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-700/80 text-xs font-medium transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <Link
                  to={`/insurance/view/${form._id}`}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-400 border border-slate-700/80 text-xs font-medium transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </Link>

                <Link
                  to={`/insurance/edit/${form._id}`}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-700/80 text-xs font-medium transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={() => onOpenDeleteModal(form._id, clientName)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-slate-700/80 transition cursor-pointer"
                  title="Delete DataSheet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW (>= md screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Client Information</th>
              <th className="px-6 py-4">Policy / Plan</th>
              <th className="px-6 py-4">Sum Assured</th>
              <th className="px-6 py-4">Premium (Yearly)</th>
              <th className="px-6 py-4">Agent Representative</th>
              <th className="px-6 py-4">Date of Commencement</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {paginatedForms.map((form) => {
              const clientName = form.section1?.fullName || "N/A";
              const cell = form.section1?.cellNumber || "N/A";
              const gender = form.section1?.gender || "";
              const age = form.section1?.age ? `${form.section1.age} yrs` : "";
              const heightCm = form.section12?.heightCm;
              const weightKg = form.section12?.weightKg;
              const policyNo = form.section7?.policyNo || "N/A";
              const paymentMode = form.section7?.paymentMode || "N/A";
              const sumAssured = form.section7?.insuranceAmount || 0;
              const premium = form.section7?.premiumAmount || 0;
              const agentName = form.agentDetails?.agentName || "N/A";
              const agentCode = form.agentDetails?.agentCode || "";
              const dateStr = form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "N/A";

              const mult = getYearlyMultiplier(paymentMode);
              const yearlyPrem = (Number(premium) || 0) * mult;
              const initial = clientName ? clientName[0].toUpperCase() : "C";

              return (
                <tr key={form._id} className="hover:bg-slate-800/40 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow border border-blue-400/20">
                        {initial}
                      </div>
                      <div>
                        <button
                          onClick={() => onSelectClient(form)}
                          className="font-bold text-slate-100 group-hover:text-blue-400 text-left flex items-center space-x-1.5 transition cursor-pointer"
                          title="Click to view client details"
                        >
                          <span>{clientName}</span>
                          <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 shrink-0" />
                        </button>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cell} {gender && `• ${gender}`} {age && `(${age})`}
                        </div>
                        {(heightCm || weightKg) && (
                          <div className="text-[10px] text-emerald-400 font-mono font-medium mt-0.5">
                            Ht: {heightCm ? `${heightCm}cm` : "N/A"} • Wt: {weightKg ? `${weightKg}kg` : "N/A"}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20 inline-block">
                      Pol #{policyNo}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Mode: {paymentMode}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-extrabold text-emerald-400 text-sm font-mono">{formatCurrency(sumAssured)}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200 font-mono">{formatCurrency(premium)}</div>
                    {mult > 1 && (
                      <div className="text-[11px] text-indigo-400 font-semibold font-mono" title="Annualized Premium">
                        ({formatCurrency(yearlyPrem)}/yr)
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{agentName}</div>
                    {agentCode && <div className="text-[11px] text-slate-400">Code: {agentCode}</div>}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-bold text-slate-100">{dateStr}</div>
                    <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mt-0.5">
                      Commencement Date
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status="Active" />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onSelectClient(form)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-700/80 transition cursor-pointer"
                        title="View Full Client Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/insurance/view/${form._id}`}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-400 border border-slate-700/80 transition"
                        title="Print / View PDF Document"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/insurance/edit/${form._id}`}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-700/80 transition"
                        title="Edit DataSheet"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => onOpenDeleteModal(form._id, clientName)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-slate-700/80 transition cursor-pointer"
                        title="Delete DataSheet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-200">{startIndex + 1}</span> to{" "}
          <span className="font-bold text-slate-200">{Math.min(startIndex + itemsPerPage, forms.length)}</span> of{" "}
          <span className="font-bold text-slate-200">{forms.length}</span> proposals
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalTable;
