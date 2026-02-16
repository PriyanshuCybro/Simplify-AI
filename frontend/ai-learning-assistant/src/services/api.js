import axios from 'axios';

const API = axios.create({ 
    baseURL: "https://simplify-ai-mrrh.onrender.com/api",
    withCredentials: true 
});

// Request Interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ ALL EXPORTS ADDED (Fixes Vercel Build Error)
export const uploadDocument = (formData) => API.post('/documents/upload', formData);
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// AI & Quiz Handlers
export const askAI = (id, q) => API.post(`/documents/${id}/chat`, { question: q });
export const generateFlashcardsAPI = (id) => API.post(`/documents/${id}/flashcards`);
export const generateQuiz = (id) => API.post(`/documents/${id}/quiz`);

export default API;