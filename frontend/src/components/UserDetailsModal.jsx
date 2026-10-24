import React, { useState } from "react";
import { Link } from "react-router-dom";
import DocumentPreviewModal from "./DocumentPreviewModal.jsx";
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Heart,
  Users,
  FileText,
  X,
  Printer,
  Edit,
  Calendar,
  Building,
  CheckCircle,
  Award
} from "lucide-react";

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

const UserDetailsModal = ({ form, onClose }) => {
  const [previewDoc, setPreviewDoc] = useState(null);

  if (!form) return null;

  const s1 = form.section1 || {};
  const s2 = form.section2 || {};
  const s3 = form.section3 || {};
  const s4 = form.section4 || {};
  const s5 = form.section5 || {};
  const s6 = form.section6 || {};
  const s7 = form.section7 || {};
  const s8 = form.section8 || {};
  const s9 = form.section9 || {};
  const s10 = form.section10 || {};
  const s11 = form.section11 || {};
  const s12 = form.section12 || {};
  const s13 = form.section13 || {};
  const s14 = form.section14 || {};
  const s15 = form.section15 || {};
  const s16 = form.section16 || {};
  const s17 = form.section17 || {};
  const s18 = form.section18 || {};
  const agent = form.agentDetails || {};

  const paymentMode = s7.paymentMode || "Yearly";
  const mult = getYearlyMultiplier(paymentMode);
  const premium = Number(s7.premiumAmount) || 0;
  const yearlyPremium = premium * mult;

  const dobStr = s8.dateOfBirth
    ? new Date(s8.dateOfBirth).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  const createdStr = form.createdAt
    ? new Date(form.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-slate-900 p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg border border-blue-400/30 shrink-0">
              {s1.fullName ? s1.fullName[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  {s1.fullName || "Client Details"}
                </h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Policy Client
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                {s1.cellNumber && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{s1.cellNumber}</span>
                  </span>
                )}
                {s2.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{s2.email}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Created: {createdStr}</span>
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {/* Key Insurance Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Policy Number & Mode
              </span>
              <div className="font-mono text-lg font-bold text-blue-400">
                Pol #{s7.policyNo || "N/A"}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Payment Mode: <span className="font-semibold text-white">{paymentMode}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Sum Assured
              </span>
              <div className="text-lg font-bold text-emerald-400">
                {formatCurrency(s7.insuranceAmount)}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Total Insurance Coverage</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Yearly Premium Collected
              </span>
              <div className="text-lg font-bold text-indigo-400">
                {formatCurrency(yearlyPremium)} <span className="text-xs font-medium text-slate-400">/ yr</span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Installment: <span className="font-semibold text-white">{formatCurrency(premium)}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Personal & Contact Information */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal & Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Full Name</span>
                <span className="font-medium text-slate-100">{s1.fullName || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Gender & Age</span>
                <span className="font-medium text-slate-100">
                  {s1.gender || "N/A"} {s1.age ? `(${s1.age} yrs)` : ""}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Date of Birth</span>
                <span className="font-medium text-slate-100">{dobStr}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Place of Birth</span>
                <span className="font-medium text-slate-100">{s8.placeOfBirth || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Aadhaar Number</span>
                <span className="font-medium text-slate-100">{s9.aadhaarNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Educational Qualification</span>
                <span className="font-medium text-slate-100">{s9.educationalQualification || "N/A"}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-400 block">Full Address</span>
                <span className="font-medium text-slate-100">{s2.fullAddress || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Spouse Address</span>
                <span className="font-medium text-slate-100">{s2.spouseAddress || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Father's Name</span>
                <span className="font-medium text-slate-100">{s3.fatherFullName || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Mother's Name</span>
                <span className="font-medium text-slate-100">{s3.motherFullName || "N/A"}</span>
              </div>
              {s3.husbandFullName && (
                <div>
                  <span className="text-xs text-slate-400 block">Husband's Name</span>
                  <span className="font-medium text-slate-100">{s3.husbandFullName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Employment & Income Details */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Employment & Financial Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Occupation</span>
                <span className="font-medium text-slate-100">{s4.occupationDetails || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Monthly Income</span>
                <span className="font-medium text-emerald-400">{formatCurrency(s6.monthlyIncome)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Completed Service</span>
                <span className="font-medium text-slate-100">
                  {s6.completedService ? `${s6.completedService} Years` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Organization Name</span>
                <span className="font-medium text-slate-100">{s5.organizationName || "N/A"}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-400 block">Organization Address</span>
                <span className="font-medium text-slate-100">{s5.organizationAddress || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">S.R. No. / Tax No</span>
                <span className="font-medium text-slate-100">{s6.srNumberOrTaxNumber || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Nominee, Health & Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nominee & Appointee */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Nominee & Appointee Details</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block">Nominee Name</span>
                  <span className="font-semibold text-slate-100">{s10.nomineeFullName || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Nominee Age</span>
                    <span className="font-medium text-slate-100">{s10.nomineeAge ? `${s10.nomineeAge} yrs` : "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Relationship</span>
                    <span className="font-medium text-slate-100">{s10.nomineeRelationship || "N/A"}</span>
                  </div>
                </div>
                {s11.appointeeFullName && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400 block">Appointee Name</span>
                    <span className="font-semibold text-slate-100">{s11.appointeeFullName}</span>
                    <div className="text-xs text-slate-400 mt-1">
                      Age: {s11.appointeeAge} | Relationship: {s11.appointeeRelationshipWithNominee}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Bank Account Details</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block">Bank Name</span>
                  <span className="font-semibold text-slate-100">{s15.bankName || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Account Number</span>
                    <span className="font-mono font-medium text-slate-100">{s15.bankAccountNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">IFSC Code</span>
                    <span className="font-mono font-medium text-cyan-400">{s15.ifscCode || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Bank Branch Address</span>
                  <span className="font-medium text-slate-100">{s15.bankAddress || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Family Health History */}
          {s16.familyHistory && s16.familyHistory.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Family Health History & Contact Details</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-2">Relation</th>
                      <th className="p-2">Phone Number</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Living Details / Cause</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {s16.familyHistory.map((mem, i) => (
                      <tr key={i}>
                        <td className="p-2 font-semibold text-white">{mem.relationship}</td>
                        <td className="p-2 font-mono text-blue-400">{mem.phoneNumber || "N/A"}</td>
                        <td className="p-2">{mem.isAlive ? <span className="text-emerald-400 font-semibold">Living</span> : <span className="text-slate-400">Deceased</span>}</td>
                        <td className="p-2">{mem.isAlive ? mem.livingDetails || "Good" : mem.causeOfDeath || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Previous Insurance Policies */}
          {s17.previousPolicies && s17.previousPolicies.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Existing / Previous Insurance Policies</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-2">Policy No</th>
                      <th className="p-2">Institution</th>
                      <th className="p-2">Sum Assured</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {s17.previousPolicies.map((pol, i) => (
                      <tr key={i}>
                        <td className="p-2 font-mono font-semibold text-white">{pol.policyNumber || "N/A"}</td>
                        <td className="p-2">{pol.policyIssuingInstitution || "N/A"}</td>
                        <td className="p-2 font-semibold text-emerald-400">{formatCurrency(pol.sumAssured)}</td>
                        <td className="p-2">
                          {pol.isActive ? (
                            <span className="text-emerald-400 font-semibold">Active</span>
                          ) : (
                            <span className="text-slate-400">Lapsed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Health, Physical & Agent Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health & Identification */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Health & Physical Identification</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Height & Weight</span>
                  <span className="font-medium text-slate-100">
                    {s12.heightCm ? `${s12.heightCm} cm` : "N/A"} / {s12.weightKg ? `${s12.weightKg} kg` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Identification Marks</span>
                  <span className="font-medium text-slate-100">
                    {s13.mark1 || "N/A"} {s13.mark2 ? `, ${s13.mark2}` : ""}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Health / Disability Status</span>
                  <span className="font-medium text-slate-200">
                    {s14.healthDisabilityDetails || "No major issues reported."}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent / Representative Details */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>LIC Agent / Representative Info</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block">Agent Name</span>
                  <span className="font-semibold text-slate-100">{agent.agentName || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Agent Code</span>
                    <span className="font-mono font-medium text-indigo-400">{agent.agentCode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Agent Phone</span>
                    <span className="font-medium text-slate-100">{agent.agentPhone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Attached Client Documents */}
          {form.documents && form.documents.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Attached Client Documents ({form.documents.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {form.documents.map((doc, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {doc.fileCategory || "Attachment"}
                      </span>
                      <p className="font-bold text-slate-100 text-xs mt-1 truncate max-w-[160px]">{doc.fileName}</p>
                    </div>
                    {doc.fileData && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Form Record ID: <span className="font-mono text-slate-300">{form._id}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/insurance/view/${form._id}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600/20 text-slate-200 hover:text-blue-400 border border-slate-700 text-xs font-semibold transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / View DataSheet</span>
            </Link>

            <Link
              to={`/insurance/edit/${form._id}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Form</span>
            </Link>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};

export default UserDetailsModal;
