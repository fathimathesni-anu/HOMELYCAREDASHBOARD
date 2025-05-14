// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL, // Dynamically fetch from environment variables
  withCredentials: true,  // for sending cookies in cross-origin requests
  
});

console.log('API Base URL:', import.meta.env.VITE_API_URL);
console.log('Making request to:', axiosInstance.defaults.baseURL + '/user/login');


export default axiosInstance;











