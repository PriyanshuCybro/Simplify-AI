import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://simplify-ai-mrrh.onrender.com/api/auth/forgot-password', { email });
      setMessage("Check your Inbox! Reset link bhej diya gaya hai.");
    } catch (err) {
      setMessage("Email galat hai ya user nahi mila.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full border border-slate-50">
        <div className="text-center mb-8">
           <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4"><Sparkles size={28} /></div>
           <h2 className="text-2xl font-black text-slate-900">Neural Recovery</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase mt-2">Enter email to restore access</p>
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
                onChange={(e) => setEmail(e.target.value)} 
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

        {message && <p className="mt-6 p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold text-center border border-blue-100">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;