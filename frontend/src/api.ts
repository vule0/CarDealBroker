import axios from 'axios';

const api = axios.create({
  baseURL: "https://cardealbroker.com",
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api; 