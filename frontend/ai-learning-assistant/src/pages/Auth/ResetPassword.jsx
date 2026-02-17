import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Logo from '../../components/Logo';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const ResetPasswordPage = () => {
  const { resetToken } = useParams(); // URL se token uthayega
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`https://simplify-ai-mrrh.onrender.com/api/auth/reset-password/${resetToken}`, { password });
      alert("Password reset successful! Please log in with your new password.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. The link may have expired. Please request a new one.");
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
           <h2 className="text-xl sm:text-2xl font-black text-slate-900">Reset Password</h2>
           <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Enter your new secure password</p>
        </div>

        {error && (
            <div className="mb-6 flex items-center gap-2 text-rose-500 text-[11px] font-black uppercase bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required placeholder="••••••••" 
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={16}/> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;