// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Trash2, RotateCcw, FileText, ShieldCheck, User, Mail, Save, X, Briefcase, Calendar, Target } from "lucide-react";
// import axios from "axios";

// const ProfilePage = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
  
//   // 🔥 Humne editForm mein naye fields add kiye hain
//   const [editForm, setEditForm] = useState({ 
//     name: "", 
//     email: "",
//     age: "",
//     gender: "",
//     profession: "",
//     purpose: ""
//   });
//   const navigate = useNavigate();

//  const fetchProfile = async () => {
//   try {
//     const res = await axios.get('https://simplify-ai-mrrh.onrender.com/api/users/stats', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
    
//     if (res.data?.success) {
//       // ✅ Pura data set karo taaki data.user.age mil sake
//       setData(res.data.data); 
      
//       // ✅ Edit form ko bhi initialize karo taaki inputs khali na rahein
//       const u = res.data.data.user;
//       setEditForm({ 
//         name: u.name || "", 
//         email: u.email || "",
//         age: u.age || "",        
//         gender: u.gender || "Male",
//         profession: u.profession || "Student",
//         purpose: u.purpose || "Personal"
//       });
//     }
//   } catch (err) { 
//     console.error("Profile fetch error:", err);
//   } finally { 
//     setLoading(false); 
//   }
// };
//   useEffect(() => { fetchProfile(); }, []);

//   const handleUpdate = async () => {
//     try {
//       // ✅ Age validation yahan bhi laga di hai
//       if (editForm.age && (editForm.age <= 0 || editForm.age > 120)) {
//         alert("Sahi Age dalo bhai!");
//         return;
//       }

//       await axios.put('https://simplify-ai-mrrh.onrender.com/api/users/profile', editForm, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setIsEditing(false);
//       fetchProfile();
//       alert("Neural Identity Updated!");
//     } catch (err) { alert("Update failed!"); }
//   };

//   const handleRetake = (docId) => {
//     navigate('/dashboard', { state: { highlightDocId: docId } });
//   };

//   const handleViewQuizDetails = (quizId) => {
//     navigate(`/quiz/${quizId}`);
//   };

//   const handleDeleteQuiz = async (quizId) => {
//     if (window.confirm("Bhai, delete kar dein?")) {
//       try {
//         await axios.delete(`https://simplify-ai-mrrh.onrender.com/api/users/quizzes/${quizId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         alert("Quiz deleted successfully!");
//         fetchProfile();
//       } catch (err) {
//         console.error("Delete error:", err);
//         alert("Failed to delete quiz");
//       }
//     }
//   };

//   if (loading) return <div className="p-20 text-center font-black animate-pulse">SYNCING PROFILE...</div>;

//   return (
//     <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
//       {/* --- Editable Identity Card --- */}
//       <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
//         {/* Decorative background element */}
//         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

//         <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
//           <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-lg shadow-blue-900/20">
//             {editForm.name?.[0] || "U"}
//           </div>

//           <div className="flex-1 w-full">
//             {isEditing ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
//                     <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" />
//                 </div>
//                 <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email</label>
//                     <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" />
//                 </div>
//                 <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Age</label>
//                     <input type="number" value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" />
//                 </div>
//                 <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Profession</label>
//                     <select value={editForm.profession} onChange={(e) => setEditForm({...editForm, profession: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500">
//                         <option value="Student">Student</option>
//                         <option value="Employee">Employee</option>
//                         <option value="Freelancer">Freelancer</option>
//                     </select>
//                 </div>
//                 <div className="flex gap-2 mt-4 md:col-span-2">
//                   <button onClick={handleUpdate} className="bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Save size={16}/> Save Changes</button>
//                   <button onClick={() => setIsEditing(false)} className="bg-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><X size={16}/> Cancel</button>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div>
//                   <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
//                     {data.user.name} <ShieldCheck className="text-emerald-400" size={24}/>
//                   </h1>
//                   <p className="text-slate-400 font-bold flex items-center gap-2"><Mail size={14}/> {data.user.email}</p>
//                 </div>

//                 {/* --- New Quick Stats Info --- */}
//                 <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
//                     <div className="bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2">
//                         <Calendar size={14} className="text-blue-400"/>
//                         <span className="text-[11px] font-black uppercase tracking-tight">{data.user.age || "???"} Yrs</span>
//                     </div>
//                     <div className="bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2">
//                         <Briefcase size={14} className="text-amber-400"/>
//                         <span className="text-[11px] font-black uppercase tracking-tight">{data.user.profession || "Member"}</span>
//                     </div>
//                     <div className="bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2">
//                         <Target size={14} className="text-emerald-400"/>
//                         <span className="text-[11px] font-black uppercase tracking-tight">{data.user.purpose || "Personal"}</span>
//                     </div>
//                 </div>

//                 <button 
//                   onClick={() => setIsEditing(true)}
//                   className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 transition-all border-b border-blue-400/30 pb-1"
//                 >
//                   Edit Professional Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* --- Intelligence History (Tumhara Purana Code) --- */}
//       <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm">
//         <h2 className="text-2xl font-black text-slate-900 mb-10">Recent Activity</h2>
//         <div className="space-y-4">
//           {data.recentActivity?.length > 0 ? data.recentActivity.map((quiz) => (
//             <div 
//               key={quiz._id} 
//               onClick={() => handleViewQuizDetails(quiz._id)}
//               className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all gap-4 cursor-pointer group"
//             >
//               <div className="flex items-center gap-5">
//                 <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md group-hover:bg-blue-100 transition-all"><FileText size={24} className="text-blue-500" /></div>
//                 <div>
//                   <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-all">{quiz.documentId?.title || "AI Module"}</h4>
//                   <p className="text-[10px] text-slate-400 font-black uppercase">{new Date(quiz.createdAt).toLocaleDateString()}</p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between sm:justify-end gap-4">
//                 <div className="text-right mr-4">
//                    <p className="text-xl font-black text-slate-900">{quiz.score}/{quiz.totalQuestions}</p>
//                    <p className="text-[10px] font-black text-emerald-500 uppercase">{quiz.accuracy}% Accuracy</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleRetake(quiz.documentId?._id);
//                       }} 
//                       className="p-3 bg-white rounded-xl text-amber-500 border border-slate-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm" 
//                       title="Retake"
//                     >
//                         <RotateCcw size={18} />
//                     </button>
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteQuiz(quiz._id);
//                       }}
//                       className="p-3 bg-white rounded-xl text-rose-500 border border-slate-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
//                     >
//                         <Trash2 size={18} />
//                     </button>
//                 </div>
//               </div>
//             </div>
//           )) : (
//             <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No activity found yet</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;






// ye naya
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RotateCcw, FileText, ShieldCheck, Mail, Save, X, Briefcase, Calendar, Target } from "lucide-react";
import { getUserStats, updateUserProfile, deleteQuizResult } from "../../services/api";

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: "", email: "", age: "", gender: "Male", profession: "Student", purpose: "Personal"
  });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await getUserStats();
      if (res.data?.success) {
        const uData = res.data.data;
        setData(uData);
        setEditForm({
          name: uData.user?.name || "",
          email: uData.user?.email || "",
          age: uData.user?.age || "",
          gender: uData.user?.gender || "Male",
          profession: uData.user?.profession || "Student",
          purpose: uData.user?.purpose || "Personal"
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async () => {
    try {
      await updateUserProfile(editForm);
      setIsEditing(false);
      fetchProfile();
      alert("Neural Identity Updated!");
    } catch (err) { alert("Update failed!"); }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">SYNCING PROFILE...</div>;

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black">
            {editForm.name?.[0] || "U"}
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="bg-slate-800 p-3 rounded-xl outline-none" placeholder="Name" />
                <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="bg-slate-800 p-3 rounded-xl outline-none" placeholder="Email" />
                <input type="number" value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} className="bg-slate-800 p-3 rounded-xl outline-none" placeholder="Age" />
                <select value={editForm.profession} onChange={(e) => setEditForm({...editForm, profession: e.target.value})} className="bg-slate-800 p-3 rounded-xl text-white">
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                    <option value="Freelancer">Freelancer</option>
                </select>
                <div className="flex gap-2 mt-4 md:col-span-2">
                  <button onClick={handleUpdate} className="bg-emerald-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Save</button>
                  <button onClick={() => setIsEditing(false)} className="bg-slate-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                  {data?.user?.name || "User"} <ShieldCheck className="text-emerald-400" size={24}/>
                </h1>
                <p className="text-slate-400 font-bold flex items-center gap-2"><Mail size={14}/> {data?.user?.email}</p>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400"/><span className="text-[11px] font-black uppercase">{data?.user?.age || "??"} Yrs</span>
                    </div>
                    <div className="bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Briefcase size={14} className="text-amber-400"/><span className="text-[11px] font-black uppercase">{data?.user?.profession || "Member"}</span>
                    </div>
                </div>
                <button onClick={() => setIsEditing(true)} className="text-[10px] font-black uppercase text-blue-400 border-b border-blue-400/30">Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-10">Recent Activity</h2>
        <div className="space-y-4">
          {data?.recentActivity?.length > 0 ? data.recentActivity.map((quiz) => (
            <div 
              key={quiz._id} 
              className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border hover:border-blue-200 transition-all gap-4 cursor-pointer"
              onClick={() => navigate(`/quiz/${quiz._id}`)}
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl"><FileText size={24} className="text-blue-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-800">{quiz.documentId?.title || "AI Module"}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase">{new Date(quiz.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <p className="text-xl font-black text-slate-900">{quiz.score}/{quiz.totalQuestions}</p>
                 <button 
                   onClick={async (e) => {
                     e.stopPropagation(); // Prevent navigation when clicking delete
                     if (window.confirm("Delete this quiz result?")) {
                       try {
                         await deleteQuizResult(quiz._id);
                         alert("Quiz deleted successfully!");
                         fetchProfile(); // Reload profile data
                       } catch (err) {
                         console.error("Delete error:", err);
                         alert("Failed to delete quiz: " + (err.response?.data?.message || err.message));
                       }
                     }
                   }}
                   className="p-3 bg-white rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          )) : <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs">No activity yet</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;