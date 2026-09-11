import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, KeyRound, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "../server/api.js";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const location = useLocation();
  const passedEmail = location.state?.email || "";

  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP & Reset
  const [email, setEmail] = useState(passedEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // Timer countdown handler for OTP resend
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email || !email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/send-otp", { email: email.trim() });

      if (response.data?.success || response.status === 200) {
        const msg = response.data?.message || "OTP code sent to your email address!";
        toast.success(msg, { duration: 6000 });
        setStep(2);
        setTimer(60); // 60 seconds cooldown for resend
      } else {
        throw new Error(response.data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Send OTP error", err);
      const msg = err.response?.data?.message || err.message || "Failed to send OTP email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || !otp.trim()) {
      setError("Please enter the 6-digit OTP code received in your email.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp-reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.data?.success || response.status === 200) {
        toast.success(response.data?.message || "Password updated successfully!");
        navigate("/login");
      } else {
        throw new Error(response.data?.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Verify OTP error", err);
      const msg = err.response?.data?.message || err.message || "Password reset failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 relative z-10">
        {/* Brand Icon & Logo */}
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-600/20 mb-2">
            <img src="/LIC.jpg" alt="LIC Logo" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-white tracking-tight">
            DataSheet Hub
          </span>
          <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 mt-0.5">
            LIC Insurance Proposal Portal
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {step === 1 ? "Reset Password" : "Enter Email OTP & Reset"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {step === 1
              ? "Enter your email address to receive an OTP code"
              : `An OTP code has been sent to ${email}. Check your email inbox.`}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-12 bg-blue-500" : "w-6 bg-slate-700"}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-12 bg-blue-500" : "w-6 bg-slate-700"}`}></div>
        </div>

        {/* Email Notification Banner in Step 2 */}
        {step === 2 && (
          <div className="mb-6 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3.5 text-xs text-blue-300 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">OTP Code Sent!</span>
              Check your email inbox (and spam folder) for the 6-digit OTP code sent to <strong className="text-blue-200">{email}</strong>.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs font-semibold text-rose-400">
            {error}
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@lic.com"
                  required
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Email OTP...</span>
                </>
              ) : (
                <span>Send OTP to Email</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP & RESET PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  6-Digit Email OTP Code
                </label>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={timer > 0 || loading}
                  className="text-xs text-blue-400 hover:text-blue-300 disabled:text-slate-500"
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP from email"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-center text-xl font-mono tracking-widest text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 pl-11 pr-11 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 pl-11 pr-11 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying & Resetting...</span>
                </>
              ) : (
                <span>Verify OTP & Change Password</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-2 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Email Address</span>
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 mt-6">
          Back to Login?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;