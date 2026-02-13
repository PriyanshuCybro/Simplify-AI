import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BookOpen, Sparkles, ChevronRight, ChevronLeft, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const FlashcardPage = () => {
  const [sessions, setSessions] = useState([]); // saved generations
  const [activeSession, setActiveSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/documents/flashcards`, authHeader);
      if (res.data.success) setSessions(res.data.data || []);
    } catch (err) {
      console.error('Fetch sessions error', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleDelete = async (sessionId, e) => {
    e?.stopPropagation();
    if (!confirm('Delete this flashcard generation permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/documents/flashcards/${sessionId}`, authHeader);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (activeSession?._id === sessionId) setActiveSession(null);
    } catch (err) {
      console.error('Delete error', err?.response?.data || err.message);
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
      <AnimatePresence mode="wait">
        {!activeSession ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">Flashcard Library <Sparkles className="text-emerald-500"/></h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Saved generations: {sessions.length}</p>
            </div>

            {sessions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-slate-500">No flashcards yet. Generate some from a document.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sessions.map(s => (
                  <div key={s._id} onClick={() => { setActiveSession(s); setCurrentIndex(0); setFlipped(false); }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg group relative">
                    <button onClick={(e) => handleDelete(s._id, e)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100"> <Trash2 size={16} /></button>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4"> <BookOpen size={22} /></div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{s.documentId?.title || 'Untitled Document'}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider mb-4"><Calendar size={12}/> {new Date(s.createdAt).toLocaleString()}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase mb-2"><span>Cards</span><span>{s.cards?.length || 0}</span></div>
                    <div className="mt-4"><button className="w-full bg-emerald-600 text-white py-2 rounded-xl font-black text-[10px] uppercase">Study</button></div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="study" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setActiveSession(null)} className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-emerald-600"><ArrowLeft size={14}/> Back</button>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase">Generated: {new Date(activeSession.createdAt).toLocaleString()}</div>
            </div>

            <div className="perspective-1000 h-[420px] w-full mb-6">
              <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} onClick={() => setFlipped(!flipped)} className="w-full h-full preserve-3d cursor-pointer relative shadow-2xl rounded-[2rem]">
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-center items-center text-center">
                  <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Card {currentIndex + 1}</span>
                  <h2 className="text-2xl font-bold text-slate-800">{activeSession.cards[currentIndex]?.question}</h2>
                </div>

                <div className="absolute inset-0 backface-hidden bg-emerald-600 text-white rounded-[2rem] p-8 flex flex-col justify-center items-center text-center rotate-y-180">
                  <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Answer</span>
                  <p className="text-xl font-medium">{activeSession.cards[currentIndex]?.answer}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => { setFlipped(false); setCurrentIndex(i => Math.max(0, i - 1)); }} disabled={currentIndex === 0} className="p-4 bg-white rounded-xl shadow-sm disabled:opacity-30"><ChevronLeft size={20} /></button>
              <div className="text-center font-black text-slate-800">{currentIndex + 1} / {activeSession.cards.length}</div>
              <button onClick={() => { setFlipped(false); setCurrentIndex(i => Math.min(activeSession.cards.length - 1, i + 1)); }} disabled={currentIndex === activeSession.cards.length - 1} className="p-4 bg-white rounded-xl shadow-sm disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => handleDelete(activeSession._id)} className="px-4 py-2 bg-rose-500 text-white rounded-xl font-bold text-[12px]">Delete Generation</button>
              <button onClick={() => { navigator.clipboard.writeText(activeSession.cards.map(c => `${c.question} - ${c.answer}`).join('\n\n')); alert('Copied to clipboard'); }} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Copy All</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardPage;