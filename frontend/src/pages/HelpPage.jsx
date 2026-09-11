import React from "react";
import {
  HelpCircle,
  BookOpen,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  PlusCircle,
  Eye,
  Trash2,
  PhoneCall,
  Mail,
  ChevronRight
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";

const HelpPage = () => {
  return (
    <AppLayout title="Help & Portal User Manual">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">DataSheet Hub User Guide & FAQs</h2>
            <p className="text-xs text-slate-400 mt-1">
              Instructions for navigating the dashboard, managing proposal sheets, filtering, and client records.
            </p>
          </div>
        </div>

        {/* Dashboard Operations & Instructions Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Dashboard Features & Instructions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-blue-400 text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>1. Proposals & Datasheet Registry</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The primary table lists all proposal forms recorded by agents. Use the action buttons to inspect full details, edit proposal data, or print proposal sheets.
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-indigo-400 text-sm flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>2. Global Search & Filter Bar</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Filter proposal records instantly by entering client name, policy number, phone number, or agency code in the search bar. You can also filter by Financial Year or Payment Mode.
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>3. Creating New Proposals</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Click "+ New Proposal" in the sidebar or top navigation to open the full 8-section LIC proposal creation wizard (Personal Details, Policy Mode, Nominee Details, Agent Code, etc.).
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-amber-400 text-sm flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>4. Payment Mode Modal & Analytics</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Click on any payment mode card (Yearly, Half-Yearly, Quarterly, Monthly SSS) in the Analytics section to view a filtered popup listing all clients under that specific payment mode.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Form Submission Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Proposal Form Sections Explained</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">Sec 1</span>
              <div>
                <p className="font-bold text-slate-200">Personal & Contact Details</p>
                <p className="text-slate-400">Captures Proposer's Name, DOB, Gender, Cell Number, Email, Address, and Occupation.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">Sec 7</span>
              <div>
                <p className="font-bold text-slate-200">Policy Plan & Sum Assured</p>
                <p className="text-slate-400">Captures Policy Number, Plan Name, Term, Sum Assured Amount, Premium Amount, and Payment Mode (Yearly, Half-Yearly, Quarterly, Monthly SSS).</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">Sec 8</span>
              <div>
                <p className="font-bold text-slate-200">Nominee & Beneficiary Information</p>
                <p className="text-slate-400">Captures Nominee Full Name, Relationship, Age, and Appointee details for minors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Need Additional Assistance?</h4>
            <p className="text-xs text-slate-400 mt-1">Our portal technical support desk is ready to help you.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <a href="mailto:support@datasheethub.lic" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center space-x-2 transition">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
