import React from "react";
import { Search, Calendar, RefreshCw, Filter, ArrowUpDown, X } from "lucide-react";

const FilterBar = ({
  search,
  setSearch,
  selectedYear,
  setSelectedYear,
  availableYears = [],
  selectedMode,
  setSelectedMode,
  sortBy,
  setSortBy,
  loading,
  onRefresh,
}) => {
  const isFiltered = (search && search.trim() !== "") || selectedYear !== "all" || (selectedMode && selectedMode !== "all");

  const resetFilters = () => {
    setSearch("");
    setSelectedYear("all");
    setSelectedMode("all");
    setSortBy("newest");
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 shadow-xl relative overflow-hidden">
      {/* Search Input Box */}
      <div className="relative w-full md:w-80 lg:w-96">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client name, policy no, phone, agent..."
          className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters & Refresh Group */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
        {/* Year Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-slate-900 text-white">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr} className="bg-slate-900 text-white">
                Year {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Mode Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={selectedMode || "all"}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-slate-900 text-white">All Modes</option>
            <option value="Yearly" className="bg-slate-900 text-white">Yearly</option>
            <option value="Half-Yearly" className="bg-slate-900 text-white">Half-Yearly</option>
            <option value="Quarterly" className="bg-slate-900 text-white">Quarterly</option>
            <option value="Monthly (SSS)" className="bg-slate-900 text-white">Monthly (SSS)</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={sortBy || "newest"}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold outline-none cursor-pointer pr-1"
          >
            <option value="newest" className="bg-slate-900 text-white">Newest First</option>
            <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
            <option value="sum_desc" className="bg-slate-900 text-white">Sum Assured (High to Low)</option>
            <option value="prem_desc" className="bg-slate-900 text-white">Premium (High to Low)</option>
          </select>
        </div>

        {/* Reset Filters Pill */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-2.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Clear active search & filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
          title="Refresh proposals data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
