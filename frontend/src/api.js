import axios from 'axios';

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: "https://3yrktgfq.up.railway.app"
});

// Export the Axios instance
export default api;