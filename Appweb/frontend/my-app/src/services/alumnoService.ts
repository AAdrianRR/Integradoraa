import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ENDPOINT = `${API_BASE}/alumno`;

// 🔐 Token dinámico desde sessionStorage o localStorage
const getAuthHeaders = () => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
};

// 📦 Interfaz tipada para Alumno
export interface AlumnoDatos {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  contraseña: string;
}

// 📥 Obtener todos los alumnos
export const obtenerAlumnos = () => {
  return axios.get(ENDPOINT, { headers: getAuthHeaders() });
};

// 🔍 Obtener alumno por ID
export const obtenerAlumnoPorId = (id: string) => {
  return axios.get(`${ENDPOINT}/${id}`, { headers: getAuthHeaders() });
};

// ✏️ Actualizar alumno
export const actualizarAlumno = (id: string, datos: AlumnoDatos) => {
  return axios.put(`${ENDPOINT}/${id}`, datos, { headers: getAuthHeaders() });
};

// 🗑️ Eliminar alumno
export const eliminarAlumno = (id: string) => {
  return axios.delete(`${ENDPOINT}/${id}`, { headers: getAuthHeaders() });
};


