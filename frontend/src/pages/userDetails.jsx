import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../server/api.js";
import AppLayout from "../components/AppLayout.jsx";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal.jsx";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/insurance/${id}`)
        .then((res) => {
          if (res.data?.success) {
            setForm(res.data.data);
          }
        })
        .catch((err) => console.error("Error loading user details:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <AppLayout title="Client Record Details">
        <div className="flex-1 flex flex-col items-center justify-center p-16 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
          <span>Loading client details...</span>
        </div>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout title="Client Record Not Found">
        <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-white">Client DataSheet Not Found</h2>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            The requested client record could not be found or may have been deleted.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Client: ${form.section1?.fullName || "Details"}`}>
      <UserDetailsModal form={form} onClose={() => navigate("/")} />
    </AppLayout>
  );
};

export default UserDetailsPage;
