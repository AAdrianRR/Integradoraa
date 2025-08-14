import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Obtener token desde localStorage
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`
};


export interface ProfesorDatos {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  contraseña: string;
}

export const registrarProfesor = async (datos: ProfesorDatos) => {
  return await axios.post(`${API_BASE}/profesor/registrar`, datos, { headers });
};



// Eliminar un profesor por ID
export const eliminarProfesor = async (id: string) => {
  return await axios.delete(`${API_BASE}/profesor/${id}`, { headers });
};

//  Actualizar datos de un profesor por ID
export const actualizarProfesor = async (id: string, datos: ProfesorDatos) => {
  return await axios.put(`${API_BASE}/profesor/${id}`, datos, { headers });
};

export const obtenerProfesores = async () => {
  return await axios.get(`${API_BASE}/profesor`, { headers });
};
