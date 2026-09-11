import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  Save,
  ArrowLeft,
  Wand2,
  Plus,
  Trash2,
  User,
  MapPin,
  Briefcase,
  Building,
  CreditCard,
  Heart,
  FileSpreadsheet,
  Users,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import api from "../server/api.js";
import AppLayout from "../components/AppLayout.jsx";
import DocumentPreviewModal from "../components/DocumentPreviewModal.jsx";
import toast from "react-hot-toast";

const initialFormState = {
  createdAt: new Date().toISOString().split("T")[0],
  documents: [],
  agentDetails: { agentName: "", agentPhone: "", agentCode: "" },
  section1: { fullName: "", cellNumber: "", gender: "Male", age: "" },
  section2: { fullAddress: "", email: "", spouseAddress: "" },
  section3: { fatherFullName: "", motherFullName: "", husbandFullName: "" },
  section4: { occupationDetails: "" },
  section5: { organizationName: "", organizationAddress: "" },
  section6: { monthlyIncome: "", completedService: "", srNumberOrTaxNumber: "" },
  section7: { policyNo: "", insuranceAmount: "", premiumAmount: "", paymentMode: "Yearly" },
  section8: { dateOfBirth: "", age: "", placeOfBirth: "" },
  section9: { educationalQualification: "", aadhaarNumber: "" },
  section10: { nomineeFullName: "", nomineeAge: "", nomineeRelationship: "" },
  section11: { appointeeFullName: "", appointeeAge: "", appointeeRelationshipWithNominee: "" },
  section12: { heightCm: "", weightKg: "" },
  section13: { mark1: "", mark2: "" },
  section14: { healthDisabilityDetails: "No major health issues or physical disability." },
  section15: { bankAccountNumber: "", ifscCode: "", bankName: "", bankAddress: "" },
  section16: {
    familyHistory: [
      { relationship: "Father", isAlive: true, livingDetails: "Good health", causeOfDeath: "", ageAtDeath: "", phoneNumber: "" },
      { relationship: "Mother", isAlive: true, livingDetails: "Good health", causeOfDeath: "", ageAtDeath: "", phoneNumber: "" },
    ],
  },
  section17: {
    previousPolicies: [
      {
        policyNumber: "",
        policyHolderName: "",
        dAndD: "",
        sumAssured: "",
        policyIssuingInstitution: "LIC of India",
        mode: "Yearly",
        isActive: true,
      },
    ],
  },
  section18: {
    husbandName: "",
    husbandOccupation: "",
    husbandMonthlyIncome: "",
    lastDeliveryDate: "",
    husbandPolicies: [],
  },
};

const InsuranceFormPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [docCategory, setDocCategory] = useState("Customer Signature / Specimen Signature");
  const [docCustomName, setDocCustomName] = useState("");

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let processedCount = 0;
    const newDocs = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB limit and was skipped.`);
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newDocs.push({
          fileName: files.length === 1 && docCustomName.trim() ? docCustomName.trim() : file.name,
          fileCategory: docCategory,
          fileData: reader.result,
          uploadedAt: new Date().toISOString(),
        });

        processedCount++;
        if (processedCount === files.length) {
          if (newDocs.length > 0) {
            setFormData((prev) => ({
              ...prev,
              documents: [...(prev.documents || []), ...newDocs],
            }));
            setDocCustomName("");
            toast.success(`Successfully uploaded ${newDocs.length} document(s)!`);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((_, idx) => idx !== index),
    }));
    toast.success("Document removed.");
  };

  useEffect(() => {
    if (isEditMode) {
      setFetching(true);
      api 
        .get(`/insurance/${id}`)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const d = res.data.data;
            // Format dates if needed
            if (d.createdAt) {
              d.createdAt = d.createdAt.split("T")[0];
            }
            if (d.section8?.dateOfBirth) {
              d.section8.dateOfBirth = d.section8.dateOfBirth.split("T")[0];
            }
            if (d.section18?.lastDeliveryDate) {
              d.section18.lastDeliveryDate = d.section18.lastDeliveryDate.split("T")[0];
            }
            setFormData({
              ...initialFormState,
              ...d,
            });
          }
        })
        .catch((err) => {
          console.error("Fetch form error:", err);
          toast.error("Failed to load existing insurance form.");
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditMode]);

  // Handler for nested field changes
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Autofill sample demo data for rapid testing
  const handleAutofill = () => {
    setFormData({
      agentDetails: {
        agentName: "Rongala Srinivasa Rao",
        agentPhone: "9876543210",
        agentCode: "LIC-145869M",
      },
      section1: {
        fullName: "Venkata Siva Ram",
        cellNumber: "9123456789",
        gender: "Male",
        age: 28,
      },
      section2: {
        fullAddress: "Flat 402, Royal Palms, Banjara Hills, Hyderabad, Telangana - 500034",
        email: "vamsi.client@example.com",
        spouseAddress: "Same as personal address",
      },
      section3: {
        fatherFullName: "Srinivasa Rao",
        motherFullName: "Satya Vathi Srinivas",
        husbandFullName: "",
      },
      section4: {
        occupationDetails: "Senior Software Engineer / IT Consultant",
      },
      section5: {
        organizationName: "Tech Corp Solutions Ltd",
        organizationAddress: "Building 3, Mindspace IT Park, Hitec City, Hyderabad",
      },
      section6: {
        monthlyIncome: 125000,
        completedService: 5,
        srNumberOrTaxNumber: "PAN: ABCDE1234F",
      },
      section7: {
        policyNo: Math.floor(100000000 + Math.random() * 900000000),
        insuranceAmount: 1000000,
        premiumAmount: 48500,
        paymentMode: "Yearly",
      },
      section8: {
        dateOfBirth: "1998-05-15",
        age: 28,
        placeOfBirth: "Hyderabad",
      },
      section9: {
        educationalQualification: "B.Tech in Computer Science",
        aadhaarNumber: "1234 5678 9012",
      },
      section10: {
        nomineeFullName: "Srinivasa Rao",
        nomineeAge: 56,
        nomineeRelationship: "Father",
      },
      section11: {
        appointeeFullName: "",
        appointeeAge: "",
        appointeeRelationshipWithNominee: "",
      },
      section12: {
        heightCm: 175,
        weightKg: 72,
      },
      section13: {
        mark1: "Mole on right arm",
        mark2: "Scar on left shoulder",
      },
      section14: {
        healthDisabilityDetails: "Good overall health. No chronic illnesses or surgeries.",
      },
      section15: {
        bankAccountNumber: "98765432109876",
        ifscCode: "HDFC0001234",
        bankName: "HDFC Bank",
        bankAddress: "Banjara Hills Branch, Hyderabad",
      },
      section16: {
        familyHistory: [
          { relationship: "Father", isAlive: true, livingDetails: "56 yrs, Healthy", causeOfDeath: "", ageAtDeath: "" },
          { relationship: "Mother", isAlive: true, livingDetails: "52 yrs, Healthy", causeOfDeath: "", ageAtDeath: "" },
          { relationship: "Brother", isAlive: true, livingDetails: "24 yrs, Healthy", causeOfDeath: "", ageAtDeath: "" },
        ],
      },
      section17: {
        previousPolicies: [
          {
            policyNumber: "654321098",
            policyHolderName: "Venkata Satya Vamsi",
            dAndD: "Accidental Rider",
            sumAssured: 500000,
            policyIssuingInstitution: "LIC of India",
            mode: "Yearly",
            isActive: true,
          },
        ],
      },
      section18: {
        husbandName: "",
        husbandOccupation: "",
        husbandMonthlyIncome: "",
        lastDeliveryDate: "",
        husbandPolicies: [],
      },
    });
    toast.success("Demo proposal data populated successfully!");
  };

  // Dynamic Array Handlers
  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      section16: {
        ...prev.section16,
        familyHistory: [
          ...prev.section16.familyHistory,
          { relationship: "", isAlive: true, livingDetails: "", causeOfDeath: "", ageAtDeath: "" },
        ],
      },
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      section16: {
        ...prev.section16,
        familyHistory: prev.section16.familyHistory.filter((_, i) => i !== index),
      },
    }));
  };

  const addPreviousPolicy = () => {
    setFormData((prev) => ({
      ...prev,
      section17: {
        ...prev.section17,
        previousPolicies: [
          ...prev.section17.previousPolicies,
          {
            policyNumber: "",
            policyHolderName: "",
            dAndD: "",
            sumAssured: "",
            policyIssuingInstitution: "LIC of India",
            mode: "Yearly",
            isActive: true,
          },
        ],
      },
    }));
  };

  const removePreviousPolicy = (index) => {
    setFormData((prev) => ({
      ...prev,
      section17: {
        ...prev.section17,
        previousPolicies: prev.section17.previousPolicies.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.section1?.fullName) {
      toast.error("Client Full Name is required in Section 1.");
      setActiveTab(1);
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const response = await api.put(`/insurance/${id}`, formData);
        if (response.data?.success) {
          toast.success("Insurance proposal updated successfully!");
          navigate("/");
        }
      } else {
        const response = await api.post("/insurance", formData);
        if (response.data?.success) {
          toast.success("Insurance proposal created successfully!");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Save form error:", err);
      toast.error(err.response?.data?.message || "Failed to save insurance proposal form.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-medium">Loading Insurance Form Data...</p>
      </div>
    );
  }

  const tabs = [
    { id: 1, label: "Agent & Personal", icon: User },
    { id: 2, label: "Employment & Financial", icon: Briefcase },
    { id: 3, label: "Policy & Bank Details", icon: CreditCard },
    { id: 4, label: "Nominee & Physical", icon: Heart },
    { id: 5, label: "Family & History", icon: Users },
    { id: 6, label: "Documents & Attachments", icon: FileSpreadsheet },
  ];

  return (
    <AppLayout title={isEditMode ? "Edit Proposal DataSheet" : "New Insurance Proposal"}>
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isEditMode ? "Edit Insurance Proposal DataSheet" : "New Insurance Proposal DataSheet"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete official LIC client proposal form details (18 Sections)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:space-x-3 w-full sm:w-auto justify-start sm:justify-end">
          <button
            type="button"
            onClick={handleAutofill}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Auto-Fill Demo Data</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{loading ? "Saving..." : isEditMode ? "Update Form" : "Save Proposal"}</span>
          </button>
        </div>
      </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TAB 1: Agent Details & Personal & Contact Info */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Agent Information */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Agent / Representative Details & Creation Date</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={formData.agentDetails?.agentName || ""}
                      onChange={(e) => handleNestedChange("agentDetails", "agentName", e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Agent Phone
                    </label>
                    <input
                      type="text"
                      value={formData.agentDetails?.agentPhone || ""}
                      onChange={(e) => handleNestedChange("agentDetails", "agentPhone", e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Agent Code
                    </label>
                    <input
                      type="text"
                      value={formData.agentDetails?.agentCode || ""}
                      onChange={(e) => handleNestedChange("agentDetails", "agentCode", e.target.value)}
                      placeholder="LIC-123456"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                      Proposal Creation Date
                    </label>
                    <input
                      type="date"
                      value={formData.createdAt ? String(formData.createdAt).split("T")[0] : new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, createdAt: e.target.value }))}
                      className="w-full bg-slate-800 border border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 1: Personal Info */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Section 1: Applicant Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.section1?.fullName || ""}
                      onChange={(e) => handleNestedChange("section1", "fullName", e.target.value)}
                      placeholder="Full legal name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Cell / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={formData.section1?.cellNumber || ""}
                      onChange={(e) => handleNestedChange("section1", "cellNumber", e.target.value)}
                      placeholder="Mobile number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.section1?.gender || "Male"}
                      onChange={(e) => handleNestedChange("section1", "gender", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 & 3: Contact & Parents */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Section 2 & 3: Contact & Parent Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Full Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.section2?.fullAddress || ""}
                      onChange={(e) => handleNestedChange("section2", "fullAddress", e.target.value)}
                      placeholder="Complete residential address"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Spouse Address (If different)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.section2?.spouseAddress || ""}
                      onChange={(e) => handleNestedChange("section2", "spouseAddress", e.target.value)}
                      placeholder="Spouse address"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.section2?.email || ""}
                      onChange={(e) => handleNestedChange("section2", "email", e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Father's Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.section3?.fatherFullName || ""}
                      onChange={(e) => handleNestedChange("section3", "fatherFullName", e.target.value)}
                      placeholder="Father's name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Mother's Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.section3?.motherFullName || ""}
                      onChange={(e) => handleNestedChange("section3", "motherFullName", e.target.value)}
                      placeholder="Mother's name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Employment, Organization & Income */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Section 4, 5 & 6: Occupation & Employment Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Occupation Details
                    </label>
                    <input
                      type="text"
                      value={formData.section4?.occupationDetails || ""}
                      onChange={(e) => handleNestedChange("section4", "occupationDetails", e.target.value)}
                      placeholder="e.g. Software Engineer / Business Owner"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Employer / Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.section5?.organizationName || ""}
                      onChange={(e) => handleNestedChange("section5", "organizationName", e.target.value)}
                      placeholder="e.g. Infosys Ltd"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Employer Address
                  </label>
                  <input
                    type="text"
                    value={formData.section5?.organizationAddress || ""}
                    onChange={(e) => handleNestedChange("section5", "organizationAddress", e.target.value)}
                    placeholder="Organization full address"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Monthly Income (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.section6?.monthlyIncome || ""}
                      onChange={(e) => handleNestedChange("section6", "monthlyIncome", e.target.value)}
                      placeholder="Monthly income in INR"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Completed Service (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.section6?.completedService || ""}
                      onChange={(e) => handleNestedChange("section6", "completedService", e.target.value)}
                      placeholder="Service in years"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      S.R. No. / Tax No. / PAN
                    </label>
                    <input
                      type="text"
                      value={formData.section6?.srNumberOrTaxNumber || ""}
                      onChange={(e) => handleNestedChange("section6", "srNumberOrTaxNumber", e.target.value)}
                      placeholder="PAN / Tax Number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Policy & Bank Details */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {/* Section 7: Policy Details */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Section 7: Policy & Premium Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Policy Number
                    </label>
                    <input
                      type="number"
                      value={formData.section7?.policyNo || ""}
                      onChange={(e) => handleNestedChange("section7", "policyNo", e.target.value)}
                      placeholder="e.g. 654321987"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Insurance / Sum Assured (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.section7?.insuranceAmount || ""}
                      onChange={(e) => handleNestedChange("section7", "insuranceAmount", e.target.value)}
                      placeholder="1000000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Premium Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.section7?.premiumAmount || ""}
                      onChange={(e) => handleNestedChange("section7", "premiumAmount", e.target.value)}
                      placeholder="45000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formData.section7?.paymentMode || "Yearly"}
                      onChange={(e) => handleNestedChange("section7", "paymentMode", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="Yearly">Yearly</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Monthly (SSS)">Monthly (SSS)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 15: Bank Details */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Section 15: Bank Account Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.section15?.bankAccountNumber || ""}
                      onChange={(e) => handleNestedChange("section15", "bankAccountNumber", e.target.value)}
                      placeholder="A/c Number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={formData.section15?.ifscCode || ""}
                      onChange={(e) => handleNestedChange("section15", "ifscCode", e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.section15?.bankName || ""}
                      onChange={(e) => handleNestedChange("section15", "bankName", e.target.value)}
                      placeholder="e.g. HDFC Bank / SBI"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Bank Branch Address
                  </label>
                  <input
                    type="text"
                    value={formData.section15?.bankAddress || ""}
                    onChange={(e) => handleNestedChange("section15", "bankAddress", e.target.value)}
                    placeholder="Branch location"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Nominee, Appointee & Physical Health */}
          {activeTab === 4 && (
            <div className="space-y-6">
              {/* Section 8 & 9: DOB & Aadhaar */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Section 8 & 9: Birth & Identification</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.section8?.dateOfBirth || ""}
                      onChange={(e) => handleNestedChange("section8", "dateOfBirth", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.section8?.age || ""}
                      onChange={(e) => handleNestedChange("section8", "age", e.target.value)}
                      placeholder="Age"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      value={formData.section8?.placeOfBirth || ""}
                      onChange={(e) => handleNestedChange("section8", "placeOfBirth", e.target.value)}
                      placeholder="City/Town"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={formData.section9?.aadhaarNumber || ""}
                      onChange={(e) => handleNestedChange("section9", "aadhaarNumber", e.target.value)}
                      placeholder="12 digit Aadhaar"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 10 & 11: Nominee & Appointee */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Section 10 & 11: Nominee & Appointee Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nominee Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.section10?.nomineeFullName || ""}
                      onChange={(e) => handleNestedChange("section10", "nomineeFullName", e.target.value)}
                      placeholder="Nominee name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nominee Age
                    </label>
                    <input
                      type="number"
                      value={formData.section10?.nomineeAge || ""}
                      onChange={(e) => handleNestedChange("section10", "nomineeAge", e.target.value)}
                      placeholder="Nominee age"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Relationship with Applicant
                    </label>
                    <input
                      type="text"
                      value={formData.section10?.nomineeRelationship || ""}
                      onChange={(e) => handleNestedChange("section10", "nomineeRelationship", e.target.value)}
                      placeholder="e.g. Spouse / Father / Son"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Appointee Full Name (If Nominee Minor)
                    </label>
                    <input
                      type="text"
                      value={formData.section11?.appointeeFullName || ""}
                      onChange={(e) => handleNestedChange("section11", "appointeeFullName", e.target.value)}
                      placeholder="Appointee name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Appointee Age
                    </label>
                    <input
                      type="number"
                      value={formData.section11?.appointeeAge || ""}
                      onChange={(e) => handleNestedChange("section11", "appointeeAge", e.target.value)}
                      placeholder="Appointee age"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Appointee Relation with Nominee
                    </label>
                    <input
                      type="text"
                      value={formData.section11?.appointeeRelationshipWithNominee || ""}
                      onChange={(e) => handleNestedChange("section11", "appointeeRelationshipWithNominee", e.target.value)}
                      placeholder="e.g. Guardian"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 12, 13 & 14: Physical & Health */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Section 12, 13 & 14: Physical Measurements & Health History</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.section12?.heightCm || ""}
                      onChange={(e) => handleNestedChange("section12", "heightCm", e.target.value)}
                      placeholder="175"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.section12?.weightKg || ""}
                      onChange={(e) => handleNestedChange("section12", "weightKg", e.target.value)}
                      placeholder="70"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Identification Mark 1
                    </label>
                    <input
                      type="text"
                      value={formData.section13?.mark1 || ""}
                      onChange={(e) => handleNestedChange("section13", "mark1", e.target.value)}
                      placeholder="Mole/Scar 1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Identification Mark 2
                    </label>
                    <input
                      type="text"
                      value={formData.section13?.mark2 || ""}
                      onChange={(e) => handleNestedChange("section13", "mark2", e.target.value)}
                      placeholder="Mole/Scar 2"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Health / Disability Details
                  </label>
                  <textarea
                    rows={2}
                    value={formData.section14?.healthDisabilityDetails || ""}
                    onChange={(e) => handleNestedChange("section14", "healthDisabilityDetails", e.target.value)}
                    placeholder="Details of any medical conditions, disability or surgery history"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Family History & Dynamic Tables */}
          {activeTab === 5 && (
            <div className="space-y-6">
              {/* Section 16: Family History */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Section 16: Family Health History</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addFamilyMember}
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                {formData.section16?.familyHistory?.map((row, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 mb-3 grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Relation</label>
                      <input
                        type="text"
                        value={row.relationship}
                        onChange={(e) => {
                          const updated = [...formData.section16.familyHistory];
                          updated[idx].relationship = e.target.value;
                          setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                        }}
                        placeholder="Father/Mother"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-blue-400 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={row.phoneNumber || ""}
                        onChange={(e) => {
                          const updated = [...formData.section16.familyHistory];
                          updated[idx].phoneNumber = e.target.value;
                          setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                        }}
                        placeholder="Cell/Phone No"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Status</label>
                      <select
                        value={row.isAlive ? "alive" : "deceased"}
                        onChange={(e) => {
                          const updated = [...formData.section16.familyHistory];
                          updated[idx].isAlive = e.target.value === "alive";
                          setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="alive">Living</option>
                        <option value="deceased">Deceased</option>
                      </select>
                    </div>
                    {row.isAlive ? (
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Living Details / Health State</label>
                        <input
                          type="text"
                          value={row.livingDetails || ""}
                          onChange={(e) => {
                            const updated = [...formData.section16.familyHistory];
                            updated[idx].livingDetails = e.target.value;
                            setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                          }}
                          placeholder="Age & Health state"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Cause of Death</label>
                          <input
                            type="text"
                            value={row.causeOfDeath || ""}
                            onChange={(e) => {
                              const updated = [...formData.section16.familyHistory];
                              updated[idx].causeOfDeath = e.target.value;
                              setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                            }}
                            placeholder="Cause"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Age at Death</label>
                          <input
                            type="number"
                            value={row.ageAtDeath || ""}
                            onChange={(e) => {
                              const updated = [...formData.section16.familyHistory];
                              updated[idx].ageAtDeath = e.target.value;
                              setFormData({ ...formData, section16: { ...formData.section16, familyHistory: updated } });
                            }}
                            placeholder="Age"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-end md:mt-4">
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(idx)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 17: Existing Previous Policies */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Section 17: Details of Existing / Previous Policies</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addPreviousPolicy}
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Policy</span>
                  </button>
                </div>

                {formData.section17?.previousPolicies?.map((pol, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 mb-3 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Policy Number</label>
                      <input
                        type="text"
                        value={pol.policyNumber}
                        onChange={(e) => {
                          const updated = [...formData.section17.previousPolicies];
                          updated[idx].policyNumber = e.target.value;
                          setFormData({ ...formData, section17: { ...formData.section17, previousPolicies: updated } });
                        }}
                        placeholder="Policy No"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Policy Holder Name</label>
                      <input
                        type="text"
                        value={pol.policyHolderName}
                        onChange={(e) => {
                          const updated = [...formData.section17.previousPolicies];
                          updated[idx].policyHolderName = e.target.value;
                          setFormData({ ...formData, section17: { ...formData.section17, previousPolicies: updated } });
                        }}
                        placeholder="Holder Name"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Sum Assured</label>
                      <input
                        type="number"
                        value={pol.sumAssured}
                        onChange={(e) => {
                          const updated = [...formData.section17.previousPolicies];
                          updated[idx].sumAssured = e.target.value;
                          setFormData({ ...formData, section17: { ...formData.section17, previousPolicies: updated } });
                        }}
                        placeholder="Amount"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Institution</label>
                      <input
                        type="text"
                        value={pol.policyIssuingInstitution}
                        onChange={(e) => {
                          const updated = [...formData.section17.previousPolicies];
                          updated[idx].policyIssuingInstitution = e.target.value;
                          setFormData({ ...formData, section17: { ...formData.section17, previousPolicies: updated } });
                        }}
                        placeholder="LIC / HDFC Life"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Status</label>
                      <select
                        value={pol.isActive ? "active" : "lapsed"}
                        onChange={(e) => {
                          const updated = [...formData.section17.previousPolicies];
                          updated[idx].isActive = e.target.value === "active";
                          setFormData({ ...formData, section17: { ...formData.section17, previousPolicies: updated } });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="active">Active</option>
                        <option value="lapsed">Lapsed / Paid Up</option>
                      </select>
                    </div>
                    <div className="flex justify-end md:mt-4">
                      <button
                        type="button"
                        onClick={() => removePreviousPolicy(idx)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Document Attachments & Proofs */}
          {activeTab === 6 && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Upload Client Documents & Customer Signature</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Total Uploaded: <span className="font-bold text-white">{(formData.documents || []).length}</span>
                  </span>
                </div>

                {/* Quick Customer Signature Upload Box */}
                <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Customer / Proposer Specimen Signature</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Upload the customer's signature image (JPG/PNG). It will print directly on the official LIC proposal sheet.
                      </p>
                    </div>

                    <label className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 cursor-pointer transition shrink-0">
                      <Plus className="w-4 h-4" />
                      <span>Upload Signature</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newDoc = {
                              fileName: `${formData.section1?.fullName || "Customer"}_Signature`,
                              fileCategory: "Customer Signature / Specimen Signature",
                              fileData: reader.result,
                              uploadedAt: new Date().toISOString(),
                            };
                            setFormData((prev) => ({
                              ...prev,
                              documents: [...(prev.documents || []), newDoc],
                            }));
                            toast.success("Customer signature uploaded successfully!");
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Upload Multiple Files Form Box */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Upload Multiple Client Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Document Category / Type
                      </label>
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      >
                        <option value="Customer Signature / Specimen Signature">Customer Signature / Specimen Signature</option>
                        <option value="Aadhaar Card Proof">Aadhaar Card Proof</option>
                        <option value="PAN Card Proof">PAN Card Proof</option>
                        <option value="Income / Salary Proof">Income / Salary Proof</option>
                        <option value="Medical Report / Health Certificate">Medical Report / Health Certificate</option>
                        <option value="Passport / Photo ID">Passport / Photo ID</option>
                        <option value="Bank Passbook / Cheque">Bank Passbook / Cheque</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Proposal Physical Form Copy">Proposal Physical Form Copy</option>
                        <option value="Other Attachment">Other Attachment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Custom Label (For single file)
                      </label>
                      <input
                        type="text"
                        value={docCustomName}
                        onChange={(e) => setDocCustomName(e.target.value)}
                        placeholder="e.g. Client_Aadhaar_Front.jpg"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Select Documents (Supports Multiple)
                      </label>
                      <label className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition">
                        <Plus className="w-4 h-4" />
                        <span>Choose Multiple Files & Upload</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Attached Documents Ledger</h4>
                  {(!formData.documents || formData.documents.length === 0) ? (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      No document files uploaded yet. Select a category and choose a file to attach.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.documents.map((doc, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {doc.fileCategory || "Document"}
                              </span>
                              <h5 className="font-bold text-white text-xs mt-2 truncate max-w-[180px]">{doc.fileName}</h5>
                              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-IN") : ""}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(idx)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {doc.fileData && (
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                              {doc.fileData.startsWith("data:image") ? (
                                <img src={doc.fileData} alt={doc.fileName} className="w-10 h-10 object-cover rounded-lg border border-slate-700" />
                              ) : (
                                <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                              )}
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[11px] font-bold transition cursor-pointer"
                              >
                                View / Preview
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document Preview Modal */}
          {previewDoc && (
            <DocumentPreviewModal
              doc={previewDoc}
              onClose={() => setPreviewDoc(null)}
            />
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
              disabled={activeTab === 1}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold transition disabled:opacity-40"
            >
              Previous Section
            </button>

            {activeTab < 6 ? (
              <button
                type="button"
                onClick={() => setActiveTab((prev) => Math.min(6, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-md shadow-blue-600/30"
              >
                Next Section
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isEditMode ? "Update Proposal Form" : "Submit & Complete Proposal"}</span>
              </button>
            )}
          </div>
        </form>
    </AppLayout>
  );
};

export default InsuranceFormPage;
