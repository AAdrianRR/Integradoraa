import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/monitor.css";

interface Registro {
  temperatura: number;
  nivelAgua: number;      // en centímetros reales medidos por el sensor
  tempAgua: number;
  fecha: string;
}

export const MonitorPiscina = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const claseId = "666f1a7a4a4f09e1d4f9abcd";
    const endpoint = rol === "profesor" ? "profesor" : "admin";

    const fetchDatos = () => {
      axios
        .get(`http://localhost:3000/iot/${claseId}/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setRegistros(res.data.slice(0, 5));
        })
        .catch((err) => {
          console.error("❌ Error al obtener datos IoT:", err);
        });
    };

    fetchDatos();
    const intervalo = setInterval(fetchDatos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  if (registros.length === 0)
    return <div className="monitor-container">Cargando datos IoT...</div>;

  const actual = registros[0];
  const nivelInvertido = Math.max(0, Math.min(100, ((actual.nivelAgua - 1) / 9) * 100));

  // 🔍 Búsqueda por fecha no abreviada
  const registrosFiltrados = registros.filter((r) => {
    const fechaCompleta = new Date(r.fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).toLowerCase();
    return fechaCompleta.includes(busqueda.toLowerCase());
  });

  return (
    <div className="monitor-container">
      <h2>Monitoreo de la Piscina</h2>

      <div className="tarjetas">
        {/* 🌡️ Temperatura del agua */}
        <div className="tarjeta">
          <h3>🌡️ Temperatura del agua</h3>
          <div className="termometro">
            <div className="circle">
              <span>{actual.tempAgua.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* 🌊 Nivel del agua visual invertido */}
        <div className="tarjeta">
          <h3>🌊 Nivel del agua</h3>
          <div className="barra-nivel">
            <div
              className="relleno"
              style={{ width: `${nivelInvertido.toFixed(0)}%` }}
            ></div>
          </div>
          <span>{nivelInvertido.toFixed(1)}% lleno</span>
        </div>

        {/* 🌤️ Clima interior */}
        <div className="tarjeta">
          <h3>🌤️ Clima interior</h3>
          <p><strong>{actual.temperatura.toFixed(1)}°C</strong></p>
          <p>Lectura interna por sensor DHT11</p>
        </div>
      </div>

      {/* 🔍 Búsqueda por fecha */}
      <div className="buscador-historial">
        <input
          type="text"
          placeholder="Buscar por fecha (ej. 12 de julio)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 📊 Historial de lecturas */}
      <div className="tabla-historial">
        <h3>Historial de lecturas</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Agua (°C)</th>
              <th>lleno (%)</th>
              <th>Clima (°C)</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((r, i) => {
              const vacio = Math.max(0, Math.min(100, ((r.nivelAgua - 1) / 9) * 100));
              const fechaTexto = `${new Date(r.fecha).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })} a las ${new Date(r.fecha).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit"
              })}`;

              return (
                <tr key={i}>
                  <td>{fechaTexto}</td>
                  <td>{r.tempAgua.toFixed(1)}</td>
                  <td>{vacio.toFixed(1)}</td>
                  <td>{r.temperatura.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
