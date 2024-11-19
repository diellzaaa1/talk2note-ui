import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:5207/api',
  headers: {
    'Content-Type': 'application/json',
  },
});



export default httpClient;
