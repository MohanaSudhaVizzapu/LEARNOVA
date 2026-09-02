import axios from "axios";

const API = axios.create({
  baseURL: "https://learnova-backend-qdzi.onrender.com/api",
  withCredentials: true
});

export default API;