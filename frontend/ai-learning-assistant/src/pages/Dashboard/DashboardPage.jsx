// // import React, { useState, useEffect } from 'react';
// // import { Upload, Database, FileText, Brain, ArrowRight, Trash2 } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';
// // import UploadModal from '../Documents/UploadModal';
// // import { getDocuments, deleteDocument } from '../../services/api';

// // const DashboardPage = () => {
// //   const navigate = useNavigate();
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [documents, setDocuments] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchStats = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await getDocuments();
// //       if (response.data.success) {
// //         setDocuments(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch documents:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchStats();
// //   }, []);

// //   const handleDelete = async (e, id) => {
// //     e.stopPropagation(); 
// //     if (window.confirm("Are you sure you want to delete this document?")) {
// //       try {
// //         await deleteDocument(id);
// //         setDocuments(documents.filter(doc => doc._id !== id));
// //       } catch (error) {
// //         alert("Error deleting document");
// //       }
// //     }
// //   };

// //   const handleDocumentClick = (doc) => {
// //     if (doc.status === 'ready') {
// //       navigate(`/documents/${doc._id}`);
// //     } else if (doc.status === 'failed') {
// //       alert("This document failed. Please delete and re-upload.");
// //     } else {
// //       alert("AI is still processing. Please wait for 'Ready' status.");
// //     }
// //   };

// //   const stats = [
// //     { label: 'Total Documents', value: documents.length, icon: FileText, color: 'text-blue-600' },
// //     { label: 'Flashcards Created', value: '0', icon: Brain, color: 'text-purple-600' },
// //     { label: 'Quizzes Taken', value: '0', icon: Database, color: 'text-green-600' },
// //   ];

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Learner! 👋</h1>
// //         <p className="text-gray-600 mt-2">Ready to transform your PDFs into AI-powered study material?</p>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //         {stats.map((stat, index) => (
// //           <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
// //             <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
// //               <stat.icon size={24} />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
// //               <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //         {/* Upload Section - Your Original Design */}
// //         <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center">
// //           <div className="bg-blue-50 p-4 rounded-full mb-4">
// //             <Upload className="text-blue-600" size={40} />
// //           </div>
// //           <h2 className="text-xl font-semibold mb-2">Upload New Document</h2>
// //           <p className="text-gray-500 mb-6 max-w-xs">Upload your PDF and let Gemini AI create summaries and flashcards.</p>
          
// //           <button 
// //             onClick={() => setIsModalOpen(true)} 
// //             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center"
// //           >
// //             Select PDF <ArrowRight className="ml-2" size={18} />
// //           </button>
// //         </div>

// //         {/* Recent Documents List - Your Original Design with Added Functionality */}
// //         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-xl font-bold text-gray-800">Recent Documents</h2>
// //             <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-lg font-black tracking-widest shadow-lg shadow-blue-100">
// //               TOTAL: {documents.length}
// //             </span>
// //           </div>

// //           {loading ? (
// //             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
// //               <p className="text-sm">Syncing files...</p>
// //             </div>
// //           ) : documents.length > 0 ? (
// //             <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
// //               {documents.map((doc) => (
// //                 <div 
// //                   key={doc._id} 
// //                   onClick={() => handleDocumentClick(doc)}
// //                   className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-100 border border-transparent rounded-xl transition-all cursor-pointer group"
// //                 >
// //                   <div className="flex items-center gap-4">
// //                     <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
// //                       <FileText className="text-blue-600" size={20} />
// //                     </div>
// //                     <div className="flex flex-col">
// //                       <span className="text-sm font-bold text-gray-800 truncate max-w-[150px] md:max-w-[200px]">{doc.title}</span>
// //                       <span className="text-[10px] text-gray-400 font-medium mt-1">{new Date(doc.createdAt).toLocaleDateString('en-GB')}</span>
// //                     </div>
// //                   </div>
                  
// //                   <div className="flex items-center gap-3">
// //                     <span className={`text-[9px] px-3 py-1 rounded-md uppercase font-black tracking-tighter border-2 ${
// //                       doc.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : 
// //                       doc.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' : 
// //                       'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'
// //                     }`}>
// //                       {doc.status}
// //                     </span>
// //                     <button 
// //                       onClick={(e) => handleDelete(e, doc._id)}
// //                       className="text-gray-400 hover:text-red-600 transition-colors p-1"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                     <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-all" />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="flex flex-col items-center justify-center h-64 text-center">
// //               <div className="p-4 bg-gray-50 rounded-full mb-4">
// //                 <Database size={40} className="text-gray-200" />
// //               </div>
// //               <p className="font-bold text-gray-600">No Documents Found</p>
// //             </div>
// //           )}
// //         </div>

// //         <UploadModal 
// //           isOpen={isModalOpen} 
// //           onClose={() => setIsModalOpen(false)} 
// //           onUploadSuccess={fetchStats} 
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardPage;








// // ye nya wala hai 

// import React, { useState, useEffect, useMemo } from 'react';
// import { Upload, Database, FileText, Brain, ArrowRight, Trash2, Search, Filter } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import UploadModal from '../Documents/UploadModal';
// import { getDocuments, deleteDocument } from '../../services/api';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(""); // Search Feature
//   const [statusFilter, setStatusFilter] = useState("all"); // Filter Feature

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const response = await getDocuments();
//       if (response.data.success) {
//         setDocuments(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch documents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   // --- Filtering & Searching Logic ---
//   const filteredDocuments = useMemo(() => {
//     return documents.filter(doc => {
//       const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesFilter = statusFilter === "all" || doc.status === statusFilter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [documents, searchQuery, statusFilter]);

//   const handleDelete = async (e, id) => {
//     e.stopPropagation(); 
//     if (window.confirm("Bhai, delete kar dein? Iska sara AI data hat jayega.")) {
//       try {
//         await deleteDocument(id);
//         setDocuments(documents.filter(doc => doc._id !== id));
//       } catch (error) {
//         alert("Error deleting document");
//       }
//     }
//   };

//   const handleDocumentClick = (doc) => {
//     if (doc.status === 'ready') {
//       navigate(`/documents/${doc._id}`);
//     } else if (doc.status === 'failed') {
//       alert("Oops! AI analysis fail ho gayi. Phir se try karein.");
//     } else {
//       alert("Gemini is still reading... Thoda wait kijiye.");
//     }
//   };

//   const stats = [
//     { label: 'Documents', value: documents.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
//     { label: 'AI Flashcards', value: documents.filter(d => d.status === 'ready').length * 5, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
//     { label: 'Success Rate', value: documents.length > 0 ? `${Math.round((documents.filter(d => d.status === 'ready').length / documents.length) * 100)}%` : '0%', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
//   ];

//   return (
//     <div className="p-8 bg-[#F9FAFB] min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Learning Hub</h1>
//           <p className="text-gray-500 font-medium mt-1">Transforming IT Study Material into Intelligence.</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)} 
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
//         >
//           <Upload size={18} /> Upload PDF
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-5 transition-transform hover:scale-[1.02]">
//             <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
//               <stat.icon size={28} />
//             </div>
//             <div>
//               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
//               <p className="text-2xl font-black text-gray-900">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         {/* Left: Quick Actions & Filters */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
//             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Search & Filter</h3>
            
//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Find a document..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
//               />
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex flex-wrap gap-2">
//               {['all', 'ready', 'processing'].map((s) => (
//                 <button 
//                   key={s}
//                   onClick={() => setStatusFilter(s)}
//                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                     statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right: Recent Documents */}
//         <div className="lg:col-span-8">
//           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[500px]">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-xl font-black text-gray-900">Your Documents</h2>
//               <span className="bg-gray-50 text-gray-400 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border">
//                 Showing: {filteredDocuments.length}
//               </span>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//                 <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
//                 <p className="text-xs font-bold uppercase tracking-widest">Syncing with Gemini...</p>
//               </div>
//             ) : filteredDocuments.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
//                 {filteredDocuments.map((doc) => (
//                   <div 
//                     key={doc._id} 
//                     onClick={() => handleDocumentClick(doc)}
//                     className="group bg-gray-50/50 hover:bg-white p-5 rounded-3xl border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//                         <FileText size={24} />
//                       </div>
//                       <button 
//                         onClick={(e) => handleDelete(e, doc._id)}
//                         className="text-gray-300 hover:text-red-500 transition-colors"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
                    
//                     <h4 className="font-bold text-gray-800 text-sm truncate mb-1">{doc.title}</h4>
//                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
//                       {new Date(doc.createdAt).toLocaleDateString('en-GB')}
//                     </p>

//                     <div className="flex items-center justify-between mt-auto">
//                       <span className={`text-[8px] px-3 py-1 rounded-lg uppercase font-black tracking-widest border ${
//                         doc.status === 'ready' ? 'bg-green-100/50 text-green-700 border-green-200' : 
//                         doc.status === 'failed' ? 'bg-red-100/50 text-red-700 border-red-200' : 
//                         'bg-yellow-100/50 text-yellow-700 border-yellow-200 animate-pulse'
//                       }`}>
//                         {doc.status}
//                       </span>
//                       <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-80 text-center opacity-30">
//                 <Database size={64} className="mb-4" />
//                 <p className="font-black text-[10px] uppercase tracking-widest">Empty Workspace</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <UploadModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onUploadSuccess={fetchStats} 
//       />
//     </div>
//   );
// };

// // Help for Loading Animation
// const Loader2 = ({ className, size }) => (
//   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//   </svg>
// );

// export default DashboardPage;


//teesri nayi file hai ye

// import React, { useState, useEffect } from 'react';
// import { Upload, Database, FileText, Brain, ArrowRight, Trash2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import UploadModal from '../Documents/UploadModal';
// import { getDocuments, deleteDocument } from '../../services/api';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const response = await getDocuments();
//       if (response.data.success) {
//         setDocuments(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch documents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const handleDelete = async (e, id) => {
//     e.stopPropagation(); 
//     if (window.confirm("Are you sure you want to delete this document?")) {
//       try {
//         await deleteDocument(id);
//         setDocuments(documents.filter(doc => doc._id !== id));
//       } catch (error) {
//         alert("Error deleting document");
//       }
//     }
//   };

//   const handleDocumentClick = (doc) => {
//     if (doc.status === 'ready') {
//       navigate(`/documents/${doc._id}`);
//     } else if (doc.status === 'failed') {
//       alert("This document failed. Please delete and re-upload.");
//     } else {
//       alert("AI is still processing. Please wait for 'Ready' status.");
//     }
//   };

//   const stats = [
//     { label: 'Total Documents', value: documents.length, icon: FileText, color: 'text-blue-600' },
//     { label: 'Flashcards Created', value: '0', icon: Brain, color: 'text-purple-600' },
//     { label: 'Quizzes Taken', value: '0', icon: Database, color: 'text-green-600' },
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Learner! 👋</h1>
//         <p className="text-gray-600 mt-2">Ready to transform your PDFs into AI-powered study material?</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
//             <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
//               <stat.icon size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
//               <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Upload Section - Your Original Design */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center">
//           <div className="bg-blue-50 p-4 rounded-full mb-4">
//             <Upload className="text-blue-600" size={40} />
//           </div>
//           <h2 className="text-xl font-semibold mb-2">Upload New Document</h2>
//           <p className="text-gray-500 mb-6 max-w-xs">Upload your PDF and let Gemini AI create summaries and flashcards.</p>
          
//           <button 
//             onClick={() => setIsModalOpen(true)} 
//             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center"
//           >
//             Select PDF <ArrowRight className="ml-2" size={18} />
//           </button>
//         </div>

//         {/* Recent Documents List - Your Original Design with Added Functionality */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Recent Documents</h2>
//             <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-lg font-black tracking-widest shadow-lg shadow-blue-100">
//               TOTAL: {documents.length}
//             </span>
//           </div>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
//               <p className="text-sm">Syncing files...</p>
//             </div>
//           ) : documents.length > 0 ? (
//             <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
//               {documents.map((doc) => (
//                 <div 
//                   key={doc._id} 
//                   onClick={() => handleDocumentClick(doc)}
//                   className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-100 border border-transparent rounded-xl transition-all cursor-pointer group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
//                       <FileText className="text-blue-600" size={20} />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-bold text-gray-800 truncate max-w-[150px] md:max-w-[200px]">{doc.title}</span>
//                       <span className="text-[10px] text-gray-400 font-medium mt-1">{new Date(doc.createdAt).toLocaleDateString('en-GB')}</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3">
//                     <span className={`text-[9px] px-3 py-1 rounded-md uppercase font-black tracking-tighter border-2 ${
//                       doc.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : 
//                       doc.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' : 
//                       'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'
//                     }`}>
//                       {doc.status}
//                     </span>
//                     <button 
//                       onClick={(e) => handleDelete(e, doc._id)}
//                       className="text-gray-400 hover:text-red-600 transition-colors p-1"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                     <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-all" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-center">
//               <div className="p-4 bg-gray-50 rounded-full mb-4">
//                 <Database size={40} className="text-gray-200" />
//               </div>
//               <p className="font-bold text-gray-600">No Documents Found</p>
//             </div>
//           )}
//         </div>

//         <UploadModal 
//           isOpen={isModalOpen} 
//           onClose={() => setIsModalOpen(false)} 
//           onUploadSuccess={fetchStats} 
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;








// ye nya wala hai 


//  ye phir ek naya agar ye fail to upper wala chalega wo shi hai

// import React, { useState, useEffect, useMemo } from 'react';
// import { Upload, Database, FileText, Brain, ArrowRight, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
// import { motion, AnimatePresence } from 'framer-motion'; // Added for animations
// import UploadModal from '../Documents/UploadModal';
// import { getDocuments, deleteDocument } from '../../services/api';
// import axios from 'axios';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // 🔥 Tracking navigation from Profile
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [statsData, setStatsData] = useState({ flashcardsCount: 0, avgAccuracy: 0 });

//   // Get user from localStorage for Real-time name
//   const user = JSON.parse(localStorage.getItem('user'));
//   const highlightId = location.state?.highlightDocId; // 🔥 ID to highlight from Retake button

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       // Fetching both docs and stats simultaneously
//       const [docsRes, statsRes] = await Promise.all([
//         getDocuments(),
//         axios.get('https://simplify-ai-mrrh.onrender.com/api/users/stats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         })
//       ]);

//       if (docsRes.data.success) setDocuments(docsRes.data.data);
//       if (statsRes.data) setStatsData(statsRes.data.data.metrics);
//     } catch (error) {
//       console.error("Sync Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // --- Filtering & Searching Logic (Unchanged as requested) ---
//   const filteredDocuments = useMemo(() => {
//     return documents.filter(doc => {
//       const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesFilter = statusFilter === "all" || doc.status === statusFilter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [documents, searchQuery, statusFilter]);

//   const handleDelete = async (e, id) => {
//     e.stopPropagation(); 
//     if (window.confirm("Bhai, delete kar dein? Iska sara AI data hat jayega.")) {
//       try {
//         await deleteDocument(id);
//         setDocuments(documents.filter(doc => doc._id !== id));
//         fetchAllData(); // Refresh stats
//       } catch (error) {
//         alert("Error deleting document");
//       }
//     }
//   };

//   const handleDocumentClick = (doc) => {
//     // If we click the highlighted card, clear the highlight state
//     if (highlightId === doc._id) {
//       navigate(location.pathname, { replace: true, state: {} });
//     }

//     if (doc.status === 'ready') {
//       navigate(`/documents/${doc._id}`);
//     } else if (doc.status === 'failed') {
//       alert("Oops! AI analysis fail ho gayi. Phir se try karein.");
//     } else {
//       alert("Gemini is still reading... Thoda wait kijiye.");
//     }
//   };

//   const stats = [
//     { label: 'Intelligence Base', value: documents.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
//     { label: 'Neural Flashcards', value: statsData.flashcardsCount || 0, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
//     { label: 'Analysis Success', value: `${statsData.successRate || 0}%`, icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
//   ];

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-[#F9FAFB] min-h-screen">
//       {/* Header Section with Real User Name */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//               Welcome, {user?.name || "Researcher"}
//             </h1>
//             <Sparkles className="text-amber-400" size={24} />
//           </div>
//           <p className="text-gray-500 font-medium mt-1">Transforming IT Study Material into Intelligence.</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)} 
//           className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
//         >
//           <Upload size={18} /> Forge Insights
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         {stats.map((stat, index) => (
//           <motion.div 
//             key={index} 
//             initial={{ y: 20, opacity: 0 }} 
//             animate={{ y: 0, opacity: 1 }} 
//             transition={{ delay: index * 0.1 }}
//             className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-xl transition-all"
//           >
//             <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
//               <stat.icon size={28} />
//             </div>
//             <div>
//               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
//               <p className="text-2xl font-black text-gray-900">{stat.value}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
//             <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">Control Center</h3>
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Query library..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all outline-none"
//               />
//             </div>
//             <div className="flex flex-col gap-2">
//               {['all', 'ready', 'processing'].map((s) => (
//                 <button 
//                   key={s}
//                   onClick={() => setStatusFilter(s)}
//                   className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${
//                     statusFilter === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-8">
//           <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 min-h-[550px]">
//             <div className="flex justify-between items-center mb-10">
//               <h2 className="text-xl font-black text-gray-900">Neural Workspace</h2>
//               <span className="bg-gray-50 text-gray-400 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border border-gray-100">
//                 Active Nodes: {filteredDocuments.length}
//               </span>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center h-80">
//                 <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Synchronizing...</p>
//               </div>
//             ) : filteredDocuments.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <AnimatePresence>
//                   {filteredDocuments.map((doc) => (
//                     <motion.div 
//                       key={doc._id} 
//                       layout
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ 
//                         opacity: 1, 
//                         scale: highlightId === doc._id ? [1, 1.05, 1] : 1, // 🔥 Animated Highlight
//                         boxShadow: highlightId === doc._id ? "0 20px 50px rgba(59, 130, 246, 0.2)" : "none"
//                       }}
//                       transition={{ 
//                         scale: highlightId === doc._id ? { repeat: Infinity, duration: 1.5 } : { duration: 0.3 } 
//                       }}
//                       onClick={() => handleDocumentClick(doc)}
//                       className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden
//                       ${highlightId === doc._id ? 'border-amber-400 bg-white ring-4 ring-amber-50' : 'bg-gray-50/50 hover:bg-white border-transparent hover:border-blue-100'}
//                       `}
//                     >
//                       {highlightId === doc._id && (
//                         <div className="absolute top-2 right-2 p-1 bg-amber-400 text-white rounded-full animate-pulse">
//                           <Sparkles size={12} />
//                         </div>
//                       )}
                      
//                       <div className="flex justify-between items-start mb-6">
//                         <div className={`p-4 rounded-2xl shadow-sm transition-all ${highlightId === doc._id ? 'bg-amber-400 text-white' : 'bg-white group-hover:bg-slate-900 group-hover:text-white'}`}>
//                           <FileText size={28} />
//                         </div>
//                         <button 
//                           onClick={(e) => handleDelete(e, doc._id)}
//                           className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </div>
                      
//                       <h4 className="font-bold text-gray-800 text-lg truncate mb-1">{doc.title}</h4>
//                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
//                         {new Date(doc.createdAt).toLocaleDateString()}
//                       </p>

//                       <div className="flex items-center justify-between mt-auto">
//                         <span className={`text-[9px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest border ${
//                           doc.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : 
//                           doc.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' : 
//                           'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'
//                         }`}>
//                           {doc.status}
//                         </span>
//                         <ArrowRight size={20} className="text-gray-200 group-hover:text-slate-900 group-hover:translate-x-2 transition-all" />
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-96 opacity-20 grayscale">
//                 <Database size={80} className="mb-4" />
//                 <p className="font-black text-xs uppercase tracking-[0.4em]">Zero Data Ingested</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <UploadModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onUploadSuccess={fetchAllData} 
//       />
//     </motion.div>
//   );
// };

// export default DashboardPage;



//ye ek aur nayya

// import React, { useState, useEffect, useMemo } from 'react';
// import { Upload, Database, FileText, Brain, ArrowRight, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import UploadModal from '../Documents/UploadModal';
// import { getDocuments, deleteDocument } from '../../services/api';
// import axios from 'axios';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
  
//   // 🔥 Initial State check: Metrics ke naam backend se match hone chahiye
//   const [statsData, setStatsData] = useState({ 
//     docsCount: 0, 
//     flashcardsCount: 0, 
//     successRate: 0, 
//     avgAccuracy: 0 
//   });

//   const user = JSON.parse(localStorage.getItem('user'));
//   const highlightId = location.state?.highlightDocId;

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Documents fetch (Existing logic)
//       const docsRes = await getDocuments();
//       if (docsRes.data.success) {
//         setDocuments(docsRes.data.data);
//       }

//       // 2. Stats fetch logic - Optimized for your specific Backend structure
//       try {
//         const statsRes = await axios.get('https://simplify-ai-mrrh.onrender.com/api/users/stats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
        
//         console.log("Backend Stats Response:", statsRes.data); // Debugging ke liye

//         // 🔥 FIX: Check kijiye ki backend 'data.metrics' bhej raha hai ya 'data.data.metrics'
//         if (statsRes.data?.success) {
//           const metrics = statsRes.data.data.metrics; // Aapke controller ke hisab se yahi path hai
//           setStatsData({
//             docsCount: metrics.docsCount || 0,
//             flashcardsCount: metrics.flashcardsCount || 0,
//             successRate: metrics.successRate || 0,
//             avgAccuracy: metrics.avgAccuracy || 0
//           });
//         }
//       } catch (statsErr) {
//         console.error("Stats fetch fail (Check if Route exists):", statsErr.message);
//       }

//     } catch (error) {
//       console.error("Critical Sync Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // 🔥 YAHAN THA ERROR: Humne stats array ko dynamic bana diya hai
//   const stats = [
//     { 
//       label: 'Intelligence Base', 
//       value: documents.length, 
//       icon: FileText, 
//       color: 'text-blue-600', 
//       bg: 'bg-blue-50' 
//     },
//     { 
//       label: 'Neural Flashcards', 
//       value: statsData?.flashcardsCount || 0, // Real-time value
//       icon: Brain, 
//       color: 'text-purple-600', 
//       bg: 'bg-purple-50' 
//     },
//     { 
//       label: 'Analysis Success', 
//       value: `${statsData?.successRate || 0}%`, // Real-time percentage
//       icon: Database, 
//       color: 'text-green-600', 
//       bg: 'bg-green-50' 
//     },
//   ];

//   const filteredDocuments = useMemo(() => {
//     return documents.filter(doc => {
//       const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesFilter = statusFilter === "all" || doc.status === statusFilter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [documents, searchQuery, statusFilter]);

//   const handleDelete = async (e, id) => {
//     e.stopPropagation(); 
//     if (window.confirm("Bhai, delete kar dein? Iska sara AI data hat jayega.")) {
//       try {
//         await deleteDocument(id);
//         setDocuments(documents.filter(doc => doc._id !== id));
//         fetchAllData(); 
//       } catch (error) {
//         alert("Error deleting document");
//       }
//     }
//   };

//   const handleDocumentClick = (doc) => {
//     if (highlightId === doc._id) {
//       navigate(location.pathname, { replace: true, state: {} });
//     }

//     if (doc.status === 'ready') {
//       navigate(`/documents/${doc._id}`);
//     } else if (doc.status === 'failed') {
//       alert("Oops! AI analysis fail ho gayi. Phir se try karein.");
//     } else {
//       alert("Gemini is still reading... Thoda wait kijiye.");
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-[#F9FAFB] min-h-screen">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//               Welcome, {user?.name || "Researcher"}
//             </h1>
//             <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
//                 <Sparkles className="text-amber-400" size={24} />
//             </motion.div>
//           </div>
//           <p className="text-gray-500 font-medium mt-1">Transforming IT Study Material into Intelligence.</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)} 
//           className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
//         >
//           <Upload size={18} /> Forge Insights
//         </button>
//       </div>

//       {/* Stats Grid - Mapping through dynamic stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         {stats.map((stat, index) => (
//           <motion.div 
//             key={index} 
//             initial={{ y: 20, opacity: 0 }} 
//             animate={{ y: 0, opacity: 1 }} 
//             transition={{ delay: index * 0.1 }}
//             className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-xl transition-all"
//           >
//             <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
//               <stat.icon size={28} />
//             </div>
//             <div>
//               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
//               <p className="text-2xl font-black text-gray-900">{stat.value}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
//             <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">Control Center</h3>
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Query library..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all outline-none"
//               />
//             </div>
//             <div className="flex flex-col gap-2">
//               {['all', 'ready', 'processing'].map((s) => (
//                 <button 
//                   key={s}
//                   onClick={() => setStatusFilter(s)}
//                   className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${
//                     statusFilter === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-8">
//           <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 min-h-[550px]">
//             <div className="flex justify-between items-center mb-10">
//               <h2 className="text-xl font-black text-gray-900">Neural Workspace</h2>
//               <span className="bg-gray-50 text-gray-400 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border border-gray-100">
//                 Active Nodes: {filteredDocuments.length}
//               </span>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center h-80">
//                 <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Synchronizing...</p>
//               </div>
//             ) : filteredDocuments.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <AnimatePresence>
//                   {filteredDocuments.map((doc) => (
//                     <motion.div 
//                       key={doc._id} 
//                       layout
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ 
//                         opacity: 1, 
//                         scale: highlightId === doc._id ? [1, 1.02, 1] : 1, 
//                         boxShadow: highlightId === doc._id ? "0 20px 50px rgba(59, 130, 246, 0.15)" : "none"
//                       }}
//                       transition={{ 
//                         scale: highlightId === doc._id ? { repeat: Infinity, duration: 2 } : { duration: 0.3 } 
//                       }}
//                       onClick={() => handleDocumentClick(doc)}
//                       className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden
//                       ${highlightId === doc._id ? 'border-amber-400 bg-white ring-4 ring-amber-50' : 'bg-gray-50/50 hover:bg-white border-transparent hover:border-blue-100'}
//                       `}
//                     >
//                       {highlightId === doc._id && (
//                         <div className="absolute top-4 right-4 p-1.5 bg-amber-400 text-white rounded-full animate-bounce">
//                           <Sparkles size={14} />
//                         </div>
//                       )}
                      
//                       <div className="flex justify-between items-start mb-6">
//                         <div className={`p-4 rounded-2xl shadow-sm transition-all ${highlightId === doc._id ? 'bg-amber-400 text-white' : 'bg-white group-hover:bg-slate-900 group-hover:text-white'}`}>
//                           <FileText size={28} />
//                         </div>
//                         <button 
//                           onClick={(e) => handleDelete(e, doc._id)}
//                           className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </div>
                      
//                       <h4 className="font-bold text-gray-800 text-lg truncate mb-1">{doc.title}</h4>
//                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
//                         {new Date(doc.createdAt).toLocaleDateString()}
//                       </p>

//                       <div className="flex items-center justify-between mt-auto">
//                         <span className={`text-[9px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest border ${
//                           doc.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : 
//                           doc.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' : 
//                           'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'
//                         }`}>
//                           {doc.status}
//                         </span>
//                         <ArrowRight size={20} className="text-gray-200 group-hover:text-slate-900 group-hover:translate-x-2 transition-all" />
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-96 opacity-20 grayscale">
//                 <Database size={80} className="mb-4" />
//                 <p className="font-black text-xs uppercase tracking-[0.4em]">Zero Data Ingested</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <UploadModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onUploadSuccess={fetchAllData} 
//       />
//     </motion.div>
//   );
// };

// export default DashboardPage;



//ye ek aur 14feb

import React, { useState, useEffect, useMemo } from 'react';
import { Upload, Database, FileText, Brain, ArrowRight, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UploadModal from '../Documents/UploadModal';
import { getDocuments, deleteDocument } from '../../services/api';
import axios from 'axios';

// 🔥 API BASE URL: Render link ko use karega
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [statsData, setStatsData] = useState({ 
    docsCount: 0, 
    flashcardsCount: 0, 
    successRate: 0, 
    avgAccuracy: 0 
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const highlightId = location.state?.highlightDocId;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 1. Documents fetch
      const docsRes = await getDocuments();
      if (docsRes.data.success) {
        setDocuments(docsRes.data.data);
      }

      // 2. Real-time Stats fetch
      try {
        const statsRes = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (statsRes.data?.success) {
          const userData = statsRes.data.data;
          setStatsData({
            docsCount: userData.docsCount || 0,
            flashcardsCount: userData.flashcardsCount || 0,
            successRate: userData.successRate || 0,
            avgAccuracy: userData.avgAccuracy || 0
          });
        }
      } catch (statsErr) {
        console.error("Stats Error:", statsErr.message);
      }

    } catch (error) {
      console.error("Critical Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const stats = [
    { 
      label: 'Intelligence Base', 
      value: documents.length, 
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Neural Flashcards', 
      value: statsData?.flashcardsCount || 0, 
      icon: Brain, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Analysis Success', 
      value: `${statsData?.successRate || 0}%`, 
      icon: Database, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchQuery, statusFilter]);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDocument(id);
        fetchAllData(); 
      } catch (error) {
        alert("Error deleting document");
      }
    }
  };

  const handleDocumentClick = (doc) => {
    if (doc.status === 'ready') {
      navigate(`/documents/${doc._id}`);
    } else {
      alert("AI reading in progress...");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome, {user?.name || "Researcher"}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Transforming Study Material into Intelligence.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Upload size={18} /> Forge Insights
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Control Center</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Query library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              {['all', 'ready', 'processing'].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 min-h-[550px]">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-80"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc._id} onClick={() => handleDocumentClick(doc)} className="p-6 rounded-[2.5rem] border bg-gray-50/50 hover:bg-white transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-white rounded-2xl"><FileText size={28} className="text-blue-600" /></div>
                      <button onClick={(e) => handleDelete(e, doc._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg truncate">{doc.title}</h4>
                    <p className="text-[10px] text-gray-400 font-black mb-4 uppercase">{new Date(doc.createdAt).toLocaleDateString()}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-black uppercase">{doc.status}</span>
                      <ArrowRight size={20} className="text-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-center text-gray-300 mt-20 font-black">NO DOCUMENTS FOUND</p>}
          </div>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={fetchAllData} />
    </motion.div>
  );
};

export default DashboardPage;