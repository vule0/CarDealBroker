import axios from 'axios';

const api = axios.create({
  baseURL: "ocgdydfc.up.railway.app",
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api; 