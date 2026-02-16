import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowRight, Loader2, AlertCircle, Save } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

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
                    const res = await axios.get(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/quiz/${quizId}`, {
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
            const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/quiz/${quizMeta?._id}/save`, {
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
        <div className="h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-black text-slate-800 mb-2">Sync Interrupted</h2>
            <p className="text-slate-500 max-w-sm mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold">Try Again</button>
        </div>
    );

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={50}/>
            <p className="font-black text-gray-400 uppercase tracking-widest text-sm animate-pulse">Neural Syncing {quizCount} Nodes...</p>
        </div>
    );

    if (isSaving) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white p-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-blue-600 uppercase tracking-widest text-xs tracking-[0.2em]">Writing to Database...</p>
        </div>
    );

    const progress = ((currentIdx + 1) / (questions.length || 1)) * 100;

    return (
        <div className="max-w-2xl mx-auto mt-4 md:mt-10 p-4 md:p-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between mb-4 px-2 gap-2">
                <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block truncate">
                        Live Accuracy: {currentIdx === 0 ? "100" : Math.round((score / currentIdx) * 100)}%
                    </span>
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] shrink-0">Progress Node</span>
            </div>
            
            <div className="w-full h-2 md:h-3 bg-gray-100 rounded-full mb-10 overflow-hidden shadow-inner border border-gray-50">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                
                <div className="flex justify-between items-center mb-8">
                    <div className="px-4 py-1.5 bg-blue-50 rounded-full flex gap-2 items-center">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Q {currentIdx + 1} / {questions.length}</span>
                         <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase ${questions[currentIdx]?.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {questions[currentIdx]?.difficulty || 'medium'}
                         </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-50 rounded-full">
                        <Trophy size={14} className="text-yellow-600" />
                        <span className="text-[10px] font-black text-yellow-700 uppercase">{score * 10} XP</span>
                    </div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-10 leading-tight tracking-tight break-words">
                    {questions[currentIdx]?.question}
                </h2>
                
                <div className="grid gap-4">
                    {questions[currentIdx]?.options?.map((opt, i) => (
                        <button 
                            key={i}
                            onClick={() => setSelected(opt)}
                            className={`group relative w-full p-5 rounded-[1.8rem] text-left font-bold transition-all border-2 flex items-center justify-between min-h-[60px] ${
                                selected === opt 
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.01]' 
                                : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-blue-200'
                            }`}
                        >
                            <span className="flex items-center gap-4 flex-1">
                                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${selected === opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-sm md:text-base break-words">{opt}</span>
                            </span>
                        </button>
                    ))}
                </div>

                <button 
                    disabled={!selected || isSaving}
                    onClick={handleNext}
                    className="w-full mt-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs disabled:opacity-20 shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {currentIdx === questions.length - 1 ? (
                        <>Finish Assessment <Save size={18} /></>
                    ) : (
                        <>Next Challenge <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default QuizTakePage;