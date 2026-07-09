import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const api = axios.create({ baseURL });

// Anexa o token JWT (se existir) em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("armario:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o backend responder 401, o token expirou/é inválido: desloga o usuário
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("armario:token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
