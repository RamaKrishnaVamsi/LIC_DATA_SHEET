import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AgentProfileModal from "./AgentProfileModal";

const AppLayout = ({ title = "Dashboard", search, setSearch, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Responsive Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenAgentModal={() => setShowAgentModal(true)}
      />

      {/* Main Layout Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        {/* Top Navbar */}
        <Topbar
          title={title}
          search={search}
          setSearch={setSearch}
          onToggleMobileSidebar={() => setIsMobileOpen(true)}
          onOpenAgentModal={() => setShowAgentModal(true)}
        />

        {/* Page Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Agent Profile Modal */}
      <AgentProfileModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
      />
    </div>
  );
};

export default AppLayout;
