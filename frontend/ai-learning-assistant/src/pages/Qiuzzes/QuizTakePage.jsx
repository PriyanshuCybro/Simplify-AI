import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowRight, Loader2, AlertCircle, Save } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com/api";

const QuizTakePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 🔥 Get quiz from state OR quizId to fetch
    const quizData = location.state?.quiz;
    const quizId = location.state?.quizId;
    const quizCount = location.state?.quizCount || (quizData?.questions?.length || 10);

    const [questions, setQuestions] = useState([]);
    const [quizMeta, setQuizMeta] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let quizQuestions;
                let quizMetadata;
                
                // If quiz passed via state, use it directly
                if (quizData?.questions) {
                    quizQuestions = quizData.questions;
                    quizMetadata = quizData;
                    console.log("✅ Using quiz from state:", quizQuestions.length, "questions");
                } else if (quizId) {
                    // Otherwise fetch it
                    const res = await axios.get(`${API_BASE_URL}/documents/${id}/quiz/${quizId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    quizQuestions = res.data.data?.questions || res.data.questions || [];
                    quizMetadata = res.data.data || res.data;
                    console.log("✅ Fetched quiz from backend:", quizQuestions.length, "questions");
                } else {
                    throw new Error("No quiz data provided");
                }
                
                if (!quizQuestions || quizQuestions.length === 0) {
                    throw new Error("Quiz has no questions");
                }
                
                setQuestions(quizQuestions);
                setQuizMeta(quizMetadata);
            } catch (err) {
                console.error("❌ Load Quiz Error:", err.response?.data || err.message);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id, quizId, quizData]);

    const saveResultToDB = async (finalAnswers) => {
        setIsSaving(true);
        try {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            console.log("💾 Saving quiz result with answers:", finalAnswers.length);
            
            // Call backend to save and calculate score
            const response = await axios.post(`${API_BASE_URL}/documents/${id}/quiz/${quizMeta?._id}/save`, {
                userAnswers: finalAnswers  // [{questionIndex, selectedAnswer}, ...]
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                console.log("✅ Quiz result saved successfully");
                // Navigate to result page with full quiz data
                navigate(`/quiz/${response.data.data.quizId || quizMeta?._id}`, { 
                    state: { 
                        score: response.data.data.score,
                        total: response.data.data.totalQuestions,
                        accuracy: response.data.data.accuracy,
                        userAnswers: response.data.data.userAnswers,
                        questions: response.data.data.questions,
                        timeSpent: timeSpent
                    } 
                });
            }
        } catch (err) {
            console.error("❌ Save error:", err.response?.data || err.message);
            alert("Failed to save result: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = () => {
        if (!selected) return;

        const updatedAnswers = [...userAnswers, {
            questionIndex: currentIdx,
            selectedAnswer: selected
        }];

        setUserAnswers(updatedAnswers);

        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(currentIdx + 1);
            setSelected(null);
        } else {
            // Quiz completed - save results
            saveResultToDB(updatedAnswers);
        }
    };

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-gray-50 text-center">
            <AlertCircle className="text-red-500 mb-3 sm:mb-4 sm:size-[48px]" size={40} />
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 mb-2">Sync Interrupted</h2>
            <p className="text-slate-500 max-w-sm mb-4 sm:mb-6 text-xs sm:text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase">Try Again</button>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 sm:gap-4 bg-gray-50">
            <Loader2 className="animate-spin text-blue-600 sm:size-[50px]" size={40}/>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs sm:text-sm animate-pulse">Neural Syncing {quizCount} Nodes...</p>
        </div>
    );

    if (isSaving) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 sm:gap-4 bg-white p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-blue-600 uppercase tracking-widest text-[10px] sm:text-xs">Writing to Database...</p>
        </div>
    );

    const progress = ((currentIdx + 1) / (questions.length || 1)) * 100;
    
    // Calculate live accuracy from answered questions
    const answeredCount = userAnswers.filter(a => a.selectedAnswer).length;
    const correctCount = userAnswers.filter((a, idx) => {
        const q = questions[idx];
        return q && a.selectedAnswer === q.correctAnswer;
    }).length;
    const liveAccuracy = answeredCount === 0 ? 100 : Math.round((correctCount / answeredCount) * 100);

    return (
        <div className="min-h-screen bg-[#F8FAFB] p-3 sm:p-4 md:p-6 flex flex-col">
            {/* Stats Bar - RESPONSIVE */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                    Accuracy: {liveAccuracy}%
                </span>
                <span className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest shrink-0">Q {currentIdx + 1}/{questions.length}</span>
            </div>
            
            {/* Progress Bar - RESPONSIVE */}
            <div className="w-full h-1.5 sm:h-2 md:h-3 bg-gray-100 rounded-full mb-4 sm:mb-6 md:mb-8 overflow-hidden shadow-inner border border-gray-50">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>

            {/* Main Question Card - RESPONSIVE */}
            <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] shadow-lg sm:shadow-xl md:shadow-2xl border border-blue-50 overflow-hidden flex-1 flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 flex-1 flex flex-col overflow-y-auto">
                    {/* Header Stats - RESPONSIVE */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
                        <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-50 rounded-full flex gap-1 sm:gap-2 items-center">
                             <span className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest">Q {currentIdx + 1} / {questions.length}</span>
                             <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase ${questions[currentIdx]?.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {questions[currentIdx]?.difficulty || 'medium'}
                             </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-yellow-50 rounded-full">
                            <Trophy size={12} className="sm:size-[14px] text-yellow-600" />
                            <span className="text-[9px] sm:text-[10px] font-black text-yellow-700 uppercase">{correctCount * 10} XP</span>
                        </div>
                    </div>

                    {/* Question - RESPONSIVE */}
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-snug tracking-tight break-words pt-2 sm:pt-4">
                        {questions[currentIdx]?.question}
                    </h2>
                    
                    {/* Options Grid - RESPONSIVE */}
                    <div className="grid gap-2 sm:gap-3 md:gap-4 mt-auto">
                        {questions[currentIdx]?.options?.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => setSelected(opt)}
                                className={`group relative w-full p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] text-left font-bold transition-all border-2 flex items-center gap-2 sm:gap-3 md:gap-4 min-h-[50px] sm:min-h-[56px] md:min-h-[60px] ${
                                    selected === opt 
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' 
                                    : 'border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/30'
                                }`}
                            >
                                <span className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${selected === opt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-500'}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-xs sm:text-sm md:text-base break-words flex-1">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button - RESPONSIVE & STICKY */}
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button 
                        disabled={!selected || isSaving}
                        onClick={handleNext}
                        className="w-full py-3 sm:py-4 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg md:shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3"
                    >
                        {currentIdx === questions.length - 1 ? (
                            <>Finish Assessment <Save size={14} className="sm:size-[16px] md:size-[18px]" /></>
                        ) : (
                            <>Next Challenge <ArrowRight size={14} className="sm:size-[16px] md:size-[18px]" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizTakePage;