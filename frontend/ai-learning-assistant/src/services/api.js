import axios from 'axios';

// Render Backend URL
const API_BASE_URL = "https://simplify-ai-mrrh.onrender.com/api";

const API = axios.create({ 
    baseURL: API_BASE_URL,
    withCredentials: true // 👈 CORS ke liye ye zaroori hai
});

// Add token to headers for every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Document Routes ---
// ✅ FIX: FormData bhejte waqt header manually specify karna safe rehta hai
export const uploadDocument = async (formData) => {
    return await API.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// --- AI & Flashcards Routes ---
export const askAI = (documentId, question) => API.post(`/documents/${documentId}/chat`, { question });

export const generateFlashcardsAPI = async (id) => {
    try {
        const response = await API.post(`/documents/${id}/flashcards`, { force_refresh: true });
        return response.data;
    } catch (error) {
        console.error("Flashcard Generation Error:", error);
        throw error;
    }
};

// --- Profile & Quiz Routes ---
export const updateProfile = (data) => API.put('/users/profile', data);
export const deleteQuiz = (id) => API.delete(`/users/quiz/${id}`);

export default API;