// src/services/authService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface LoginData {
  email: string;
  password: string;
}

// Login 
interface LoginResponse {
  token: string;
  role: string;
  [key: string]: unknown; 
}

export const login = async ({ email, password }: LoginData) => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
    email,
    password,
  });

  const { token, role } = response.data;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  return response.data;
};


export const loginDetectandoTipo = async (email: string, password: string) => {
  const endpoints = [
    { tipo: "admin", url: `${API_URL}/admin/login` },
    { tipo: "profesor", url: `${API_URL}/profesor/login` },
    { tipo: "alumno", url: `${API_URL}/alumno/login` },
  ];

  for (const { tipo, url } of endpoints) {
    try {
      const res = await axios.post(url, { correo: email, contraseña: password });
      return { tipo, datos: res.data };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number" &&
        (error as { response?: { status?: number } }).response?.status !== 404 &&
        (error as { response?: { status?: number } }).response?.status !== 401
      ) {
        throw error;
      }
    }
  }

  throw new Error("Credenciales inválidas para todos los tipos.");
};
