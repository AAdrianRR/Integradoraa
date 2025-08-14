import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faUserTie,
  faUsers,
  faBookOpen,
  faCalendarDay
} from "@fortawesome/free-solid-svg-icons";
import "../styles/panel-profesor.css";

interface Alumno {
  nombre: string;
  apellido: string;
}

interface Maestro {
  nombre: string;
  apellido: string;
}

interface Clase {
  _id: string;
  codigoClase: string;
  nombre: string;
  maestro: Maestro;
  alumnos: Alumno[];
  dias: string[];
  hora: string;
  fechaInicio: string;
  fechaFin: string;
}

const obtenerRutaClases = (): string | null => {
  const rol = localStorage.getItem("rol");
  switch (rol) {
    case "profesor":
      return "http://localhost:3000/profesor/mis-clases";
    case "admin":
      return "http://localhost:3000/clase";
    default:
      return null;
  }
};

export const PanelClasesProfesor = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const endpoint = obtenerRutaClases();

    if (!token || !endpoint) {
      setError(true);
      return;
    }

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setClases(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener clases:", err);
        setError(true);
      });
  }, []);

  return (
    <div className="panel-profesor">
      <h2>Mis Clases Asignadas</h2>

      {error ? (
        <p className="error-clases">No se pudieron cargar las clases. 🚫</p>
      ) : clases.length === 0 ? (
        <p className="vacio-clases">No tienes clases asignadas.</p>
      ) : (
        <ul className="clases-lista">
          {clases.map((clase) => (
            <li className="clase-card" key={clase._id}>
              <header className="clase-header">
                <FontAwesomeIcon icon={faBookOpen} className="clase-icono" />
                <div>
                  <h3>{clase.nombre}</h3>
                  <span className="clase-codigo">Código: {clase.codigoClase}</span>
                </div>
              </header>

              <div className="clase-detalles">
                <p><FontAwesomeIcon icon={faCalendarDay} /> <strong>Días:</strong> {clase.dias.join(", ")}</p>
                <p><FontAwesomeIcon icon={faClock} /> <strong>Hora:</strong> {clase.hora}</p>
                <p><FontAwesomeIcon icon={faCalendarAlt} /> <strong>Inicio:</strong> {new Date(clase.fechaInicio).toLocaleDateString()}</p>
                <p><FontAwesomeIcon icon={faCalendarAlt} /> <strong>Fin:</strong> {new Date(clase.fechaFin).toLocaleDateString()}</p>
                <p><FontAwesomeIcon icon={faUserTie} /> <strong>Profesor:</strong> {clase.maestro?.nombre} {clase.maestro?.apellido}</p>

                <p><FontAwesomeIcon icon={faUsers} /> <strong>Alumnos ({clase.alumnos.length}):</strong></p>
                <table className="tabla-alumnos">
                  <tbody>
                    {clase.alumnos.map((alumno, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}.</td>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.apellido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
