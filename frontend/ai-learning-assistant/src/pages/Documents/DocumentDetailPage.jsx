// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // <--- Sabse upar ye line honi chahiye
// import { 
//   FileText, ArrowLeft, Loader2, Layout, MessageSquare, Zap, Send, User, Bot, Brain 
// } from 'lucide-react';
// // API calls import (Make sure ye paths sahi hain)
// import { getDocument, askAI, generateFlashcardsAPI } from '../../services/api';


// // --- Flashcard UI Component (Isse bahar rakh sakte hain as a sub-component) ---
// const FlashcardSection = ({ flashcards }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isFlipped, setIsFlipped] = useState(false);

//     if (!flashcards || flashcards.length === 0) return null;
//     const currentCard = flashcards[currentIndex];

//     return (
//         <div className="mt-8 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
//             <h3 className="text-sm font-black mb-4 text-blue-600 uppercase tracking-widest flex items-center gap-2">
//                 <Brain size={18}/> AI Study Flashcards
//             </h3>
            
//             <div 
//                 className={`relative w-full h-48 cursor-pointer transition-all duration-500 transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
//                 onClick={() => setIsFlipped(!isFlipped)}
//                 style={{ perspective: '1000px' }}
//             >
//                 {/* Front Side */}
//                 <div className={`absolute inset-0 flex items-center justify-center p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl shadow-sm backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
//                     <p className="text-center font-bold text-gray-800">{currentCard.question}</p>
//                 </div>
//                 {/* Back Side */}
//                 <div className={`absolute inset-0 flex items-center justify-center p-6 bg-blue-600 text-white rounded-3xl shadow-md [transform:rotateY(180deg)] backface-hidden ${isFlipped ? 'visible' : 'invisible'}`}>
//                     <p className="text-center font-medium">{currentCard.answer}</p>
//                 </div>
//             </div>

//             <div className="flex justify-between items-center mt-6">
//                 <button 
//                     disabled={currentIndex === 0}
//                     onClick={() => {setCurrentIndex(currentIndex - 1); setIsFlipped(false)}}
//                     className="p-2 bg-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-colors"
//                 > <ArrowLeft size={20} /> </button>
                
//                 <span className="text-[10px] font-black uppercase text-gray-400"> {currentIndex + 1} / {flashcards.length} </span>

//                 <button 
//                     disabled={currentIndex === flashcards.length - 1}
//                     onClick={() => {setCurrentIndex(currentIndex + 1); setIsFlipped(false)}}
//                     className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-30 hover:bg-blue-700 transition-colors"
//                 > <Send className="rotate-0" size={20} /> </button>
//             </div>
//         </div>
//     );
// };

// const DocumentDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('content');
  
//   // Chat States
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);

//   // Flashcard States
//   const [flashcards, setFlashcards] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const response = await getDocument(id);
//         if (response.data.success) {
//           setDocument(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id]);

//   // Handle AI Chat
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;

//     const userMsg = { role: 'user', text: question };
//     setChatHistory(prev => [...prev, userMsg]);
//     setQuestion('');
//     setIsTyping(true);

//     try {
//       const response = await askAI(id, question);
//       const aiMsg = { role: 'bot', text: response.data.answer };
//       setChatHistory(prev => [...prev, aiMsg]);
//     } catch (error) {
//       console.error("Chat Error:", error);
//       setChatHistory(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to Gemini. Please try again." }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Handle Flashcards Generation
//  const handleGenerateFlashcards = async () => {
//     try {
//         setLoading(true); // Loading start
//         const response = await axios.post(`/api/documents/${id}/flashcards`);
        
//         console.log("Frontend Data Received:", response.data); // Console mein check karo data aaya ya nahi

//         if (response.data.success) {
//             // DHYAN DO: response.data.flashcards hona chahiye
//             setFlashcards(response.data.flashcards); 
//         }
//     } catch (error) {
//         console.error("Flashcard Fetch Error:", error);
//     } finally {
//         setLoading(false); // Loading stop
//     }
// };


//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//       <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Loading Study Material...</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-[#F9FAFB] min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors">
//           <ArrowLeft size={18} /> Back to Dashboard
//         </button>
//         <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
//           {document?.status || 'READY'} to Analyze
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Left Sidebar */}
//         <div className="lg:col-span-3 space-y-6">
//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <div className="p-4 bg-blue-50 rounded-2xl w-fit mb-4">
//               <FileText className="text-blue-600" size={32} />
//             </div>
//             <h1 className="text-lg font-black text-gray-900 leading-tight mb-2 truncate">{document?.title}</h1>
//             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PDF Document Loaded</p>
//           </div>

//           {/* Flashcard Button Section */}
//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <button 
//                 onClick={handleGenerateFlashcards}
//                 disabled={isGenerating}
//                 className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
//             >
//                 {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />}
//                 {isGenerating ? "AI is Thinking..." : "Generate Flashcards"}
//             </button>
//             {flashcards.length > 0 && <FlashcardSection flashcards={flashcards} />}
//           </div>
//         </div>

//         {/* Right Main Interface */}
//         <div className="lg:col-span-9 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[650px]">
//           <div className="flex border-b border-gray-100">
//             <button 
//               onClick={() => setActiveTab('content')}
//               className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
//             >
//               <Layout size={16} /> Extracted Text
//             </button>
//             <button 
//               onClick={() => setActiveTab('chat')}
//               className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
//             >
//               <MessageSquare size={16} /> AI Study Chat
//             </button>
//           </div>

//           <div className="flex-1 flex flex-col">
//             {activeTab === 'content' ? (
//               <div className="p-8 h-[550px] overflow-y-auto custom-scrollbar">
//                 <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm leading-relaxed">
//                   {document?.extractedText || "No text found in this PDF."}
//                 </pre>
//               </div>
//             ) : (
//               <div className="flex flex-col h-[550px]">
//                 <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/30">
//                   {chatHistory.length === 0 && (
//                     <div className="text-center mt-20 text-gray-400">
//                       <Brain size={40} className="mx-auto mb-3 opacity-20" />
//                       <p className="text-[10px] font-bold uppercase tracking-widest">Ask Gemini about this PDF!</p>
//                     </div>
//                   )}
//                   {chatHistory.map((msg, i) => (
//                     <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                       {msg.role === 'bot' && <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm"><Bot size={16}/></div>}
//                       <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
//                         {msg.text}
//                       </div>
//                       {msg.role === 'user' && <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 shrink-0"><User size={16}/></div>}
//                     </div>
//                   ))}
//                   {isTyping && (
//                     <div className="flex gap-3 justify-start animate-pulse">
//                       <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400"><Bot size={16}/></div>
//                       <div className="bg-white p-4 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">AI Thinking...</div>
//                     </div>
//                   )}
//                 </div>

//                 <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2">
//                   <input 
//                     type="text" 
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask a question about the document..."
//                     className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
//                   />
//                   <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
//                     <Send size={20} />
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentDetailPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios'; // Ensure Axios is imported
// import { 
//   FileText, ArrowLeft, Loader2, Layout, MessageSquare, Zap, Send, User, Bot, Brain, File 
// } from 'lucide-react';
// import { getDocument, askAI } from '../../services/api';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import { Download, Image as ImageIcon } from 'lucide-react'; // Naye icons
// import PDFViewer from '../../components/PDFViewer';


// // --- Flashcard UI Component ---  ye main hai agar kuchh na shi chle to isse rkhna hai
// // const FlashcardSection = ({ flashcards }) => {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //     const [isFlipped, setIsFlipped] = useState(false);

// //     if (!flashcards || flashcards.length === 0) return null;
// //     const currentCard = flashcards[currentIndex];

// //     return (
// //         <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
// //             <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
// //                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
// //                 AI Smart Flashcards
// //             </h3>
            
// //             <div className="relative min-h-[280px] w-full perspective-1000">
// //                 <div 
// //                     className={`relative w-full h-full min-h-[280px] transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
// //                     onClick={() => setIsFlipped(!isFlipped)}
// //                 >
// //                     {/* Front Side: Question */}
// //                     <div className="absolute inset-0 backface-hidden">
// //                         <div className="h-full w-full bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-500/5 group-hover:border-blue-200 transition-colors">
// //                             <span className="text-[10px] font-bold text-blue-400 uppercase mb-4 tracking-widest">Question</span>
// //                             <p className="text-gray-800 font-bold text-base leading-snug overflow-y-auto max-h-[180px] custom-scrollbar px-2">
// //                                 {currentCard.question}
// //                             </p>
// //                             <div className="mt-6 text-[9px] font-black text-gray-300 uppercase italic">Click to flip</div>
// //                         </div>
// //                     </div>

// //                     {/* Back Side: Answer */}
// //                     <div className="absolute inset-0 backface-hidden rotate-y-180">
// //                         <div className="h-full w-full bg-blue-600 border-2 border-blue-400 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-600/20">
// //                             <span className="text-[10px] font-bold text-blue-200 uppercase mb-4 tracking-widest">Answer</span>
// //                             <p className="text-white font-medium text-sm leading-relaxed overflow-y-auto max-h-[180px] custom-scrollbar px-2">
// //                                 {currentCard.answer}
// //                             </p>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Controls with Animated Feel */}
// //             <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-gray-100 shadow-sm">
// //                 <button 
// //                     disabled={currentIndex === 0}
// //                     onClick={() => {setCurrentIndex(currentIndex - 1); setIsFlipped(false)}}
// //                     className="p-3 bg-white text-gray-400 rounded-xl disabled:opacity-20 hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
// //                 > <ArrowLeft size={20} /> </button>
                
// //                 <div className="flex flex-col items-center">
// //                     <span className="text-[11px] font-black text-gray-800">
// //                         {String(currentIndex + 1).padStart(2, '0')}
// //                     </span>
// //                     <div className="w-8 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
// //                         <div 
// //                             className="h-full bg-blue-600 transition-all duration-500" 
// //                             style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
// //                         />
// //                     </div>
// //                 </div>

// //                 <button 
// //                     disabled={currentIndex === flashcards.length - 1}
// //                     onClick={() => {setCurrentIndex(currentIndex + 1); setIsFlipped(false)}}
// //                     className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-20 hover:bg-blue-700 hover:shadow-lg shadow-blue-200 transition-all active:scale-90"
// //                 > <Send size={20} className="rotate-0" /> </button>
// //             </div>
// //         </div>
// //     );
// // };


// const FlashcardSection = ({ flashcards }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isFlipped, setIsFlipped] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);

//     if (!flashcards || flashcards.length === 0) return null;
//     const currentCard = flashcards[currentIndex];

//     // --- Voice Function ---
//     const speak = (text) => {
//         window.speechSynthesis.cancel();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => setIsSpeaking(false);
//         window.speechSynthesis.speak(utterance);
//     };

//     // --- Download as PDF Function ---
//    const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let yPos = 30; // Starting vertical position

//     // --- PDF Styling & Header ---
//     doc.setFillColor(37, 99, 235); // Blue Header Box
//     doc.rect(0, 0, pageWidth, 25, 'F');
    
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);
//     doc.setTextColor(255, 255, 255);
//     doc.text("AI STUDY ASSISTANT - FLASHCARDS", 20, 17);

//     flashcards.forEach((card, index) => {
//         // Text ko wrap karna (taaki overlap na ho)
//         const qLines = doc.splitTextToSize(`Q: ${card.question}`, pageWidth - 40);
//         const aLines = doc.splitTextToSize(`A: ${card.answer}`, pageWidth - 50);
        
//         // Calculate height needed for this card block
//         const blockHeight = (qLines.length * 7) + (aLines.length * 6) + 15;

//         // Check for new page
//         if (yPos + blockHeight > 270) {
//             doc.addPage();
//             yPos = 20;
//         }

//         // --- Card Design ---
//         doc.setDrawColor(230, 230, 230);
//         doc.setFillColor(249, 250, 251); // Light Gray Background
//         doc.roundedRect(15, yPos, pageWidth - 30, blockHeight, 5, 5, 'FD');

//         // Question text (Bold Blue)
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(11);
//         doc.setTextColor(37, 99, 235);
//         doc.text(qLines, 20, yPos + 8);

//         // Answer text (Normal Gray)
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10);
//         doc.setTextColor(60, 60, 60);
//         doc.text(aLines, 25, yPos + (qLines.length * 7) + 8);

//         yPos += blockHeight + 10; // Spacing for next card
//     });

//     doc.save(`Study_Material_Flashcards.pdf`);
// };

//     return (
//         <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
//             {/* Header and Action Buttons */}
//             <div className="flex justify-between items-center px-2">
//                 <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//                     Study Mode
//                 </h3>
//                 <div className="flex gap-2">
//                     {/* Speech Button */}
//                     <button 
//                         onClick={(e) => { e.stopPropagation(); speak(isFlipped ? currentCard.answer : currentCard.question); }}
//                         className={`p-2 rounded-lg transition-all border border-gray-100 bg-white shadow-sm ${isSpeaking ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-400 hover:text-blue-600'}`}
//                         title="Speak Text"
//                     >
//                         <Zap size={18} className={isSpeaking ? 'animate-bounce' : ''} />
//                     </button>
//                     {/* PDF Download Button */}
//                     <button 
//                         onClick={downloadAsPDF} 
//                         className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-all" 
//                         title="Download PDF"
//                     >
//                         <Download size={18} />
//                     </button>
//                 </div>
//             </div>
            
//             {/* Flashcard Component */}
//             <div className="relative min-h-[300px] w-full perspective-1000">
//                 <div 
//                     className={`relative w-full h-full min-h-[300px] transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
//                     onClick={() => { setIsFlipped(!isFlipped); window.speechSynthesis.cancel(); }}
//                 >
//                     {/* Front Side */}
//                     <div className="absolute inset-0 backface-hidden">
//                         <div className="h-full w-full bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-500/5 group-hover:border-blue-200 transition-all">
//                             <span className="text-[10px] font-black text-blue-400 uppercase mb-4 tracking-widest">Question</span>
//                             <div className="overflow-y-auto max-h-[180px] custom-scrollbar px-2">
//                                 <p className="text-gray-800 font-bold text-base leading-snug">{currentCard.question}</p>
//                             </div>
//                             <div className="mt-6 text-[9px] font-black text-gray-300 uppercase italic">Click to reveal answer</div>
//                         </div>
//                     </div>

//                     {/* Back Side */}
//                     <div className="absolute inset-0 backface-hidden rotate-y-180">
//                         <div className="h-full w-full bg-blue-600 border-2 border-blue-400 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-600/30">
//                             <span className="text-[10px] font-bold text-blue-100 uppercase mb-4 tracking-widest">Answer</span>
//                             <div className="overflow-y-auto max-h-[180px] custom-scrollbar px-2">
//                                 <p className="text-white font-medium text-sm leading-relaxed">{currentCard.answer}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
//                 <button 
//                     disabled={currentIndex === 0}
//                     onClick={() => {setCurrentIndex(currentIndex - 1); setIsFlipped(false); window.speechSynthesis.cancel();}}
//                     className="p-3 bg-gray-50 text-gray-400 rounded-xl disabled:opacity-20 hover:text-blue-600"
//                 > <ArrowLeft size={20} /> </button>
                
//                 <span className="text-[11px] font-black text-gray-800">
//                     {currentIndex + 1} / {flashcards.length}
//                 </span>

//                 <button 
//                     disabled={currentIndex === flashcards.length - 1}
//                     onClick={() => {setCurrentIndex(currentIndex + 1); setIsFlipped(false); window.speechSynthesis.cancel();}}
//                     className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-20 hover:bg-blue-700 shadow-lg shadow-blue-200"
//                 > <Send size={20} /> </button>
//             </div>
//         </div>
//     );
// };


// const DocumentDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('content');
  
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);

//   const [flashcards, setFlashcards] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [quizCount, setQuizCount] = useState(10);

//   const chatEndRef = useRef(null); // 2. Scroll ke liye ref banao

//   // BASE URL config
//   const API_BASE_URL = "https://simplify-ai-mrrh.onrender.com/api/documents";


//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`https://simplify-ai-mrrh.onrender.com/${id}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         if (response.data.success) {
//           setDocument(response.data.document || response.data.data);
//         }
//       } catch (error) {
//         console.error("Error Fetching Doc:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id]);

//   // Handle retaking quiz from quiz details page
//   useEffect(() => {
//     if (location.state?.retakeQuiz) {
//       setShowQuizModal(true);
//       if (location.state?.quizCount) {
//         setQuizCount(location.state.quizCount);
//       }
//     }
//   }, [location.state]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;

//     const userMsg = { role: 'user', text: question };
//     setChatHistory(prev => [...prev, userMsg]);
//     setQuestion('');
//     setIsTyping(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/${id}/chat`, 
//         { question },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const aiMsg = { role: 'bot', text: response.data.answer };
//       setChatHistory(prev => [...prev, aiMsg]);
//     } catch (error) {
//       console.error("Chat Error:", error);
//       setChatHistory(prev => [...prev, { role: 'bot', text: "AI is busy. Please try again later." }]);
//     } finally {
//       setIsTyping(false);
//     }
    
//   };

//  const handleGenerateFlashcards = async () => {
//     try {
//         setIsGenerating(true);
//         const token = localStorage.getItem('token');
        
//         // Final API Call without Fallback for real testing
//         const response = await axios.post(
//             `https://simplify-ai-mrrh.onrender.com/api/documents/${id}/flashcards`, 
//             {}, 
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.data.success && response.data.flashcards.length > 0) {
//             console.log("✅ Actual AI Flashcards:", response.data.flashcards);
//             setFlashcards(response.data.flashcards); 
//         } else {
//             alert("AI ne cards generate nahi kiye. Ek baar phir se try karein.");
//         }
//     } catch (error) {
//         console.error("Flashcard Fetch Error:", error.response?.data || error.message);
//         alert("AI Service is currently slow. Please wait 10 seconds and try again.");
//     } finally {
//         setIsGenerating(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//       <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Loading Study Material...</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-[#F9FAFB] min-h-screen">
//       <div className="flex items-center justify-between mb-8">
//         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm">
//           <ArrowLeft size={18} /> Back to Dashboard
//         </button>
//         <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
//           {document?.status || 'READY'}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         <div className="lg:col-span-3 space-y-6">
//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <div className="p-4 bg-blue-50 rounded-2xl w-fit mb-4">
//               <FileText className="text-blue-600" size={32} />
//             </div>
//             <h1 className="text-lg font-black text-gray-900 leading-tight mb-2 truncate">{document?.title}</h1>
//             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PDF Document Loaded</p>
//           </div>

//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <button 
//                 onClick={handleGenerateFlashcards}
//                 disabled={isGenerating}
//                 className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg disabled:opacity-50"
//             >
//                 {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />}
//                 {isGenerating ? "AI is Thinking..." : "Generate Flashcards"}
//             </button>
//             {flashcards.length > 0 && <FlashcardSection flashcards={flashcards} />}
//           </div>
//         </div>

//        <div className="lg:col-span-9 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[650px] overflow-hidden">
//   {/* Tab Headers */}
//   <div className="flex items-center border-b border-gray-100 px-4 bg-gray-50/30">
    
//     {/* Tab 1: Extracted Text */}
//     <button 
//       onClick={() => setActiveTab('content')}
//       className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
//     >
//       <Layout size={16} /> Extracted Text
//     </button>

//     {/* Tab 2: AI Study Chat */}
//     <button 
//       onClick={() => setActiveTab('chat')}
//       className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
//     >
//       <MessageSquare size={16} /> AI Study Chat
//     </button>

//     {/* Tab 3: View PDF */}
//     <button 
//       onClick={() => setActiveTab('pdf')}
//       className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'pdf' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
//     >
//       <File size={16} /> View PDF
//     </button>

//     {/* Tab 4: Start AI Quiz */}
//     <div className="flex-1 flex justify-center items-center px-2">
//       <button 
//         onClick={() => setShowQuizModal(true)}
//         className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-tighter shadow-md hover:shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
//       >
//         <Brain size={14} className="animate-pulse" /> 
//         Start AI Quiz
//       </button>
//     </div>
//   </div>

//   {/* Tab Content */}
//   <div className="flex-1 flex flex-col p-6 overflow-hidden">
//     {activeTab === 'content' ? (
//       <div className="h-[500px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
//         <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm leading-relaxed">
//           {document?.extractedText || "No text found."}
//         </pre>
//       </div>
//     ) : activeTab === 'chat' ? (
//       <div className="flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
//         <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 bg-gray-50/50 rounded-2xl" ref={chatEndRef}>
//           {chatHistory.length === 0 && (
//             <div className="text-center mt-12 text-gray-400">
//               <Brain size={40} className="mx-auto mb-3 opacity-20" />
//               <p className="text-[10px] font-bold uppercase tracking-widest">Ask Gemini about this PDF!</p>
//             </div>
//           )}
//           {chatHistory.map((msg, i) => (
//             <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               {msg.role === 'bot' && <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0"><Bot size={16}/></div>}
//               <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
//                 {msg.text}
//               </div>
//               {msg.role === 'user' && <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 shrink-0"><User size={16}/></div>}
//             </div>
//           ))}
//           {isTyping && (
//             <div className="flex gap-3 justify-start animate-pulse">
//               <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400"><Bot size={16}/></div>
//               <div className="bg-white p-4 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">AI Thinking...</div>
//             </div>
//           )}
//         </div>

//         <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-100 pt-4">
//           <input 
//             type="text" 
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder="Ask a question about the document..."
//             className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
//           />
//           <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
//             <Send size={20} />
//           </button>
//         </form>
//       </div>
//     ) : activeTab === 'pdf' ? (
//       <div className="h-[500px] bg-gray-900 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
//         {document?.filePath ? (
//           <PDFViewer 
//             pdfPath={
//               document.filePath.startsWith('http')
//                 ? document.filePath
//                 : `https://simplify-ai-mrrh.onrender.com/${document.filePath.replace(/\\/g, '/')}`
//             }
//             fileName={document.title} 
//           />
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center gap-3 bg-gray-900">
//             <File size={48} className="text-gray-600" />
//             <p className="text-gray-400 text-sm font-semibold">PDF file not available</p>
//             <p className="text-gray-500 text-xs">Please check if the PDF was uploaded correctly</p>
//           </div>
//         )}
//       </div>
//     ) : (
//       <div>Quiz content will go here</div>
//     )}
//   </div>

// {/* Quiz Count Modal */}
// {showQuizModal && (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in-95">
//       <h2 className="text-2xl font-black text-slate-800 mb-2">How Many Questions?</h2>
//       <p className="text-slate-400 text-[12px] uppercase tracking-wider mb-6">Choose between 5 and 20 questions</p>
      
//       <div className="mb-8">
//         <input 
//           type="range" 
//           min="5" 
//           max="20" 
//           value={quizCount} 
//           onChange={(e) => setQuizCount(parseInt(e.target.value))}
//           className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
//         />
//         <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold mt-2 px-1">
//           <span>Min: 5</span>
//           <span className="text-blue-600 font-black text-sm">{quizCount}</span>
//           <span>Max: 20</span>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <button 
//           onClick={() => navigate(`/documents/${id}/quiz/take`, { state: { quizCount } })}
//           className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-700 transition-all"
//         >
//           Generate {quizCount} Questions
//         </button>
//         <button 
//           onClick={() => setShowQuizModal(false)}
//           className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-[12px] uppercase hover:bg-slate-200"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default DocumentDetailPage;


// ye ek aur nya hai 

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FileText, ArrowLeft, Loader2, Layout, MessageSquare, Zap, Send, User, Bot, Brain, File, Download, Sparkles
// } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import PDFViewer from '../../components/PDFViewer';

// // --- Flashcard UI Component ---
// const FlashcardSection = ({ flashcards }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isFlipped, setIsFlipped] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);

//     if (!flashcards || flashcards.length === 0) return null;
//     const currentCard = flashcards[currentIndex];

//     const speak = (text) => {
//         window.speechSynthesis.cancel();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => setIsSpeaking(false);
//         window.speechSynthesis.speak(utterance);
//     };

//     const downloadAsPDF = () => {
//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.getWidth();
//         let yPos = 30;

//         doc.setFillColor(37, 99, 235);
//         doc.rect(0, 0, pageWidth, 25, 'F');
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(18);
//         doc.setTextColor(255, 255, 255);
//         doc.text("AI STUDY ASSISTANT - FLASHCARDS", 20, 17);

//         flashcards.forEach((card, index) => {
//             const qLines = doc.splitTextToSize(`Q: ${card.question}`, pageWidth - 40);
//             const aLines = doc.splitTextToSize(`A: ${card.answer}`, pageWidth - 50);
//             const blockHeight = (qLines.length * 7) + (aLines.length * 6) + 15;

//             if (yPos + blockHeight > 270) {
//                 doc.addPage();
//                 yPos = 20;
//             }

//             doc.setDrawColor(230, 230, 230);
//             doc.setFillColor(249, 250, 251);
//             doc.roundedRect(15, yPos, pageWidth - 30, blockHeight, 5, 5, 'FD');
//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(11);
//             doc.setTextColor(37, 99, 235);
//             doc.text(qLines, 20, yPos + 8);
//             doc.setFont("helvetica", "normal");
//             doc.setFontSize(10);
//             doc.setTextColor(60, 60, 60);
//             doc.text(aLines, 25, yPos + (qLines.length * 7) + 8);
//             yPos += blockHeight + 10;
//         });
//         doc.save(`Study_Material_Flashcards.pdf`);
//     };

//     return (
//         <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
//             <div className="flex justify-between items-center px-2">
//                 <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//                     Study Mode
//                 </h3>
//                 <div className="flex gap-2">
//                     <button 
//                         onClick={(e) => { e.stopPropagation(); speak(isFlipped ? currentCard.answer : currentCard.question); }}
//                         className={`p-2 rounded-lg transition-all border border-gray-100 bg-white shadow-sm ${isSpeaking ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-400 hover:text-blue-600'}`}
//                     >
//                         <Zap size={18} className={isSpeaking ? 'animate-bounce' : ''} />
//                     </button>
//                     <button onClick={downloadAsPDF} className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-all">
//                         <Download size={18} />
//                     </button>
//                 </div>
//             </div>
            
//             <div className="relative min-h-[300px] w-full perspective-1000">
//                 <div 
//                     className={`relative w-full h-full min-h-[300px] transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
//                     onClick={() => { setIsFlipped(!isFlipped); window.speechSynthesis.cancel(); }}
//                 >
//                     <div className="absolute inset-0 backface-hidden">
//                         <div className="h-full w-full bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-500/5 group-hover:border-blue-200 transition-all">
//                             <span className="text-[10px] font-black text-blue-400 uppercase mb-4 tracking-widest">Question</span>
//                             <div className="overflow-y-auto max-h-[180px] custom-scrollbar px-2">
//                                 <p className="text-gray-800 font-bold text-base leading-snug">{currentCard.question}</p>
//                             </div>
//                             <div className="mt-6 text-[9px] font-black text-gray-300 uppercase italic">Click to reveal answer</div>
//                         </div>
//                     </div>

//                     <div className="absolute inset-0 backface-hidden rotate-y-180">
//                         <div className="h-full w-full bg-blue-600 border-2 border-blue-400 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-600/30">
//                             <span className="text-[10px] font-bold text-blue-100 uppercase mb-4 tracking-widest">Answer</span>
//                             <div className="overflow-y-auto max-h-[180px] custom-scrollbar px-2">
//                                 <p className="text-white font-medium text-sm leading-relaxed">{currentCard.answer}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
//                 <button 
//                     disabled={currentIndex === 0}
//                     onClick={() => {setCurrentIndex(currentIndex - 1); setIsFlipped(false); window.speechSynthesis.cancel();}}
//                     className="p-3 bg-gray-50 text-gray-400 rounded-xl disabled:opacity-20 hover:text-blue-600"
//                 > <ArrowLeft size={20} /> </button>
//                 <span className="text-[11px] font-black text-gray-800">{currentIndex + 1} / {flashcards.length}</span>
//                 <button 
//                     disabled={currentIndex === flashcards.length - 1}
//                     onClick={() => {setCurrentIndex(currentIndex + 1); setIsFlipped(false); window.speechSynthesis.cancel();}}
//                     className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-20 hover:bg-blue-700 shadow-lg shadow-blue-200"
//                 > <Send size={20} /> </button>
//             </div>
//         </div>
//     );
// };

// const DocumentDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('content');
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [flashcards, setFlashcards] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [quizCount, setQuizCount] = useState(10);
//   const chatEndRef = useRef(null);

//   const API_BASE_URL = "https://simplify-ai-mrrh.onrender.com/api/documents";

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`https://simplify-ai-mrrh.onrender.com/${id}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         if (response.data.success) {
//           setDocument(response.data.document || response.data.data);
//         }
//       } catch (error) {
//         console.error("Error Fetching Doc:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id]);

//   useEffect(() => {
//     if (chatEndRef.current) {
//         chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
//     }
//   }, [chatHistory, isTyping]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;

//     const userMsg = { role: 'user', text: question };
//     setChatHistory(prev => [...prev, userMsg]);
//     setQuestion('');
//     setIsTyping(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/${id}/chat`, 
//         { question },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setChatHistory(prev => [...prev, { role: 'bot', text: response.data.answer }]);
//     } catch (error) {
//       setChatHistory(prev => [...prev, { role: 'bot', text: "AI is busy. Try again." }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleGenerateFlashcards = async () => {
//     try {
//         setIsGenerating(true);
//         const token = localStorage.getItem('token');
//         const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/${id}/flashcards`, {}, { 
//             headers: { Authorization: `Bearer ${token}` } 
//         });
        
//         if (response.data.success && response.data.flashcards.length > 0) {
//             setFlashcards(response.data.flashcards); 
//         } else {
//             alert("Bhai, AI thoda slow hai. Retry karein.");
//         }
//     } catch (error) {
//         alert("Server limit reached. Try in 10s.");
//     } finally {
//         setIsGenerating(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//       <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Loading Study Material...</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-[#F9FAFB] min-h-screen">
//       <div className="flex items-center justify-between mb-8">
//         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm">
//           <ArrowLeft size={18} /> Back to Dashboard
//         </button>
//         <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
//           {document?.status || 'READY'}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         <div className="lg:col-span-3 space-y-6">
//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <div className="p-4 bg-blue-50 rounded-2xl w-fit mb-4">
//               <FileText className="text-blue-600" size={32} />
//             </div>
//             <h1 className="text-lg font-black text-gray-900 leading-tight mb-2 truncate">{document?.title}</h1>
//             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PDF Document Loaded</p>
//           </div>

//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
//             <button 
//                 onClick={handleGenerateFlashcards}
//                 disabled={isGenerating}
//                 className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg disabled:opacity-50"
//             >
//               {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />}
//               {isGenerating ? "AI is Thinking..." : "Generate Flashcards"}
//             </button>
//             {flashcards.length > 0 && <FlashcardSection flashcards={flashcards} />}
//           </div>
//         </div>

//         <div className="lg:col-span-9 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[650px] overflow-hidden">
//           <div className="flex items-center border-b border-gray-100 px-4 bg-gray-50/30">
//             <button onClick={() => setActiveTab('content')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
//               <Layout size={16} /> Extracted Text
//             </button>
//             <button onClick={() => setActiveTab('chat')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
//               <MessageSquare size={16} /> AI Study Chat
//             </button>
//             <button onClick={() => setActiveTab('pdf')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'pdf' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
//               <File size={16} /> View PDF
//             </button>
//             <div className="flex-1 flex justify-center items-center px-2">
//               <button onClick={() => setShowQuizModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-tighter shadow-md hover:scale-[1.02] active:scale-95 transition-all">
//                 <Brain size={14} className="animate-pulse" /> Start AI Quiz
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col p-6 overflow-hidden">
//             {activeTab === 'content' ? (
//               <div className="h-[500px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
//                 <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm leading-relaxed">
//                   {document?.extractedText || "No text found."}
//                 </pre>
//               </div>
//             ) : activeTab === 'chat' ? (
//               <div className="flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
//                 <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 bg-gray-50/50 rounded-2xl custom-scrollbar" ref={chatEndRef}>
//                   {chatHistory.length === 0 && (
//                     <div className="text-center mt-12 text-gray-400">
//                       <Brain size={40} className="mx-auto mb-3 opacity-20" />
//                       <p className="text-[10px] font-bold uppercase tracking-widest">Ask Gemini about this PDF!</p>
//                     </div>
//                   )}
//                   {chatHistory.map((msg, i) => (
//                     <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                       {msg.role === 'bot' && <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0"><Bot size={16}/></div>}
//                       <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
//                         {msg.text}
//                       </div>
//                       {msg.role === 'user' && <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 shrink-0"><User size={16}/></div>}
//                     </div>
//                   ))}
//                   {isTyping && (
//                     <div className="flex gap-3 justify-start animate-pulse">
//                       <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400"><Bot size={16}/></div>
//                       <div className="bg-white p-4 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">AI Thinking...</div>
//                     </div>
//                   )}
//                 </div>
//                 <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-100 pt-4">
//                   <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question..." className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
//                   <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
//                     <Send size={20} />
//                   </button>
//                 </form>
//               </div>
//             ) : activeTab === 'pdf' ? (
//               <div className="h-[500px] bg-gray-900 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
//                 {document?.filePath ? (
//                   <PDFViewer 
//                     pdfPath={document.filePath.startsWith('http') ? document.filePath : `https://simplify-ai-mrrh.onrender.com/${document.filePath.replace(/\\/g, '/')}`}
//                     fileName={document.title} 
//                   />
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center gap-3 bg-gray-900">
//                     <File size={48} className="text-gray-600" />
//                     <p className="text-gray-400 text-sm font-semibold">PDF file not available</p>
//                   </div>
//                 )}
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {showQuizModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in-95">
//             <h2 className="text-2xl font-black text-slate-800 mb-2">How Many Questions?</h2>
//             <p className="text-slate-400 text-[12px] uppercase tracking-wider mb-6">Choose between 5 and 20 questions</p>
//             <div className="mb-8">
//               <input type="range" min="5" max="20" value={quizCount} onChange={(e) => setQuizCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
//               <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold mt-2 px-1">
//                 <span>Min: 5</span>
//                 <span className="text-blue-600 font-black text-sm">{quizCount}</span>
//                 <span>Max: 20</span>
//               </div>
//             </div>
//             <div className="space-y-3">
//               <button onClick={() => navigate(`/documents/${id}/quiz/take`, { state: { quizCount } })} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
//                 Generate {quizCount} Questions
//               </button>
//               <button onClick={() => setShowQuizModal(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-[12px] uppercase hover:bg-slate-200">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentDetailPage;



//ye ek aur naya jisme se extracted content gayab kiya hu 

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   ArrowLeft, Loader2, MessageSquare, Zap, Send, User, Bot, Brain, File, Download, Sparkles, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import PDFViewer from '../../components/PDFViewer';

// // --- Integrated Flashcard Component ---
// const FlashcardTab = ({ flashcards, onGenerate, isGenerating }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isFlipped, setIsFlipped] = useState(false);

//     if (!flashcards || flashcards.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6">
//                 <div className="p-6 bg-blue-50 rounded-full text-blue-600 animate-bounce">
//                     <Zap size={48} />
//                 </div>
//                 <div>
//                     <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No Flashcards Available</h3>
//                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Generate nodes to start active recall</p>
//                 </div>
//                 <button 
//                     onClick={onGenerate}
//                     disabled={isGenerating}
//                     className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-3"
//                 >
//                     {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
//                     {isGenerating ? "AI is processing..." : "Generate AI Flashcards"}
//                 </button>
//             </div>
//         );
//     }

//     const currentCard = flashcards[currentIndex];

//     return (
//         <div className="max-w-2xl mx-auto w-full py-10 animate-in fade-in zoom-in-95 duration-500">
//             {/* 🔥 FIXED RECTANGLE BOX: Aspect Ratio 16/10 */}
//             <div className="perspective-1000 w-full aspect-[16/10] min-h-[350px]">
//                 <div 
//                     className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
//                     onClick={() => setIsFlipped(!isFlipped)}
//                 >
//                     {/* Front Side: Question */}
//                     <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-50 rounded-[3rem] p-10 flex flex-col items-center shadow-2xl overflow-hidden">
//                         <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 shrink-0">Neural Node {currentIndex + 1}</span>
                        
//                         {/* Scrollable Content Area */}
//                         <div className="flex-1 w-full flex items-center justify-center overflow-y-auto custom-scrollbar px-4">
//                             <p className="text-slate-800 font-bold text-xl md:text-2xl leading-tight">
//                                 {currentCard.question}
//                             </p>
//                         </div>
                        
//                         <div className="mt-6 text-slate-300 font-bold text-[9px] uppercase tracking-widest animate-pulse shrink-0">Tap to Reveal Answer</div>
//                     </div>

//                     {/* Back Side: Answer */}
//                     <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 rounded-[3rem] p-10 flex flex-col items-center shadow-2xl shadow-blue-200 overflow-hidden">
//                         <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mb-6 shrink-0">AI Response</span>
                        
//                         {/* Scrollable Content Area */}
//                         <div className="flex-1 w-full flex items-center justify-center overflow-y-auto custom-scrollbar px-4">
//                             <p className="text-white font-medium text-lg md:text-xl leading-relaxed">
//                                 {currentCard.answer}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Navigation Controls */}
//             <div className="flex justify-between items-center mt-10 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
//                 <button 
//                     disabled={currentIndex === 0} 
//                     onClick={() => {setCurrentIndex(p => p-1); setIsFlipped(false)}}
//                     className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 disabled:opacity-20 transition-all active:scale-95"
//                 >
//                     <ChevronLeft size={24}/>
//                 </button>
//                 <div className="text-center font-black text-slate-800 tracking-tighter text-xl">
//                     {currentIndex + 1} <span className="text-slate-200">/</span> {flashcards.length}
//                 </div>
//                 <button 
//                     disabled={currentIndex === flashcards.length - 1} 
//                     onClick={() => {setCurrentIndex(p => p+1); setIsFlipped(false)}}
//                     className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-20 transition-all shadow-lg shadow-blue-100 active:scale-95"
//                 >
//                     <ChevronRight size={24}/>
//                 </button>
//             </div>
//         </div>
//     );
// };

// const DocumentDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('pdf'); // 🔥 Default to 'pdf'
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [flashcards, setFlashcards] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [quizCount, setQuizCount] = useState(10);
//   const chatEndRef = useRef(null);

//   const API_BASE_URL = "https://simplify-ai-mrrh.onrender.com/api/documents";

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`https://simplify-ai-mrrh.onrender.com/${id}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         if (response.data.success) {
//           setDocument(response.data.document || response.data.data);
//         }
//       } catch (err) { console.error(err); } finally { setLoading(false); }
//     };
//     fetchDoc();
//   }, [id]);

//   useEffect(() => {
//     if (chatEndRef.current) chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
//   }, [chatHistory, isTyping]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;
//     const userMsg = { role: 'user', text: question };
//     setChatHistory(prev => [...prev, userMsg]);
//     setQuestion('');
//     setIsTyping(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/${id}/chat`, { question }, { headers: { Authorization: `Bearer ${token}` } });
//       setChatHistory(prev => [...prev, { role: 'bot', text: response.data.answer }]);
//     } catch (err) { setChatHistory(prev => [...prev, { role: 'bot', text: "AI is busy." }]); } finally { setIsTyping(false); }
//   };

//   const handleGenerateFlashcards = async () => {
//     try {
//         setIsGenerating(true);
//         const token = localStorage.getItem('token');
//         const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/${id}/flashcards`, {}, { headers: { Authorization: `Bearer ${token}` } });
//         if (response.data.success) setFlashcards(response.data.flashcards);
//     } catch (err) { alert("AI Service slow. Retry in 10s."); } finally { setIsGenerating(false); }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//       <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Neural Sync Active...</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-[#F8FAFB] min-h-screen font-sans">
//       {/* Top Simple Navigation */}
//       <div className="flex items-center justify-between mb-8 max-w-[1400px] mx-auto">
//         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
//           <ArrowLeft size={16} /> Back to Dashboard
//         </button>
//         <div className="flex items-center gap-4">
//             <h2 className="text-slate-800 font-black text-sm uppercase tracking-tight">{document?.title}</h2>
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//         </div>
//       </div>

//       {/* --- Main Modern Container --- */}
//       <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden min-h-[750px] flex flex-col max-w-[1400px] mx-auto">
        
//         {/* Modern Tab Bar */}
//         <div className="flex items-center px-8 border-b border-slate-50 bg-slate-50/30">
//           <button onClick={() => setActiveTab('pdf')} className={`flex-1 py-7 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === 'pdf' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
//             <File size={16} /> View PDF
//           </button>
//           <button onClick={() => setActiveTab('chat')} className={`flex-1 py-7 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
//             <MessageSquare size={16} /> AI Chat
//           </button>
//           <button onClick={() => setActiveTab('flashcards')} className={`flex-1 py-7 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === 'flashcards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
//             <Zap size={16} /> Flashcards
//           </button>
//           <div className="flex-1 flex justify-center items-center py-6 px-4">
//             <button 
//               onClick={() => setShowQuizModal(true)} 
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-tighter shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
//             >
//               <Brain size={14} className="animate-pulse" /> Initialize AI Quiz
//             </button>
//           </div>
//         </div>

//         {/* Content Viewport */}
//         <div className="flex-1 p-10 overflow-hidden flex flex-col">
//           {activeTab === 'pdf' ? (
//             <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
//               <PDFViewer 
//                 pdfPath={document?.filePath?.startsWith('http') ? document.filePath : `https://simplify-ai-mrrh.onrender.com/${document?.filePath?.replace(/\\/g, '/')}`}
//                 fileName={document?.title} 
//               />
//             </div>
//           ) : activeTab === 'chat' ? (
//             <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
//               <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar" ref={chatEndRef}>
//                 {chatHistory.length === 0 && (
//                   <div className="text-center mt-20 text-slate-200">
//                     <MessageSquare size={64} className="mx-auto mb-4 opacity-10" />
//                     <p className="text-[10px] font-black uppercase tracking-[0.5em]">Neural Chat Interface Active</p>
//                   </div>
//                 )}
//                 {chatHistory.map((msg, i) => (
//                   <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                     {msg.role === 'bot' && <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg"><Bot size={20}/></div>}
//                     <div className={`max-w-[75%] p-6 rounded-[2.5rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
//                       {msg.text}
//                     </div>
//                     {msg.role === 'user' && <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm"><User size={20}/></div>}
//                   </div>
//                 ))}
//               </div>
//               <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100 shadow-inner">
//                 <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Analyze document data..." className="flex-1 bg-transparent border-none px-6 text-sm font-bold focus:ring-0 outline-none" />
//                 <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-4 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
//                   <Send size={20} />
//                 </button>
//               </form>
//             </div>
//           ) : activeTab === 'flashcards' ? (
//             <div className="flex-1 flex flex-col justify-center">
//               <FlashcardTab 
//                 flashcards={flashcards} 
//                 onGenerate={handleGenerateFlashcards} 
//                 isGenerating={isGenerating} 
//               />
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Quiz Configuration Modal */}
//       {showQuizModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-sm w-full p-10 animate-in fade-in zoom-in-95 duration-300">
//             <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto"><Brain size={32} /></div>
//             <h2 className="text-2xl font-black text-center text-slate-900 mb-2 tracking-tighter">AI Assessment</h2>
//             <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-10">Configure question density</p>
//             <div className="mb-10">
//               <input type="range" min="5" max="20" value={quizCount} onChange={(e) => setQuizCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//               <div className="flex justify-between text-[10px] text-slate-300 font-black mt-4 uppercase"><span>Min: 5</span><span className="text-blue-600 text-sm">{quizCount} Node</span><span>Max: 20</span></div>
//             </div>
//             <div className="space-y-3">
//               <button onClick={() => navigate(`/documents/${id}/quiz/take`, { state: { quizCount } })} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Initialize {quizCount} Questions</button>
//               <button onClick={() => setShowQuizModal(false)} className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase hover:text-slate-600 transition-all text-center">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentDetailPage;


//ye ek aur naya jisme ai chat ka design shik kiya hu

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { 
//   ArrowLeft, Loader2, MessageSquare, Zap, Send, User, Bot, Brain, File, 
//   Sparkles, ChevronLeft, ChevronRight, Download, Edit3, Save, X, FileText
// } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import PDFViewer from '../../components/PDFViewer';

// // --- Flashcard Tab Component ---
// const FlashcardTab = ({ flashcards, onGenerate, isGenerating }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isFlipped, setIsFlipped] = useState(false);

//     const downloadFlashcardsPDF = () => {
//         const doc = new jsPDF();
//         doc.setFillColor(37, 99, 235);
//         doc.rect(0, 0, 210, 25, 'F');
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(255, 255, 255);
//         doc.text("AI STUDY ASSISTANT - FLASHCARDS", 20, 17);
//         flashcards.forEach((card, i) => {
//             const y = 40 + (i * 35);
//             if (y > 270) doc.addPage();
//             doc.setFontSize(11); doc.setTextColor(37, 99, 235);
//             doc.text(`Q: ${card.question}`, 20, y);
//             doc.setFontSize(10); doc.setTextColor(60, 60, 60);
//             doc.text(`A: ${card.answer}`, 25, y + 10);
//         });
//         doc.save("Study_Flashcards.pdf");
//     };

//     if (flashcards.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6">
//                 <Brain size={60} className="text-slate-100 mb-2" />
//                 <button onClick={onGenerate} disabled={isGenerating} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-3">
//                     {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>}
//                     Generate AI Flashcards
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-3xl mx-auto w-full py-4 animate-in fade-in zoom-in-95 duration-500">
//             <div className="flex justify-end mb-4">
//                 <button onClick={downloadFlashcardsPDF} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border border-slate-100 px-4 py-2 rounded-xl bg-white shadow-sm">
//                     <Download size={14}/> Download PDF
//                 </button>
//             </div>
//             <div className="perspective-1000 w-full aspect-[16/9] min-h-[350px]">
//                 <div className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
//                     <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-50 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
//                         <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Node {currentIndex + 1}</span>
//                         <div className="overflow-y-auto custom-scrollbar px-4 w-full text-center"><p className="text-slate-800 font-bold text-2xl leading-snug">{flashcards[currentIndex].question}</p></div>
//                     </div>
//                     <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl shadow-blue-200 overflow-hidden">
//                         <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Response</span>
//                         <div className="overflow-y-auto custom-scrollbar px-4 w-full text-center"><p className="text-white font-medium text-xl leading-relaxed">{flashcards[currentIndex].answer}</p></div>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
//                 <button disabled={currentIndex === 0} onClick={() => {setCurrentIndex(p => p-1); setIsFlipped(false)}} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 disabled:opacity-20 transition-all"><ChevronLeft size={24}/></button>
//                 <div className="font-black text-slate-800 text-xl tracking-tighter">{currentIndex + 1} <span className="text-slate-200">/</span> {flashcards.length}</div>
//                 <button disabled={currentIndex === flashcards.length - 1} onClick={() => {setCurrentIndex(p => p+1); setIsFlipped(false)}} className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-20 shadow-lg shadow-blue-100 transition-all"><ChevronRight size={24}/></button>
//             </div>
//         </div>
//     );
// };

// // --- Main Page Component ---
// const DocumentDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('pdf');
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [flashcards, setFlashcards] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [quizCount, setQuizCount] = useState(10);
  
//   // Quick Notes States
//   const [notes, setNotes] = useState("");
//   const [showNotes, setShowNotes] = useState(false);
//   const [isSavingNotes, setIsSavingNotes] = useState(false);

//   const chatEndRef = useRef(null);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatHistory, isTyping]);

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//             const docData = res.data.document || res.data.data;
//             setDocument(docData);
//             setNotes(docData.notes || "");
//         }
//       } catch (err) { console.error(err); } finally { setLoading(false); }
//     };
//     fetchDoc();
//   }, [id]);

//   // 🔥 Correctly defined handleGenerateFlashcards
//   // 🔥 Har baar naye questions ke liye force_refresh logic
//   const handleGenerateFlashcards = async () => {
//     try {
//         setIsGenerating(true);
//         const token = localStorage.getItem('token');
        
//         // Humne yahan 'force_refresh: true' add kiya hai
//         const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/flashcards`, 
//             { force_refresh: true }, 
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.data.success) {
//             setFlashcards(response.data.flashcards);
//         }
//     } catch (err) { 
//         alert("AI is exploring different sections, please wait..."); 
//     } finally { 
//         setIsGenerating(false); 
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;
//     const userMsg = { role: 'user', text: question };
//     setChatHistory(prev => [...prev, userMsg]);
//     setQuestion('');
//     setIsTyping(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/chat`, { question }, { headers: { Authorization: `Bearer ${token}` } });
//       setChatHistory(prev => [...prev, { role: 'bot', text: res.data.answer }]);
//     } catch (err) { setChatHistory(prev => [...prev, { role: 'bot', text: "AI Node busy. Retry sync." }]); } finally { setIsTyping(false); }
//   };

//   const handleSaveNotes = async () => {
//     setIsSavingNotes(true);
//     try {
//         const token = localStorage.getItem('token');
//         await axios.put(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/notes`, { notes }, { headers: { Authorization: `Bearer ${token}` } });
//     } catch (err) { console.error("Notes save failed"); } finally { 
//         setTimeout(() => setIsSavingNotes(false), 1000);
//     }
//   };

//   const downloadNotesPDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "bold");
//     doc.text(`Study Notes: ${document?.title}`, 20, 20);
//     doc.setFont("helvetica", "normal"); doc.setFontSize(12);
//     const splitText = doc.splitTextToSize(notes, 170);
//     doc.text(splitText, 20, 35);
//     doc.save("My_Study_Notes.pdf");
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
//       <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em]">Syncing Neural Data...</p>
//     </div>
//   );

  
//   return (
//     <div className="p-6 bg-[#F8FAFB] min-h-screen flex flex-col font-sans">
//       <div className="flex items-center justify-between mb-6 max-w-[1600px] mx-auto w-full">
//         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all">
//           <ArrowLeft size={16} /> Dashboard
//         </button>
//         <div className="flex items-center gap-4">
//             <h2 className="text-slate-800 font-black text-xs uppercase tracking-tight max-w-[300px] truncate">{document?.title}</h2>
//             <button 
//                 onClick={() => window.open(document?.filePath?.startsWith('http') ? document.filePath : `https://simplify-ai-mrrh.onrender.com/${document?.filePath?.replace(/\\/g, '/')}`, '_blank')} 
//                 className="p-2.5 bg-white rounded-xl border border-slate-100 text-blue-600 shadow-sm hover:shadow-md transition-all"
//             >
//                 <Download size={16} />
//             </button>
//         </div>
//       </div>

//       <div className="flex-1 bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full">
//         <div className="flex items-center px-10 border-b border-slate-50 bg-slate-50/20">
//           {['pdf', 'chat', 'flashcards'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => setActiveTab(tab)} 
//               className={`flex-1 py-8 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
//             >
//               {tab === 'pdf' && <File size={16} />}
//               {tab === 'chat' && <MessageSquare size={16} />}
//               {tab === 'flashcards' && <Zap size={16} />}
//               {tab === 'pdf' ? 'View PDF' : tab === 'chat' ? 'AI Chat' : 'Flashcards'}
//             </button>
//           ))}
//           <div className="flex-1 flex justify-center py-6 px-4">
//             <button onClick={() => setShowQuizModal(true)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
//               <Brain size={14} className="animate-pulse" /> AI Quiz
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 p-8 overflow-hidden flex flex-col relative">
//           {activeTab === 'pdf' ? (
//             <div className="flex-1 flex gap-6 overflow-hidden h-full">
//                 <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative">
//                     <PDFViewer 
//   pdfPath={currentDoc.filePath}  // 'filePath' hona chahiye, kyunki model mein wahi naam hai
//   fileName={currentDoc.title} 
// />
//                     <button 
//                         onClick={() => setShowNotes(!showNotes)} 
//                         className={`absolute top-6 right-6 p-4 rounded-2xl shadow-2xl transition-all z-20 ${showNotes ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}
//                     >
//                         {showNotes ? <X size={20}/> : <Edit3 size={20}/>}
//                     </button>
//                 </div>
//                 {showNotes && (
//                     <div className="w-[350px] bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex flex-col animate-in slide-in-from-right-10 duration-500">
//                         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><FileText size={14}/> Quick Notes</span>
//                             <div className="flex gap-2">
//                                 <button onClick={downloadNotesPDF} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Download size={16}/></button>
//                                 <button onClick={handleSaveNotes} className={`p-2 transition-all ${isSavingNotes ? 'text-emerald-500' : 'text-slate-400 hover:text-blue-600'}`}>
//                                     {isSavingNotes ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
//                                 </button>
//                             </div>
//                         </div>
//                         <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Type notes here..." className="flex-1 bg-transparent p-8 text-sm font-medium leading-relaxed outline-none resize-none text-slate-600 custom-scrollbar" />
//                         <div className="p-4 px-8 text-[9px] font-bold uppercase tracking-tighter text-slate-300">
//                             {isSavingNotes ? "● Saving..." : "● All changes saved"}
//                         </div>
//                     </div>
//                 )}
//             </div>
//           ) : activeTab === 'chat' ? (
//             <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
//               <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
//                 {chatHistory.map((msg, i) => (
//                   <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
//                     {msg.role === 'bot' && <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0"><Bot size={24}/></div>}
//                     <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
//                       <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={chatEndRef} />
//               </div>
//               <form onSubmit={handleSendMessage} className="flex gap-4 bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100 shadow-inner sticky bottom-0">
//                 <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask AI Assistant..." className="flex-1 bg-transparent border-none px-6 text-sm font-bold focus:ring-0 outline-none" />
//                 <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"><Send size={20}/></button>
//               </form>
//             </div>
//           ) : activeTab === 'flashcards' ? (
//             <FlashcardTab flashcards={flashcards} onGenerate={handleGenerateFlashcards} isGenerating={isGenerating} />
//           ) : null}
//         </div>
//       </div>

//     {showQuizModal && (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
//     <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl max-w-sm w-full p-8 md:p-12 text-center">
//       <div className="h-16 w-16 md:h-20 md:w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
//         <Brain size={32} />
//       </div>
      
//       <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tighter">AI Assessment</h2>
      
//       {/* 🔥 THE FIX: Yahan hum dynamic count dikhayenge */}
//       <div className="mb-6">
//           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Question Density</p>
//           <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100">
//               {quizCount} {/* 👈 Ye number ab hamesha dikhega */}
//           </div>
//       </div>

//       <input 
//         type="range" 
//         min="5" 
//         max="20" 
//         step="1"
//         value={quizCount} 
//         onChange={(e) => setQuizCount(parseInt(e.target.value))} 
//         className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mb-8 accent-blue-600" 
//       />

//       <div className="space-y-3">
//           <button 
//             onClick={() => navigate(`/documents/${id}/quiz/take`, { state: { quizCount } })} 
//             className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all"
//           >
//             Start Session
//           </button>
//           <button onClick={() => setShowQuizModal(false)} className="w-full py-2 text-slate-300 font-bold text-[10px] uppercase">Cancel</button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default DocumentDetailPage;



//ye ek aur naya dte 13 feb

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Loader2, MessageSquare, Zap, Send, User, Bot, Brain, File, 
  Sparkles, ChevronLeft, ChevronRight, Download, Edit3, Save, X, FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import PDFViewer from '../../components/PDFViewer';



// API BASE URL from Env or Fallback to Render Link
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

// --- Flashcard Tab Component ---
const FlashcardTab = ({ flashcards, onGenerate, isGenerating }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const downloadFlashcardsPDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 25, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("AI STUDY ASSISTANT - FLASHCARDS", 20, 17);
        flashcards.forEach((card, i) => {
            const y = 40 + (i * 35);
            if (y > 270) doc.addPage();
            doc.setFontSize(11); doc.setTextColor(37, 99, 235);
            doc.text(`Q: ${card.question}`, 20, y);
            doc.setFontSize(10); doc.setTextColor(60, 60, 60);
            doc.text(`A: ${card.answer}`, 25, y + 10);
        });
        doc.save("Study_Flashcards.pdf");
    };

    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6">
                <Brain size={60} className="text-slate-100 mb-2" />
                <button onClick={onGenerate} disabled={isGenerating} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-3">
                    {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>}
                    Generate AI Flashcards
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full py-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-end mb-4">
                <button onClick={downloadFlashcardsPDF} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border border-slate-100 px-4 py-2 rounded-xl bg-white shadow-sm">
                    <Download size={14}/> Download PDF
                </button>
            </div>
            <div className="perspective-1000 w-full aspect-[16/9] min-h-[350px]">
                <div className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                    <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-50 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                        <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Node {currentIndex + 1}</span>
                        <div className="overflow-y-auto custom-scrollbar px-4 w-full text-center"><p className="text-slate-800 font-bold text-2xl leading-snug">{flashcards[currentIndex].question}</p></div>
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl shadow-blue-200 overflow-hidden">
                        <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Response</span>
                        <div className="overflow-y-auto custom-scrollbar px-4 w-full text-center"><p className="text-white font-medium text-xl leading-relaxed">{flashcards[currentIndex].answer}</p></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <button disabled={currentIndex === 0} onClick={() => {setCurrentIndex(p => p-1); setIsFlipped(false)}} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 disabled:opacity-20 transition-all"><ChevronLeft size={24}/></button>
                <div className="font-black text-slate-800 text-xl tracking-tighter">{currentIndex + 1} <span className="text-slate-200">/</span> {flashcards.length}</div>
                <button disabled={currentIndex === flashcards.length - 1} onClick={() => {setCurrentIndex(p => p+1); setIsFlipped(false)}} className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-20 shadow-lg shadow-blue-100 transition-all"><ChevronRight size={24}/></button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pdf');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizCount, setQuizCount] = useState(5);
  const [flashcardCount, setFlashcardCount] = useState(5);  // 🔥 NEW: Flashcard count state
  const [showFlashcardSelector, setShowFlashcardSelector] = useState(false);  // 🔥 NEW: Show selector modal
  
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.data.success) {
            const data = res.data.document || res.data.data;
            setDoc(data);
            setNotes(data.notes || "");
        }
      } catch (err) { console.error("Fetch Doc Error:", err); } finally { setLoading(false); }
    };
    fetchDoc();
  }, [id]);

  const handleGenerateFlashcards = async () => {
    try {
        setIsGenerating(true);
        const token = localStorage.getItem('token');
        console.log("📤 Generating flashcards with count:", flashcardCount);
        const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/flashcards`, 
            { count: flashcardCount },  // 🔥 SEND COUNT TO BACKEND
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            setFlashcards(response.data.flashcards);
            setShowFlashcardSelector(false);
            alert(`✅ Generated ${response.data.flashcards.length} flashcards!`);
        }
    } catch (err) { 
        console.error("Flashcard generation error:", err);
        alert("Error generating flashcards: " + (err.response?.data?.message || err.message)); 
    } finally { 
        setIsGenerating(false); 
    }
  };

  const handleGenerateQuiz = async () => {
    try {
        setIsGenerating(true);
        const token = localStorage.getItem('token');
        console.log("📤 Generating quiz with count:", quizCount);
        const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/quiz`, 
            { count: quizCount },  // 🔥 SEND COUNT TO BACKEND
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            console.log("✅ Quiz generated successfully");
            setShowQuizModal(false);
            // Navigate to quiz taking page with the quiz ID
            navigate(`/documents/${id}/quiz/take`, { state: { quizId: response.data.quiz._id, quiz: response.data.quiz } });
        }
    } catch (err) { 
        console.error("Quiz generation error:", err);
        alert("Error generating quiz: " + (err.response?.data?.message || err.message)); 
    } finally { 
        setIsGenerating(false); 
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const userMsg = { role: 'user', text: question };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsTyping(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/chat`, 
        { question }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success && res.data?.answer) {
        setChatHistory(prev => [...prev, { role: 'bot', text: res.data.answer }]);
      } else {
        throw new Error(res.data?.message || "Invalid response from AI");
      }
    } catch (err) { 
        const errorMsg = err.response?.data?.message || err.message || "AI Node busy. Retry sync.";
        console.error("Chat error:", errorMsg);
        setChatHistory(prev => [...prev, { role: 'bot', text: "❌ " + errorMsg }]); 
    } finally { setIsTyping(false); }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
        const token = localStorage.getItem('token');
        await axios.put(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/notes`, 
            { notes }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) { console.error("Notes save failed"); } finally { 
        setTimeout(() => setIsSavingNotes(false), 1000);
    }
  };

  const downloadNotesPDF = () => {
    const pdfDoc = new jsPDF();
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text(`Study Notes: ${doc?.title}`, 20, 20);
    pdfDoc.setFont("helvetica", "normal"); 
    pdfDoc.setFontSize(12);
    const splitText = pdfDoc.splitTextToSize(notes, 170);
    pdfDoc.text(splitText, 20, 35);
    pdfDoc.save("My_Study_Notes.pdf");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em]">Syncing Neural Data...</p>
    </div>
  );

  return (
    <div className="p-6 bg-[#F8FAFB] min-h-screen flex flex-col font-sans">
      <div className="flex items-center justify-between mb-6 max-w-[1600px] mx-auto w-full">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-4">
            <h2 className="text-slate-800 font-black text-xs uppercase tracking-tight max-w-[300px] truncate">{doc?.title}</h2>
            <button 
                onClick={() => {
                    const pdfUrl = doc?.filePath;
                    if (pdfUrl) {
                        // Add ?dl=1 parameter to force download
                        const downloadUrl = pdfUrl.includes('?') ? pdfUrl + '&dl=1' : pdfUrl + '?dl=1';
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = doc?.title || 'document.pdf';
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }}
                className="p-2.5 bg-white rounded-xl border border-slate-100 text-blue-600 shadow-sm hover:shadow-md transition-all"
                title="Download PDF"
            >
                <Download size={16} />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full">
        <div className="flex items-center px-10 border-b border-slate-50 bg-slate-50/20">
          {['pdf', 'chat', 'flashcards'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-8 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab === 'pdf' && <File size={16} />}
              {tab === 'chat' && <MessageSquare size={16} />}
              {tab === 'flashcards' && <Zap size={16} />}
              {tab === 'pdf' ? 'View PDF' : tab === 'chat' ? 'AI Chat' : 'Flashcards'}
            </button>
          ))}
          <div className="flex-1 flex justify-center py-6 px-4">
            <button onClick={() => setShowQuizModal(true)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <Brain size={14} className="animate-pulse" /> AI Quiz
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-hidden flex flex-col relative">
          {activeTab === 'pdf' ? (
            <div className="flex-1 flex gap-6 overflow-hidden h-full">
                <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative">
                    {/* 🔥 THE FIX: pass pdfPath from doc state */}
                    {doc?.filePath ? (
                        <PDFViewer 
                           pdfPath={doc.filePath} 
                           fileName={doc.title} 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 uppercase text-[10px] font-black">Link Missing</div>
                    )}
                    
                    <button 
                        onClick={() => setShowNotes(!showNotes)} 
                        className={`absolute top-6 right-6 p-4 rounded-2xl shadow-2xl transition-all z-20 ${showNotes ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}
                    >
                        {showNotes ? <X size={20}/> : <Edit3 size={20}/>}
                    </button>
                </div>
                {showNotes && (
                    <div className="w-[350px] bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex flex-col animate-in slide-in-from-right-10 duration-500">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><FileText size={14}/> Quick Notes</span>
                            <div className="flex gap-2">
                                <button onClick={downloadNotesPDF} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Download size={16}/></button>
                                <button onClick={handleSaveNotes} className={`p-2 transition-all ${isSavingNotes ? 'text-emerald-500' : 'text-slate-400 hover:text-blue-600'}`}>
                                    {isSavingNotes ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                                </button>
                            </div>
                        </div>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Type notes here..." className="flex-1 bg-transparent p-8 text-sm font-medium leading-relaxed outline-none resize-none text-slate-600 custom-scrollbar" />
                        <div className="p-4 px-8 text-[9px] font-bold uppercase tracking-tighter text-slate-300">
                            {isSavingNotes ? "● Saving..." : "● All changes saved"}
                        </div>
                    </div>
                )}
            </div>
          ) : activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
              <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    {msg.role === 'bot' && <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0"><Bot size={24}/></div>}
                    <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-4 bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100 shadow-inner sticky bottom-0">
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask AI Assistant..." className="flex-1 bg-transparent border-none px-6 text-sm font-bold focus:ring-0 outline-none" />
                <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"><Send size={20}/></button>
              </form>
            </div>
          ) : activeTab === 'flashcards' ? (
            <div className="flex flex-col h-full">
              {!showFlashcardSelector ? (
                <>
                  {flashcards.length > 0 ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {flashcards.map((card, idx) => (
                          <div key={idx} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl shadow-sm">
                            <p className="text-[11px] text-blue-600 font-black uppercase tracking-widest mb-2">Q{idx + 1}</p>
                            <p className="font-black text-slate-900 mb-3">{card.question}</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{card.answer}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-3">Difficulty: {card.difficulty || 'medium'}</p>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setShowFlashcardSelector(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap size={16} /> Generate More
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Zap size={48} className="text-slate-300 mb-4" />
                      <p className="text-slate-500 font-black text-sm uppercase tracking-widest mb-4">No Flashcards Yet</p>
                      <button 
                        onClick={() => setShowFlashcardSelector(true)}
                        className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                      >
                        Create Now
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Zap size={48} className="text-blue-600 mb-4" />
                  <h3 className="text-slate-900 font-black text-lg mb-4 uppercase tracking-tight">How Many Flashcards?</h3>
                  <p className="text-slate-500 text-[12px] font-bold uppercase tracking-widest mb-6">Choose between 5-10 questions</p>
                  
                  <div className="mb-6">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Count</p>
                    <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-blue-100">
                      {flashcardCount}
                    </div>
                  </div>
                  
                  <input 
                    type="range" 
                    min="5" 
                    max="10" 
                    step="1"
                    value={flashcardCount} 
                    onChange={(e) => setFlashcardCount(parseInt(e.target.value))} 
                    className="w-full max-w-xs h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mb-8 accent-blue-600" 
                  />
                  
                  <div className="space-y-3 w-full max-w-xs">
                    <button 
                      onClick={handleGenerateFlashcards}
                      disabled={isGenerating}
                      className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Zap size={14} /> Generate {flashcardCount} Cards
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setShowFlashcardSelector(false)}
                      className="w-full py-2 text-slate-300 font-bold text-[10px] uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {showQuizModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl max-w-sm w-full p-8 md:p-12 text-center">
            <div className="h-16 w-16 md:h-20 md:w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain size={32} />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tighter">AI Assessment</h2>
            <div className="mb-6">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Question Density</p>
                <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100">
                    {quizCount}
                </div>
            </div>
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="1"
              value={quizCount} 
              onChange={(e) => setQuizCount(parseInt(e.target.value))} 
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mb-8 accent-blue-600" 
            />
            <div className="space-y-3">
                <button 
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Brain size={14} /> Start {quizCount}-Question Quiz
                    </>
                  )}
                </button>
                <button onClick={() => setShowQuizModal(false)} className="w-full py-2 text-slate-300 font-bold text-[10px] uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage;