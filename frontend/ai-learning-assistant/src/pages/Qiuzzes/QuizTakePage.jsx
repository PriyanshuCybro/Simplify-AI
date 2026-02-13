import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowRight, Loader2, AlertCircle, Save } from 'lucide-react';

const QuizTakePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 🔥 Ensuring quizCount is a clean number before anything else
    const quizCount = parseInt(location.state?.quizCount) || 10;

    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 🔥 THE 400 ERROR FIX: Sending explicitly formatted body
                const res = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/quiz`, 
                    { 
                        count: quizCount, // Number format
                        force_refresh: true 
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 90000 // Increased timeout for AI generation
                    }
                );

                if (res.data.success && res.data.data) {
                    setQuestions(res.data.data);
                } else {
                    throw new Error("Failed to receive questions from AI.");
                }
            } catch (err) {
                console.error("❌ Frontend Request Error:", err.response?.data || err.message);
                
                // Handling specific 400 error message from backend
                const errorMsg = err.response?.data?.message || "AI failed to understand the request (400).";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchQuiz();
    }, [id, quizCount]);

    const saveResultToDB = async (finalScore, finalAnswers) => {
        setIsSaving(true);
        try {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            // Whole number accuracy protection
            const accuracyVal = questions.length > 0 
                ? Math.round((finalScore / questions.length) * 100) 
                : 0;
            
            const response = await axios.post(`https://simplify-ai-mrrh.onrender.com/api/documents/${id}/quiz/save`, {
                score: finalScore,
                totalQuestions: questions.length,
                title: `Quiz Session - ${new Date().toLocaleDateString()}`,
                accuracy: accuracyVal,
                xpEarned: finalScore * 10,
                timeSpent: timeSpent,
                questions: questions,
                userAnswers: finalAnswers 
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Navigate to result with clean whole number data
            navigate(`/quiz/${response.data.data._id}`, { 
                state: { 
                    score: finalScore, 
                    total: questions.length, 
                    accuracy: accuracyVal 
                } 
            });
        } catch (err) {
            console.error("❌ Save error:", err);
            alert("Failed to save result. Check console for details.");
            navigate('/dashboard');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = () => {
        if (!selected) return;

        const isCorrect = selected === questions[currentIdx].correctAnswer;
        const newScore = isCorrect ? score + 1 : score;
        
        const updatedAnswers = [...userAnswers, {
            questionIndex: currentIdx,
            selectedAnswer: selected, 
            isCorrect: isCorrect
        }];

        if (isCorrect) setScore(newScore);
        setUserAnswers(updatedAnswers);

        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(currentIdx + 1);
            setSelected(null);
        } else {
            saveResultToDB(newScore, updatedAnswers);
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