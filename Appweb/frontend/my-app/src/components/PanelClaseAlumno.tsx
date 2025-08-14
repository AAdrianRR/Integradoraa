import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/panel-alumno.css";

interface ClasePanel {
  nombre: string;
  clase: string;
  horario: string;
  profesor: string;
  siguienteSesion: string;
  mensaje?: string;
}

export const PanelClaseAlumno = () => {
  const [data, setData] = useState<ClasePanel | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:3000/alumno/panel", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setData(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener clase del alumno:", err);
        setError(true);
      });
  }, []);

  return (
    <div className="panel-alumno">
      <h2>📘 Mi Clase Asignada</h2>

      {error ? (
        <p className="error">No se pudo cargar la clase. 🚫</p>
      ) : !data ? (
        <p>No estás asignado a ninguna clase.</p>
      ) : (
        <div className="card-alumno listado">
          <h3 className="clase-titulo">🏊 {data.clase}</h3>

          <ul className="lista-detalle">
            <li><strong>Alumno:</strong> {data.nombre}</li>
            <li><strong>Profesor:</strong> {data.profesor}</li>
            <li><strong>Horario:</strong> {data.horario}</li>
            <li><strong>Próxima sesión:</strong> {data.siguienteSesion}</li>
            {data.mensaje && (
              <li className="banner-mensaje">📢 {data.mensaje}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
