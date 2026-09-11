import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Registarion.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InsuranceFormPage from "./pages/InsuranceFormPage.jsx";
import ViewInsurancePage from "./pages/ViewInsurancePage.jsx";
import UserDetailsPage from "./pages/userDetails.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/insurance/new" element={<InsuranceFormPage />} />
            <Route path="/insurance/edit/:id" element={<InsuranceFormPage />} />
            <Route path="/insurance/view/:id" element={<ViewInsurancePage />} />
            <Route path="/user-details/:id" element={<UserDetailsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1e293b",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
