import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogout } from "../hooks/useLogout";
import "../styles/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faChalkboardTeacher,
  faBookOpen,
  faSwimmer,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const [activo, setActivo] = useState<string | null>(null);
  const cerrarSesion = useLogout();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const alternarSubmenu = (nombre: string) => {
    setActivo(prev => (prev === nombre ? null : nombre));
  };

  useEffect(() => {
    const cerrarSiClicFuera = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) {
        setActivo(null);
      }
    };
    document.addEventListener("mousedown", cerrarSiClicFuera);
    return () => document.removeEventListener("mousedown", cerrarSiClicFuera);
  }, []);

  if (!token) return null;

  const confirmarCerrarSesion = async () => {
    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Cerrar sesión?",
      text: "¿Deseas salir del sistema?",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      backdrop: true
    });

    if (resultado.isConfirmed) {
      window.onbeforeunload = null; // ✅ aseguramos que no haya alerta nativa

      await Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has salido correctamente.",
        confirmButtonColor: "#2d89ef"
      });

      cerrarSesion(); // ✅ ya no provoca alerta del navegador
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Centro De Desarrollo Oriente</div>

      <div className="navbar-wrapper">
        <div className="navbar-content">
          <div className="navbar-menu">
            <ul className="navbar-links">
              {rol === "admin" && (
                <li>
                  <Link to="/admin/panel">
                    <FontAwesomeIcon icon={faHome} /> Inicio
                  </Link>
                </li>
              )}

              {rol === "admin" && (
                <>
                  <li>
                    <Link to="/alumnos">
                      <FontAwesomeIcon icon={faUsers} /> Lista de Alumnos
                    </Link>
                  </li>

                  <li>
                    <Link to="/clases-natacion">
                      <FontAwesomeIcon icon={faBookOpen} /> Ver Clases
                    </Link>
                  </li>

                  <li>
                    <Link to="/profesores">
                      <FontAwesomeIcon icon={faChalkboardTeacher} /> Lista de Profesores
                    </Link>
                  </li>

                  <li>
                    <Link to="/monitor">
                      <FontAwesomeIcon icon={faSwimmer} /> Piscina
                    </Link>
                  </li>
                </>
              )}

              {rol === "profesor" && (
                <>
                  <li>
                    <Link to="/monitor">
                      <FontAwesomeIcon icon={faSwimmer} /> Piscina
                    </Link>
                  </li>
                  <li>
                    <Link to="/mis-clases">
                      <FontAwesomeIcon icon={faBookOpen} /> Mis Clases
                    </Link>
                  </li>
                </>
              )}

              {rol === "alumno" && (
                <li>
                  <Link to="/clase-alumno">
                    <FontAwesomeIcon icon={faBookOpen} /> Mi Clase
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="navbar-sesion">
            <button className="cerrar-btn ajustar-btn" onClick={confirmarCerrarSesion}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Salir&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
