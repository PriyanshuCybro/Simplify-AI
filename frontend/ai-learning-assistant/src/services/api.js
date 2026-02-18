import axios from 'axios';

// Backend Production URL
const API_BASE_URL = "https://simplify-ai-mrrh.onrender.com/api";

const API = axios.create({ 
    baseURL: API_BASE_URL,
    withCredentials: true 
});

// Request Interceptor to attach Token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ ALL EXPORTS (Fixes Vercel Rollup Error)

// Auth endpoints
export const loginAPI = (email, password) => API.post('/auth/login', { email, password });
export const registerAPI = (data) => API.post('/auth/register', data);
export const forgotPasswordAPI = (email) => API.post('/auth/forgot-password', { email });
export const resetPasswordAPI = (token, password) => API.put(`/auth/reset-password/${token}`, { password });
export const getProfileAPI = () => API.get('/auth/profile');
export const updateProfileAPI = (data) => API.put('/auth/profile', data);
export const changePasswordAPI = (data) => API.post('/auth/change-password', data);

// Document endpoints
export const uploadDocument = (formData) => {
    return API.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// AI & Quiz Handlers
export const askAI = (id, q) => API.post(`/documents/${id}/chat`, { question: q });
export const generateFlashcardsAPI = (id) => API.post(`/documents/${id}/flashcards`);
export const generateQuiz = (id) => API.post(`/documents/${id}/quiz`);

export default API;