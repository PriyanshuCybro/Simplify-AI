import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Briefcase, MapPin, Phone, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../components/Logo';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    location: '',
    contact: '',
    profession: 'Student',
    purpose: 'Personal'
  });

  // ✅ Step 1 Validation (Credentials)
  const handleNext = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      setError("All fields are required. Please fill in all the information.");
      return;
    }
    // Password Check: Min 6 characters
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setStep(2);
  };

  // ✅ Final Registration & Step 2 Validation
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Age Check: Valid age range 10 to 100
    const ageNum = parseInt(formData.age);
    if (!formData.age || ageNum < 10 || ageNum > 100) {
      setError("Please enter a valid age between 10 and 100 years.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://simplify-ai-mrrh.onrender.com/api/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed! Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 md:p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full border border-slate-50 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size={48} showText={false} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join Simplify AI</h2>
          <p className="text-slate-500 text-sm mt-2">Start mastering your learning today</p>
          <div className="flex justify-center gap-2 mt-3">
            <div className={`h-1.5 w-10 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`h-1.5 w-10 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 flex items-center gap-2 text-rose-500 text-[11px] font-black uppercase bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" placeholder="yourname01" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" placeholder="Enter Your Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Password (Min 6 chars)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm transition-all" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
                  Continue to Personal Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Age</label>
                    <input type="number" min="10" max="100" placeholder="21" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Gender</label>
                    <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Profession</label>
                    <select value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm">
                      <option value="Student">Student</option>
                      <option value="Employee">Employee</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block text-left">Purpose</label>
                    <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm">
                      <option value="Personal">Personal</option>
                      <option value="Organization">Organization</option>
                      <option value="Academic">Academic</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete Setup <Briefcase size={16}/></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Already a member? <Link to="/login" className="text-blue-600 font-black hover:underline">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

