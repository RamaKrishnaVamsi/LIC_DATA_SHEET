import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Printer, ArrowLeft, ShieldCheck, Edit, FileText, CheckCircle2 } from "lucide-react";
import api from "../server/api.js";
import AppLayout from "../components/AppLayout.jsx";
import DocumentPreviewModal from "../components/DocumentPreviewModal.jsx";
import toast from "react-hot-toast";

const ViewInsurancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    api
      .get(`/insurance/${id}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setForm(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Fetch form error:", err);
        toast.error("Failed to load proposal document.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-medium">Loading DataSheet Document...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
        <h2 className="text-xl font-bold text-rose-400 mb-2">Proposal Form Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The requested insurance data sheet does not exist or was deleted.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

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
  const agent = form.agentDetails || {};

  return (
    <AppLayout title="Proposal Document Sheet">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition shrink-0"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">Client DataSheet Document</h1>
              <p className="text-xs text-slate-400">Policy #{s7.policyNo || "N/A"} • {s1.fullName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:space-x-3 w-full sm:w-auto">
            <Link
              to={`/insurance/edit/${id}`}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>Edit Form</span>
            </Link>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT SHEET CONTAINER */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 print:shadow-none print:rounded-none print:p-0 print:m-0 print:text-black overflow-hidden">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-800 font-extrabold text-xl tracking-tight uppercase">
                {/* <ShieldCheck className="w-7 h-7 text-blue-700" /> */}
                <img src="/LIC.jpg" className="w-7 h-7 text-blue-700" alt="" />
                <span>LIC PROPOSAL DATA SHEET</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Official Proposal Summary & Client Data Record
              </p>
            </div>
            <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-blue-600 pl-3 sm:pl-0 sm:pr-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Policy Number</p>
              <p className="text-lg font-mono font-bold text-blue-900">{s7.policyNo || "PENDING"}</p>
              <p className="text-[10px] text-slate-400">Date: {form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-IN") : "N/A"}</p>
            </div>
          </div>

          {/* Agent Representative Info Box */}
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-500 uppercase block">Agent / Representative</span>
              <span className="font-bold text-slate-800 text-sm">{agent.agentName || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block">Agent Code</span>
              <span className="font-bold text-slate-800 font-mono text-sm">{agent.agentCode || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block">Agent Contact</span>
              <span className="font-bold text-slate-800 text-sm">{agent.agentPhone || "N/A"}</span>
            </div>
          </div>

          {/* SECTION GRID */}
          <div className="space-y-6 text-xs">
            {/* 1 & 2: Personal & Contact */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                1 & 2. Applicant Personal & Address Details
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{s1.fullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Cell / Mobile</span>
                  <span className="font-medium text-slate-800">{s1.cellNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Gender & Age</span>
                  <span className="font-medium text-slate-800">{s1.gender || "N/A"} • {s1.age ? `${s1.age} yrs` : "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Email</span>
                  <span className="font-medium text-slate-800">{s2.email || "N/A"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block font-semibold">Full Address</span>
                  <span className="font-medium text-slate-800">{s2.fullAddress || "N/A"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block font-semibold">Spouse Address</span>
                  <span className="font-medium text-slate-800">{s2.spouseAddress || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* 3, 4, 5 & 6: Family Names & Employment */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                3, 4, 5 & 6. Family & Employment Information
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200 pb-4 mb-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Father's Name</span>
                  <span className="font-medium text-slate-900">{s3.fatherFullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Mother's Name</span>
                  <span className="font-medium text-slate-900">{s3.motherFullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Husband's Name</span>
                  <span className="font-medium text-slate-900">{s3.husbandFullName || "N/A"}</span>
                </div>
              </div>
              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Occupation</span>
                  <span className="font-medium text-slate-900">{s4.occupationDetails || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Employer / Org</span>
                  <span className="font-medium text-slate-900">{s5.organizationName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Monthly Income</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(s6.monthlyIncome)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">PAN / Tax No</span>
                  <span className="font-mono text-slate-800 font-medium">{s6.srNumberOrTaxNumber || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* 7 & 15: Policy & Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-blue-900 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                  7. Proposed Insurance Details
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-semibold">Sum Assured</span>
                    <span className="font-extrabold text-blue-900 text-base">{formatCurrency(s7.insuranceAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Premium Amount</span>
                    <span className="font-extrabold text-indigo-900 text-base">{formatCurrency(s7.premiumAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Payment Mode</span>
                    <span className="font-bold text-slate-800">{s7.paymentMode || "Yearly"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Policy Number</span>
                    <span className="font-mono font-bold text-slate-800">{s7.policyNo || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                  15. Bank Account Details
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-semibold">Bank Name</span>
                    <span className="font-bold text-slate-900">{s15.bankName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 uppercase">{s15.ifscCode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Account Number</span>
                    <span className="font-mono font-medium text-slate-900">{s15.bankAccountNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Branch</span>
                    <span className="font-medium text-slate-800">{s15.bankAddress || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 8, 9, 10, 11, 12, 13 & 14: Personal Identification, Nominee & Health */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                8-14. Identification, Nominee & Physical Health
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 border-b border-slate-200 pb-4 mb-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Date of Birth</span>
                  <span className="font-medium text-slate-900">
                    {s8.dateOfBirth ? new Date(s8.dateOfBirth).toLocaleDateString("en-IN") : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Place of Birth</span>
                  <span className="font-medium text-slate-900">{s8.placeOfBirth || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Aadhaar Number</span>
                  <span className="font-mono font-medium text-slate-900">{s9.aadhaarNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Education</span>
                  <span className="font-medium text-slate-900">{s9.educationalQualification || "N/A"}</span>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 border-b border-slate-200 pb-4 mb-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Nominee Name</span>
                  <span className="font-bold text-slate-900">{s10.nomineeFullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Nominee Age & Relation</span>
                  <span className="font-medium text-slate-900">{s10.nomineeAge ? `${s10.nomineeAge} yrs` : ""} • {s10.nomineeRelationship || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Height & Weight</span>
                  <span className="font-medium text-slate-900">{s12.heightCm ? `${s12.heightCm} cm` : "N/A"} • {s12.weightKg ? `${s12.weightKg} kg` : "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Identification Marks</span>
                  <span className="font-medium text-slate-900">{s13.mark1 || "N/A"} {s13.mark2 && `, ${s13.mark2}`}</span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <span className="text-slate-500 block font-semibold">Health & Disability Declaration</span>
                <span className="font-medium text-slate-800">{s14.healthDisabilityDetails || "No issues reported."}</span>
              </div>
            </div>

            {/* 16: Family History Table */}
            {s16.familyHistory && s16.familyHistory.length > 0 && (
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                  16. Family Health History
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="p-2.5">Relation</th>
                      <th className="p-2.5">Phone Number</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Living Health Details / Cause of Death</th>
                      <th className="p-2.5">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s16.familyHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium">{row.relationship}</td>
                        <td className="p-2.5 font-mono text-slate-800">{row.phoneNumber || "N/A"}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{row.isAlive ? "Living" : "Deceased"}</td>
                        <td className="p-2.5">{row.isAlive ? row.livingDetails || "Good" : row.causeOfDeath || "N/A"}</td>
                        <td className="p-2.5">{row.isAlive ? "-" : row.ageAtDeath ? `${row.ageAtDeath} yrs` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 17: Existing Policies Table */}
            {s17.previousPolicies && s17.previousPolicies.length > 0 && (
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider">
                  17. Previous Existing Insurance Policies
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="p-2.5">Policy No</th>
                      <th className="p-2.5">Institution</th>
                      <th className="p-2.5">Sum Assured</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s17.previousPolicies.map((pol, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-mono font-semibold">{pol.policyNumber || "N/A"}</td>
                        <td className="p-2.5">{pol.policyIssuingInstitution || "N/A"}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{formatCurrency(pol.sumAssured)}</td>
                        <td className="p-2.5 font-medium">{pol.isActive ? "Active" : "Lapsed"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 18: Uploaded Document Attachments */}
            {form.documents && form.documents.length > 0 && (
              <div className="border border-slate-300 rounded-xl overflow-hidden print:hidden">
                <div className="bg-slate-800 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>18. Uploaded Client Document Attachments</span>
                  <span className="font-mono text-[11px] font-normal">{form.documents.length} Attachment(s)</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {form.documents.map((doc, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                          {doc.fileCategory || "Document"}
                        </span>
                        <p className="font-bold text-xs text-slate-800 mt-1 truncate max-w-[150px]">{doc.fileName}</p>
                      </div>
                      {doc.fileData && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View File</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signature Footer for Print */}
          {(() => {
            const signatureDoc = (form.documents || []).find(
              (d) =>
                (d.fileCategory && d.fileCategory.toLowerCase().includes("signature")) ||
                (d.fileName && d.fileName.toLowerCase().includes("signature"))
            );

            return (
              <div className="mt-12 pt-8 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold text-slate-900">Agent Signature</p>
                  <div className="h-10"></div>
                  <p className="text-slate-500 font-medium">Date: ________________</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 mb-1">Applicant / Proposer Signature</p>
                  {signatureDoc && signatureDoc.fileData ? (
                    <div className="my-1 flex justify-end">
                      <img
                        src={signatureDoc.fileData}
                        alt="Customer Signature"
                        className="h-14 max-w-[180px] object-contain border-b border-slate-400 pb-1"
                      />
                    </div>
                  ) : (
                    <div className="h-10"></div>
                  )}
                  <p className="text-slate-500 font-medium mt-1">Place: ________________</p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Interactive Document Preview Modal */}
        {previewDoc && (
          <DocumentPreviewModal
            doc={previewDoc}
            onClose={() => setPreviewDoc(null)}
          />
        )}
    </AppLayout>
  );
};

export default ViewInsurancePage;
