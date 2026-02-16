import axios from 'axios';

const API = axios.create({ 
    baseURL: "https://simplify-ai-mrrh.onrender.com/api",
    withCredentials: true 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Document Routes ---

// ✅ Sabhi functions ke aage 'export const' hona zaroori hai
export const uploadDocument = async (formData) => {
    try {
        const response = await API.post('/documents/upload', formData);
        return response;
    } catch (error) {
        console.error("Frontend API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ❌ Ye do functions missing the, isliye Vercel phat raha tha
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// --- AI & Flashcards ---
export const askAI = (documentId, question) => API.post(`/documents/${documentId}/chat`, { question });
export const generateFlashcardsAPI = (id) => API.post(`/documents/${id}/flashcards`);

export default API;