import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../components/Logo';

// Use relative path - works on any domain
const API_BASE_URL = "/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email format.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setError("");
      setMessage("Check your inbox! A password reset link has been sent to your email.");
    } catch (err) {
      const serverError = err.response?.data?.error || err.response?.data?.message;
      setError(serverError || "Invalid email or user not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-3 sm:p-4 md:p-6">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem] shadow-2xl max-w-xs sm:max-w-sm w-full border border-slate-50">
        <div className="text-center mb-6 sm:mb-8">
           <div className="flex justify-center mb-4 sm:mb-6">
             <Logo size={52} showText={false} />
           </div>
           <h2 className="text-xl sm:text-2xl font-black text-slate-900">Account Recovery</h2>
           <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Enter your email to receive password reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required 
                placeholder="pawan@gmail.com" 
                value={email} 
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (!value) {
                    setError("");
                  } else if (!isValidEmail(value)) {
                    setError("Please enter a valid email format.");
                  } else {
                    setError("");
                  }
                }} 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Send Recovery Link"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs hover:text-blue-600">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>

        {error && <p className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold text-center border border-rose-100">{error}</p>}
        {message && <p className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold text-center border border-blue-100">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;