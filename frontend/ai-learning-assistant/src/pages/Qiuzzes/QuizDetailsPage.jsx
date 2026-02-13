import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, RefreshCw, CheckCircle2, XCircle, Clock, Target, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";


const QuizDetailsPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await axios.get(
                    `https://simplify-ai-mrrh.onrender.com/api/documents/quiz/${quizId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setQuiz(response.data.data);
            } catch (err) {
                console.error('Error fetching quiz details:', err);
                setError('Failed to load quiz details');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetails();
    }, [quizId]);

    const handleRetake = () => {
        navigate(`/documents/${quiz.documentId._id}`, { 
            state: { retakeQuiz: true, quizCount: quiz.questions.length } 
        });
    };

    const handleDownload = () => {
        // Create a text file with quiz results
        let content = `Quiz Results\n`;
        content += `Date: ${new Date(quiz.createdAt).toLocaleDateString()}\n`;
        content += `Score: ${quiz.score}/${quiz.totalQuestions}\n`;
        // 🔥 FIX 1: Rounded accuracy in download file
        content += `Accuracy: ${Math.round(quiz.accuracy)}%\n`;
        content += `XP Earned: ${quiz.xpEarned}\n\n`;
        content += `===== DETAILED BREAKDOWN =====\n\n`;

        quiz.questions.forEach((q, idx) => {
            const userAnswer = quiz.userAnswers.find(ua => ua.questionIndex === idx);
            content += `Q${idx + 1}: ${q.question}\n`;
            content += `Your Answer: ${userAnswer?.selectedAnswer || 'Not answered'}\n`;
            content += `Correct Answer: ${q.correctAnswer}\n`;
            content += `Result: ${userAnswer?.isCorrect ? '✓ CORRECT' : '✗ WRONG'}\n`;
            if (q.explanation) {
                content += `Explanation: ${q.explanation}\n`;
            }
            content += `\n`;
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `quiz-results-${quizId}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={50} />
                <p className="font-black text-gray-400 uppercase tracking-widest animate-pulse text-sm">Loading quiz details...</p>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-red-50 max-w-sm">
                    <XCircle size={60} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-500 text-sm mb-6">{error || 'Failed to load quiz'}</p>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getQuestionStatus = (questionIdx) => {
        const userAnswer = quiz.userAnswers.find(ua => ua.questionIndex === questionIdx);
        return userAnswer?.isCorrect;
    };

    const correctCount = quiz.userAnswers.filter(ua => ua.isCorrect).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-semibold">Back to Profile</span>
                    </button>
                    <div className="flex gap-3">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full font-semibold hover:bg-emerald-100 transition-all"
                        >
                            <Download size={20} />
                            <span className="hidden sm:inline">Download</span>
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRetake}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
                        >
                            <RefreshCw size={20} />
                            <span className="hidden sm:inline">Retake Quiz</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Score Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-12 mb-12 relative overflow-hidden"
                >
                    {/* Gradient Accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Score */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <Target size={32} className="text-white" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">Score</p>
                            <p className="text-4xl font-black text-blue-600">{quiz.score}/{quiz.totalQuestions}</p>
                        </motion.div>

                        {/* Accuracy */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-emerald-600 rounded-full">
                                    <CheckCircle2 size={32} className="text-white" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">Accuracy</p>
                            {/* 🔥 FIX 2: Rounded accuracy for display UI */}
                            <p className="text-4xl font-black text-emerald-600">{Math.round(quiz.accuracy)}%</p>
                        </motion.div>

                        {/* Correct Answers */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-green-600 rounded-full">
                                    <Award size={32} className="text-white" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">Correct</p>
                            <p className="text-4xl font-black text-green-600">{correctCount}</p>
                        </motion.div>

                        {/* XP Earned */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-purple-600 rounded-full">
                                    <Award size={32} className="text-white" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">XP Earned</p>
                            <p className="text-4xl font-black text-purple-600">{quiz.xpEarned}</p>
                        </motion.div>
                    </div>

                    {/* Info Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-sm pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-blue-600" />
                            <span>
                                <strong>Date:</strong> {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        {quiz.timeSpent && (
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-emerald-600" />
                                <span>
                                    <strong>Time:</strong> {Math.floor(quiz.timeSpent / 60)}m {quiz.timeSpent % 60}s
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Questions Breakdown */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">Question Breakdown</h2>
                    
                    {quiz.questions.map((question, idx) => {
                        const userAnswer = quiz.userAnswers.find(ua => ua.questionIndex === idx);
                        const isCorrect = userAnswer?.isCorrect;
                        
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className={`rounded-2xl p-8 border-2 transition-all ${
                                    isCorrect 
                                        ? 'bg-green-50 border-green-200 shadow-lg' 
                                        : 'bg-red-50 border-red-200 shadow-lg'
                                }`}
                            >
                                {/* Header with icon */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {isCorrect ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${
                                            isCorrect ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            Question {idx + 1} {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">{question.question}</p>
                                    </div>
                                </div>

                                {/* Options Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                    {question.options.map((option, optIdx) => {
                                        const isUserSelected = userAnswer?.selectedAnswer === option;
                                        const isCorrectOption = option === question.correctAnswer;
                                        
                                        let bgColor = 'bg-white border-gray-200';
                                        let textColor = 'text-gray-700';
                                        
                                        if (isCorrectOption) {
                                            bgColor = 'bg-green-100 border-green-400';
                                            textColor = 'text-green-900';
                                        } else if (isUserSelected && !isCorrect) {
                                            bgColor = 'bg-red-100 border-red-400';
                                            textColor = 'text-red-900';
                                        }
                                        
                                        return (
                                            <div
                                                key={optIdx}
                                                className={`p-4 border-2 rounded-xl ${bgColor} ${textColor} font-medium transition-all`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-lg">
                                                        {String.fromCharCode(65 + optIdx)}.
                                                    </span>
                                                    <span>{option}</span>
                                                    {isCorrectOption && <CheckCircle2 size={20} className="text-green-600 ml-auto" />}
                                                    {isUserSelected && !isCorrect && <XCircle size={20} className="text-red-600 ml-auto" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* User's Answer Display */}
                                {!isCorrect && (
                                    <div className="mb-6 p-4 bg-white border-2 border-red-200 rounded-xl">
                                        <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">Your Answer</p>
                                        <p className="text-gray-900 font-semibold">{userAnswer?.selectedAnswer || 'Not answered'}</p>
                                    </div>
                                )}

                                {/* Explanation */}
                                {question.explanation && (
                                    <div className="p-4 bg-blue-100 border-l-4 border-blue-600 rounded-lg">
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Explanation</p>
                                        <p className="text-gray-800 text-sm">{question.explanation}</p>
                                    </div>
                                )}

                                {/* Difficulty Indicator */}
                                {question.difficulty && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Difficulty:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            question.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                                            question.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {question.difficulty}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 text-center p-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white"
                >
                    <h3 className="text-2xl font-black mb-4">Great Job! Keep Learning</h3>
                    <p className="text-blue-100">Review your answers above to improve your understanding</p>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizDetailsPage;