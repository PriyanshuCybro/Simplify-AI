import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BookOpen, Sparkles, ChevronRight, ChevronLeft, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import axios from 'axios';

// 🔥 STEP 1: Dynamic API Base URL setup
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";
const API_BASE = `${API_BASE_URL}/api`;

const FlashcardPage = () => {
  const [sessions, setSessions] = useState([]); 
  const [activeSession, setActiveSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reuseable Auth Header
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // ✅ Using corrected API_BASE
      const res = await axios.get(`${API_BASE}/documents/flashcards`, authHeader);
      if (res.data.success) {
        setSessions(res.data.data || []);
      }
    } catch (err) {
      // ✅ FIXED: Yahan pehle API_BASE ka error aa sakta tha
      console.error('Fetch sessions error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleDelete = async (sessionId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Delete this flashcard generation permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/documents/flashcards/${sessionId}`, authHeader);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (activeSession?._id === sessionId) setActiveSession(null);
      alert('Generation deleted!');
    } catch (err) {
      console.error('Delete error:', err?.response?.data || err.message);
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFB] min-h-screen font-sans">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      <AnimatePresence mode="wait">
        {!activeSession ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                Flashcard Library <Sparkles className="text-emerald-500"/>
              </h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                Saved generations: {sessions.length}
              </p>
            </div>

            {sessions.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm text-center border border-dashed border-slate-200">
                <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-500 font-bold">No flashcards yet. Generate some from a document.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sessions.map(s => (
                  <div key={s._id} onClick={() => { setActiveSession(s); setCurrentIndex(0); setFlipped(false); }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                    <button onClick={(e) => handleDelete(s._id, e)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-600 rounded-xl opacity-0 group-hover:opacity-100 bg-white shadow-sm transition-all"> <Trash2 size={16} /></button>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4"> <BookOpen size={24} /></div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{s.documentId?.title || 'AI Generated Set'}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider mb-6">
                      <Calendar size={12}/> {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase mb-4">
                      <span>Total Cards</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-md">{s.cards?.length || 0}</span>
                    </div>
                    <button className="w-full bg-slate-900 group-hover:bg-emerald-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Study Now</button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="study" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveSession(null)} className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-all">
                <ArrowLeft size={14}/> Back to Library
              </button>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                ID: {activeSession._id.slice(-6)}
              </div>
            </div>

            <div className="perspective-1000 h-[450px] w-full mb-8">
              <motion.div 
                animate={{ rotateY: flipped ? 180 : 0 }} 
                transition={{ type: 'spring', stiffness: 260, damping: 20 }} 
                onClick={() => setFlipped(!flipped)} 
                className="w-full h-full preserve-3d cursor-pointer relative"
              >
                {/* Front side */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl p-12 flex flex-col justify-center items-center text-center">
                  <span className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.4em] mb-6">Question</span>
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                    {activeSession.cards[currentIndex]?.question}
                  </h2>
                  <p className="mt-8 text-slate-300 text-[10px] font-bold uppercase tracking-widest animate-pulse">Click to flip</p>
                </div>

                {/* Back side */}
                <div className="absolute inset-0 backface-hidden bg-emerald-600 text-white rounded-[3rem] p-12 flex flex-col justify-center items-center text-center rotate-y-180 shadow-2xl shadow-emerald-200">
                  <span className="text-emerald-200 font-black text-[11px] uppercase tracking-[0.4em] mb-6">Answer</span>
                  <p className="text-xl font-medium leading-relaxed">
                    {activeSession.cards[currentIndex]?.answer}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50">
              <button 
                onClick={(e) => { e.stopPropagation(); setFlipped(false); setCurrentIndex(i => Math.max(0, i - 1)); }} 
                disabled={currentIndex === 0} 
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Progress</p>
                <p className="font-black text-slate-800 text-lg">{currentIndex + 1} <span className="text-slate-300 mx-1">/</span> {activeSession.cards.length}</p>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setFlipped(false); setCurrentIndex(i => Math.min(activeSession.cards.length - 1, i + 1)); }} 
                disabled={currentIndex === activeSession.cards.length - 1} 
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button onClick={() => handleDelete(activeSession._id)} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                Delete Set
              </button>
              <button onClick={() => { navigator.clipboard.writeText(activeSession.cards.map(c => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n')); alert('Copied to clipboard'); }} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">
                Copy All Cards
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardPage;