import React from "react";
import { Navigate } from "react-router-dom";

type Rol = "admin" | "alumno" | "profesor";

interface Props {
  children: React.ReactNode;
  rolPermitido: Rol | Rol[]; 
}

export const RutaPrivada = ({ children, rolPermitido }: Props) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol") as Rol;

  const tieneAcceso = Array.isArray(rolPermitido)
    ? rolPermitido.includes(rol)
    : rol === rolPermitido;

  if (!token) return <Navigate to="/" replace />;
  if (!tieneAcceso) return <Navigate to="/no-autorizado" replace />;

  return <>{children}</>;
};






































































 