import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Trophy, RefreshCcw, Home, Share2, CheckCircle2 } from 'lucide-react';

const QuizResultPage = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Agar direct koi is page par aaye toh redirect kar do
    if (!state) return <div className="h-screen flex items-center justify-center">No Result Found</div>;

    const { score, total } = state;
    const percentage = (score / total) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10 text-center relative overflow-hidden">
                
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Trophy className="text-yellow-600" size={48} />
                    </div>

                    <h1 className="text-3xl font-black text-gray-800 mb-2">Quiz Finished!</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-8">Your Performance Summary</p>

                    {/* Score Circle */}
                    <div className="relative w-40 h-40 mx-auto mb-10">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                strokeDasharray={440} 
                                strokeDashoffset={440 - (440 * percentage) / 100} 
                                strokeLinecap="round"
                                className="text-blue-600 transition-all duration-1000" 
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-gray-800">{score}/{total}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Correct</span>
                        </div>
                    </div>

                    {/* Stats Table */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-green-50 p-4 rounded-3xl border border-green-100">
                            <p className="text-green-600 font-black text-xl">{percentage}%</p>
                            <p className="text-[9px] font-bold text-green-400 uppercase">Accuracy</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                            <p className="text-blue-600 font-black text-xl">{score * 10}</p>
                            <p className="text-[9px] font-bold text-blue-400 uppercase">XP Earned</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate(`/documents/${id}/quiz/take`)}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={18} /> Retake Quiz
                        </button>
                        
                        <button 
                            onClick={() => navigate(`/documents/${id}`)}
                            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> Back to Study
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResultPage;