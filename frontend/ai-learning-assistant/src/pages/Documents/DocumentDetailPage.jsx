import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Loader2, MessageSquare, Zap, Send, User, Bot, Brain, File, 
  Download, ChevronLeft, ChevronRight, Edit3, Save, X, FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import PDFViewer from '../../components/PDFViewer';
import { getDocument, askAI, generateFlashcardsAPI, generateQuiz } from '../../services/api';
import API from '../../services/api';

// --- HARDCORE RESPONSIVE FLASHCARD COMPONENT ---
const FlashcardTab = ({ flashcards, onGenerate, isGenerating, onShowSelector }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const downloadFlashcardsPDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 25, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("SIMPLIFY AI - FLASHCARDS", 20, 17);
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
            <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-center space-y-4 sm:space-y-6">
                <Brain size={40} className="sm:size-[50px] md:size-[60px] text-slate-100" />
                <button onClick={onShowSelector} disabled={isGenerating} className="bg-blue-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-95">
                    {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14}/>}
                    <span className="text-xs sm:text-sm">Generate Flashcards</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Study Mode {currentIndex + 1}/{flashcards.length}</h3>
                <button onClick={downloadFlashcardsPDF} className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border border-slate-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-white shadow-sm active:scale-95 w-full sm:w-auto">
                    <Download size={12}/> 
                    <span>Download PDF</span>
                </button>
            </div>

            {/* Flashcard - RESPONSIVE CONTAINER */}
            <div className="perspective-1000 w-full aspect-[16/9] min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
                <div 
                    className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer hover:scale-[1.01]`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* FRONT SIDE */}
                    <div className={`absolute inset-0 bg-white border-2 border-slate-50 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden transition-opacity ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <span className="text-blue-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-3 sm:mb-4 md:mb-6">Question {currentIndex + 1}</span>
                        <div className="flex-1 w-full flex items-center justify-center overflow-y-auto custom-scrollbar px-2 sm:px-4">
                            <p className="text-slate-800 font-bold text-base sm:text-lg md:text-2xl leading-snug text-center break-words">
                                {flashcards[currentIndex].question}
                            </p>
                        </div>
                        <p className="text-slate-300 font-bold text-[8px] sm:text-[9px] uppercase tracking-widest animate-pulse mt-2 sm:mt-3 md:mt-4">Tap to reveal</p>
                    </div>

                    {/* BACK SIDE */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center shadow-lg sm:shadow-xl md:shadow-2xl shadow-blue-300/20 overflow-hidden transition-opacity ${!isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <span className="text-white/50 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-3 sm:mb-4 md:mb-6">Answer</span>
                        <div className="flex-1 w-full flex items-center justify-center overflow-y-auto custom-scrollbar px-2 sm:px-4">
                            <p className="text-white font-medium text-sm sm:text-base md:text-lg leading-relaxed text-center break-words">
                                {flashcards[currentIndex].answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls - RESPONSIVE */}
            <div className="flex justify-between items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
                <button 
                    disabled={currentIndex === 0} 
                    onClick={() => {setCurrentIndex(p => p-1); setIsFlipped(false)}}
                    className="p-2.5 sm:p-3 md:p-4 bg-slate-50 text-slate-400 rounded-xl sm:rounded-2xl hover:text-blue-600 disabled:opacity-20 transition-all active:scale-90"
                >
                    <ChevronLeft size={16} className="sm:size-[20px] md:size-[24px]"/>
                </button>
                <div className="font-black text-slate-800 text-xs sm:text-sm md:text-lg tracking-tighter text-center">
                    {currentIndex + 1} <span className="text-slate-300">/</span> {flashcards.length}
                </div>
                <button 
                    disabled={currentIndex === flashcards.length - 1} 
                    onClick={() => {setCurrentIndex(p => p+1); setIsFlipped(false)}}
                    className="p-2.5 sm:p-3 md:p-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl hover:bg-blue-700 disabled:opacity-20 shadow-lg shadow-blue-100 transition-all active:scale-90"
                >
                    <ChevronRight size={16} className="sm:size-[20px] md:size-[24px]"/>
                </button>
            </div>

            <button 
                onClick={onShowSelector}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
            >
                <Zap size={14} /> Generate More
            </button>
        </div>
    );
};

// --- MAIN DOCUMENT DETAIL PAGE ---
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
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [showFlashcardSelector, setShowFlashcardSelector] = useState(false);
  
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
        const res = await getDocument(id);
        if (res.data.success) {
            const data = res.data.document || res.data.data;
            setDoc(data);
            setNotes(data.notes || "");
        }
      } catch (err) { console.error("Fetch Doc Error:", err); } 
      finally { setLoading(false); }
    };
    fetchDoc();
  }, [id]);

  const handleGenerateFlashcards = async () => {
    try {
        setIsGenerating(true);
        const response = await generateFlashcardsAPI(id, flashcardCount);
        if (response.data.success) {
            setFlashcards(response.data.flashcards);
            setShowFlashcardSelector(false);
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
        const response = await generateQuiz(id, quizCount);
        if (response.data.success && response.data.quiz) {
            setShowQuizModal(false);
            navigate(`/documents/${id}/quiz/take`, { 
                state: { 
                    quiz: response.data.quiz,
                    quizId: response.data.quiz._id,
                    quizCount 
                } 
            });
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
      const res = await axios.post(`${API_BASE_URL}/documents/${id}/chat`, 
        { question }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success && res.data?.answer) {
        setChatHistory(prev => [...prev, { role: 'bot', text: res.data.answer }]);
      }
    } catch (err) { 
        const errorMsg = err.response?.data?.message || err.message || "AI is busy. Retry sync.";
        setChatHistory(prev => [...prev, { role: 'bot', text: "❌ " + errorMsg }]); 
    } finally { setIsTyping(false); }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/documents/${id}/notes`, 
            { notes }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) { console.error("Notes save failed"); } 
    finally { 
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
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8FAFB] min-h-screen flex flex-col font-sans">
      {/* Header - RESPONSIVE */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 w-full">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 sm:gap-3 text-slate-400 hover:text-blue-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={14} className="sm:size-[16px]" /> 
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <h2 className="text-slate-800 font-black text-xs sm:text-sm uppercase tracking-tight max-w-[200px] sm:max-w-[400px] truncate">{doc?.title}</h2>
      </div>

      {/* Main Container - RESPONSIVE */}
      <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] shadow-lg sm:shadow-xl md:shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-full">
        
        {/* Tabs - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row items-center px-3 sm:px-6 md:px-8 border-b border-slate-50 bg-slate-50/20 gap-2 sm:gap-0 pt-2 sm:pt-0">
          {['pdf', 'chat', 'flashcards'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-4 sm:py-6 md:py-8 px-2 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 sm:gap-2 transition-all whitespace-nowrap border-b-2 sm:border-b-0 ${activeTab === tab ? 'text-blue-600 border-blue-600 sm:border-b-2' : 'text-slate-400 hover:text-slate-900 border-transparent'}`}
            >
              {tab === 'pdf' && <File size={14} className="sm:size-[16px]" />}
              {tab === 'chat' && <MessageSquare size={14} className="sm:size-[16px]" />}
              {tab === 'flashcards' && <Zap size={14} className="sm:size-[16px]" />}
              <span className="hidden sm:inline">
                {tab === 'pdf' ? 'View PDF' : tab === 'chat' ? 'AI Chat' : 'Flashcards'}
              </span>
            </button>
          ))}
          <div className="flex-1 flex justify-center py-3 sm:py-4 px-2 sm:px-3 w-full sm:w-auto">
            <button onClick={() => setShowQuizModal(true)} className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-tighter sm:tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1 sm:gap-2">
              <Brain size={12} className="sm:size-[14px] animate-pulse" /> 
              <span className="hidden sm:inline">AI Quiz</span>
            </button>
          </div>
        </div>

        {/* Content Area - RESPONSIVE */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col relative">
          
          {/* PDF TAB */}
          {activeTab === 'pdf' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-4 overflow-hidden h-full">
                {/* PDF Viewer */}
                <div className="flex-1 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative min-h-[300px] sm:min-h-[400px] md:min-h-[600px]">
                    {doc?.filePath ? (
                        <PDFViewer 
                           pdfPath={doc.filePath} 
                           fileName={doc.title} 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 uppercase text-[10px] font-black">PDF Not Available</div>
                    )}
                    
                    <button 
                        onClick={() => setShowNotes(!showNotes)} 
                        className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-md sm:shadow-2xl transition-all z-20 ${showNotes ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}
                    >
                        {showNotes ? <X size={16} className="sm:size-[18px] md:size-[20px]" /> : <Edit3 size={16} className="sm:size-[18px] md:size-[20px]" />}
                    </button>
                </div>

                {/* Notes Sidebar - RESPONSIVE */}
                {showNotes && (
                    <div className="w-full lg:w-[320px] xl:w-[380px] bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col animate-in slide-in-from-bottom-4 lg:slide-in-from-right-4 duration-300">
                        <div className="p-3 sm:p-4 md:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><FileText size={12} className="sm:size-[14px]"/> Notes</span>
                            <div className="flex gap-1 sm:gap-2">
                                <button onClick={downloadNotesPDF} className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 transition-all"><Download size={14} className="sm:size-[16px]"/></button>
                                <button onClick={handleSaveNotes} className={`p-1.5 sm:p-2 transition-all ${isSavingNotes ? 'text-emerald-500' : 'text-slate-400 hover:text-blue-600'}`}>
                                    {isSavingNotes ? <Loader2 size={14} className="sm:size-[16px] animate-spin"/> : <Save size={14} className="sm:size-[16px]"/>}
                                </button>
                            </div>
                        </div>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Type notes here..." className="flex-1 bg-transparent p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium leading-relaxed outline-none resize-none text-slate-600 custom-scrollbar" />
                        <div className="p-2 sm:p-3 px-3 sm:px-4 md:px-6 text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-slate-300 shrink-0">
                            {isSavingNotes ? "● Saving..." : "● Saved"}
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 md:space-y-6 mb-3 sm:mb-4 md:mb-6 pr-2 custom-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <MessageSquare size={32} className="sm:size-[40px] md:size-[48px] text-slate-200" />
                    <p className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Ask Simplify AI about this document</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-2 sm:gap-3 md:gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    {msg.role === 'bot' && <div className="h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md sm:shadow-lg shrink-0"><Bot size={14} className="sm:size-[18px] md:size-[24px]"/></div>}
                    <div className={`max-w-[80%] sm:max-w-[75%] p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] text-xs sm:text-sm md:text-base leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                    {msg.role === 'user' && <div className="h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center shadow-sm shrink-0"><User size={14} className="sm:size-[18px] md:size-[24px]"/></div>}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-inner sticky bottom-0 shrink-0">
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask AI..." className="flex-1 bg-transparent border-none px-3 sm:px-4 md:px-6 text-xs sm:text-sm font-bold focus:ring-0 outline-none" />
                <button type="submit" disabled={isTyping} className="bg-blue-600 text-white p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all shadow-md active:scale-90"><Send size={14} className="sm:size-[16px] md:size-[20px]"/></button>
              </form>
            </div>
          )}

          {/* FLASHCARDS TAB */}
          {activeTab === 'flashcards' && !showFlashcardSelector && (
            <div className="flex flex-col h-full">
              {flashcards.length > 0 ? (
                <>
                  <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 pr-2">
                    <FlashcardTab 
                      flashcards={flashcards}
                      onGenerate={() => setShowFlashcardSelector(true)}
                      isGenerating={isGenerating}
                      onShowSelector={() => setShowFlashcardSelector(true)}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4">
                  <Zap size={40} className="sm:size-[48px] md:size-[56px] text-slate-300" />
                  <p className="text-slate-500 font-black text-xs sm:text-sm uppercase tracking-widest">No Flashcards Yet</p>
                  <button 
                    onClick={() => setShowFlashcardSelector(true)}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Create Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FLASHCARD SELECTOR MODAL */}
          {activeTab === 'flashcards' && showFlashcardSelector && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4 px-4">
              <Zap size={40} className="sm:size-[48px] md:size-[56px] text-blue-600" />
              <h3 className="text-slate-900 font-black text-sm sm:text-base uppercase tracking-tight">Generate Flashcards</h3>
              <p className="text-slate-500 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest">Choose card count</p>
              
              <div className="mb-4 sm:mb-6">
                <div className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg shadow-blue-100">
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
                className="w-full max-w-xs h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
              <p className="text-slate-300 text-[9px] uppercase tracking-widest">Min: 5 | Max: 10</p>
              
              <div className="space-y-2 sm:space-y-3 w-full max-w-xs mt-4 sm:mt-6">
                <button 
                  onClick={handleGenerateFlashcards}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
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
                  className="w-full py-2 text-slate-300 font-bold text-[9px] uppercase hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal - RESPONSIVE */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
          <div className="bg-white rounded-3xl sm:rounded-4xl md:rounded-[4rem] shadow-2xl max-w-sm w-full p-6 sm:p-8 md:p-12 text-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Brain size={28} className="sm:size-[32px] md:size-[40px]" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 mb-1 sm:mb-2 tracking-tighter">AI Assessment</h2>
            <p className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-4 sm:mb-6">Select questions count</p>
            
            <div className="mb-4 sm:mb-6">
                <div className="inline-block px-5 sm:px-6 py-2 bg-blue-600 text-white rounded-2xl font-black text-base sm:text-lg shadow-lg shadow-blue-100">
                    {quizCount} Qs
                </div>
            </div>
            
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="1"
              value={quizCount} 
              onChange={(e) => setQuizCount(parseInt(e.target.value))} 
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-3 sm:mb-4" 
            />
            <p className="text-slate-300 text-[9px] uppercase tracking-widest mb-4 sm:mb-6">Min: 5 | Max: 20</p>

            <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
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
                <button onClick={() => setShowQuizModal(false)} className="w-full py-2 text-slate-300 font-bold text-[9px] uppercase hover:text-slate-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage;