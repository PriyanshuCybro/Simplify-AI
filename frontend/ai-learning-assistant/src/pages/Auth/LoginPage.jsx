import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Logo from '../../components/Logo';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://simplify-ai-mrrh.onrender.com/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      // ✅ Sabhi conditions ke liye common error handling
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError("Details Mismatch,Try again!");
      } else {
        setError("Neural connection failed! Please check server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="flex justify-center mb-6">
            <Logo size={50} showText={false} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in to continue learning with Simplify AI</p>
        </div>

        {/* Universal Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-6 flex items-center gap-2 bg-rose-50 p-4 rounded-2xl border border-rose-100 text-rose-500 text-[11px] font-black uppercase"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Valid Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                placeholder="Enter your email "
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold text-sm ${error ? 'focus:ring-rose-100' : 'focus:ring-blue-100'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Security Key</label>
              
              {/* ✅ Animated Forgot Password Link (Universal Fix) */}
              <motion.div
                animate={error ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, -2, 2, -2, 2, 0] 
                } : {}}
                transition={{ duration: 0.5, repeat: error ? Infinity : 0, repeatDelay: 2 }}
              >
                <Link 
                  to="/forgot-password" 
                  className={`text-[10px] font-black uppercase tracking-tight transition-colors duration-300 ${
                    error ? 'text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-blue-600'
                  }`}
                >
                  Forgot Password?
                </Link>
              </motion.div>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold text-sm ${error ? 'focus:ring-rose-100' : 'focus:ring-blue-100'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Initialize Session <LogIn size={16} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-tight">
          New Researcher? <Link to="/register" className="text-blue-600 font-black hover:underline ml-1">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;