import axios from "axios";
import type { Clase } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

export const crearClase = async (datos: Omit<Clase, "_id" | "maestro" | "alumnos"> & {
  maestro: string;
  alumnos: string[];
}) => {
  return await axios.post(`${API_BASE}/clase`, datos, { headers });
};

export const obtenerClases = async (): Promise<{ data: Clase[] }> => {
  return await axios.get(`${API_BASE}/clase`, { headers });
};

export const actualizarClase = async (id: string, datos: Partial<Clase>) => {
  return await axios.put(`${API_BASE}/clase/${id}`, datos, { headers });
};

export const eliminarClase = async (id: string) => {
  return await axios.delete(`${API_BASE}/clase/${id}`, { headers });
};

export const obtenerClasePorId = async (id: string): Promise<{ data: Clase }> => {
  return await axios.get(`${API_BASE}/clase/${id}`, { headers });
};
