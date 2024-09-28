import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const apiCaller = axios.create({
  baseURL: apiUrl,
  timeout: 120000 // Request will timeout after 120,000 milliseconds (2 minutes) if no response is received
  // withCredentials: true // Allows sending cookies and other credentials with cross-site requests for authentication
});
