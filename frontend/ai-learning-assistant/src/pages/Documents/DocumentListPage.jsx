import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Plus, Trash2, Clock, ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadModal from './UploadModal'; // Check if path matches your folder

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const DocumentListPage = () => {
    const [docs, setDocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchDocs = async () => {
        try {
            const res = await axios.get('https://simplify-ai-mrrh.onrender.com/api/documents', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDocs(res.data.data);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    // 🔥 Delete Functionality
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Card click event ko rokne ke liye
        if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) return;

        try {
            await axios.delete(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDocs(docs.filter(doc => doc._id !== id));
            alert("✅ Document Deleted!");
        } catch (err) {
            console.error("Delete error", err);
            alert("❌ Delete failed!");
        }
    };

    const filteredDocs = docs.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Knowledge Base</h1>
                    <p className="text-gray-500 text-sm font-medium">You have {docs.length} documents processed by AI</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search library..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Fixed: Now opens Modal instead of navigating */}
                    <button onClick={() => setIsUploadModalOpen(true)} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2rem]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredDocs.map((doc, i) => (
                            <motion.div 
                                key={doc._id} layout
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/documents/${doc._id}`)}
                                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <FileText size={24} />
                                    </div>
                                    {/* 🔥 NEW: Delete Icon */}
                                    <button 
                                        onClick={(e) => handleDelete(e, doc._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2 truncate pr-8">{doc.title}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    <Clock size={12} /> {new Date(doc.createdAt).toLocaleDateString()}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-blue-600">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Open Analytics</span>
                                    <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* 🔥 Upload Modal Integration */}
{isUploadModalOpen && (
    <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        // 🔥 Ye prop add karna zaroori hai kyunki modal ise call kar raha hai
        onUploadSuccess={() => {
            setIsUploadModalOpen(false);
            fetchDocs(); // Refresh documents after upload
        }} 
    />
)}
        </motion.div>
    );
};

export default DocumentListPage;