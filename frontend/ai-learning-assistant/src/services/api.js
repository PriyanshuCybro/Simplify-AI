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

export const uploadDocument = async (formData) => {
    // Axios khud boundary set karta hai jab hum headers manual nahi dete
    try {
        const response = await API.post('/documents/upload', formData);
        return response;
    } catch (error) {
        console.error("Frontend API Error:", error.response?.data || error.message);
        throw error;
    }
};

export default API;