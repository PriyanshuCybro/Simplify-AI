import axios from 'axios';

//const API = axios.create({ baseURL: 'http://localhost:5000/api' });
const API = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL + '/api' 
});


// Add token to headers if user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const uploadDocument = (formData) => API.post('/documents/upload', formData);
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const askAI = (documentId, question) => API.post(`/documents/${documentId}/chat`, { question });
// बाकी के कोड के साथ इसे भी जोड़ें
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// AI Flashcards mangwane ke liye function
export const generateFlashcardsAPI = async (id) => {
    const token = localStorage.getItem('token'); 
    const response = await axios.post(`http://localhost:5000/api/documents/${id}/flashcards`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Backend se jo flashcards aayenge wo return honge
};

// Example in frontend/services/api.js
export const updateProfile = (data) => API.put('/users/profile', data);
export const deleteQuiz = (id) => API.delete(`/users/quiz/${id}`);