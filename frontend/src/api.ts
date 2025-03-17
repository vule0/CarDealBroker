import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.cardealbroker.com",
  withCredentials: false,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api; 