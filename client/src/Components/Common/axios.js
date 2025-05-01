import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7295/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');  // Use Cookies instead of localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;
