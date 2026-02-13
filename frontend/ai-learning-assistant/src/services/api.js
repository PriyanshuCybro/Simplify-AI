import axios from 'axios';

// 🔥 Sabse pehle Base URL decide karo
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const API = axios.create({ 
    baseURL: `https://simplify-ai-mrrh.onrender.com/api` 
});

// Add token to headers if user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Document Routes ---
export const uploadDocument = (formData) => API.post('/documents/upload', formData);
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// --- AI & Flashcards Routes ---
export const askAI = (documentId, question) => API.post(`/documents/${documentId}/chat`, { question });

// ✅ FIXED: Yahan localhost hata kar API (Axios instance) use kiya hai
export const generateFlashcardsAPI = async (id) => {
    const response = await API.post(`/documents/${id}/flashcards`, { force_refresh: true });
    return response.data; // Backend se jo flashcards aayenge wo return honge
};

// --- Profile & Quiz Routes ---
export const updateProfile = (data) => API.put('/users/profile', data);
export const deleteQuiz = (id) => API.delete(`/users/quiz/${id}`);

export default API;