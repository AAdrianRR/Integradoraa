import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerClases,
  eliminarClase
} from "../services/claseService";
import { ModalEditarClase } from "./ModalEditarClase";
import { ModalAsignarAlumnos } from "./ModalAsignarAlumnos";
import "../styles/tabla.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import type { Clase } from "../types";

export const TablaClasesNatacion = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [claseEditando, setClaseEditando] = useState<Clase | null>(null);

  const [modalAsignarVisible, setModalAsignarVisible] = useState(false);
  const [claseAsignandoId, setClaseAsignandoId] = useState<string | null>(null);

  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [claseDetalle, setClaseDetalle] = useState<Clase | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    try {
      const res = await obtenerClases();
      setClases(res.data);
    } catch (err) {
      console.error("❌ Error al obtener clases:", err);
      setError("No se pudieron cargar las clases.");
    }
  };

  const eliminar = async (id: string) => {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar clase?",
      text: "Esta acción no se puede deshacer. ¿Estás seguro?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarClase(id);
      toast.success("🗑️ Clase eliminada correctamente", {
        position: "bottom-right",
        autoClose: 2500
      });
      await cargarClases();
    } catch (err) {
      console.error("❌ Error al eliminar clase:", err);
      toast.error("❌ No se pudo eliminar la clase", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const renderMaestro = (maestro: Clase["maestro"]) => {
    if (typeof maestro === "string") return maestro;
    if (maestro && typeof maestro === "object")
      return `${maestro.nombre} ${maestro.apellido}`;
    return "Maestro inválido";
  };

  const renderAlumnos = (alumnos: Clase["alumnos"]) => {
    if (!Array.isArray(alumnos)) return "Alumnos inválidos";
    return (
      <ul>
        {alumnos.map((alumno, idx) => {
          if (typeof alumno === "string") return <li key={idx}>{alumno}</li>;
          if (alumno && typeof alumno === "object")
            return (
              <li key={alumno._id}>
                {alumno.nombre} {alumno.apellido}
              </li>
            );
          return <li key={idx}>Dato inválido</li>;
        })}
      </ul>
    );
  };

  const clasesFiltradas = clases.filter((c) =>
    `${c.nombre} ${c.codigoClase} ${renderMaestro(c.maestro)} ${c.dias.join(" ")}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tabla-container">
      <h2>Clases de Natación</h2>

      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔎 Buscar clase por nombre, código o maestro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-busqueda"
        />

        <button
          className="crear-clase-btn"
          onClick={() => navigate("/crear-clase")}
        >
           Crear Clase
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="tabla-alumnos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Maestro</th>
            <th>Días</th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.map((clase) => (
            <tr key={clase._id}>
              <td>{clase.codigoClase}</td>
              <td>{clase.nombre}</td>
              <td>{renderMaestro(clase.maestro)}</td>
              <td>{clase.dias.join(", ")}</td>
              <td>{clase.hora}</td>
              <td className="acciones">
                <button onClick={() => {
                  setClaseDetalle(clase);
                  setModalDetalleVisible(true);
                }}>Ver más</button>

                <button onClick={() => {
                  setClaseEditando(clase);
                  setModalEdicionVisible(true);
                }}>✏️ Editar</button>

                <button onClick={() => {
                  setClaseAsignandoId(clase._id);
                  setModalAsignarVisible(true);
                }}>👥 Agregar</button>

                <button onClick={() => eliminar(clase._id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalEdicionVisible && claseEditando && (
        <ModalEditarClase
          clase={claseEditando}
          onClose={() => setModalEdicionVisible(false)}
          onActualizado={cargarClases}
        />
      )}

      {modalAsignarVisible && claseAsignandoId && (
        <ModalAsignarAlumnos
          claseId={claseAsignandoId}
          onClose={() => setModalAsignarVisible(false)}
          onActualizado={cargarClases}
        />
      )}

      {modalDetalleVisible && claseDetalle && (
        <div className="modal-detalle">
          <div className="modal-contenido">
            <h3>Detalles de clase: {claseDetalle.nombre}</h3>
            <p><strong>Código:</strong> {claseDetalle.codigoClase}</p>
            <p><strong>Maestro:</strong> {renderMaestro(claseDetalle.maestro)}</p>
            <p><strong>Días:</strong> {claseDetalle.dias.join(", ")}</p>
            <p><strong>Hora:</strong> {claseDetalle.hora}</p>
            <p><strong>Fecha inicio:</strong> {new Date(claseDetalle.fechaInicio).toLocaleDateString()}</p>
            <p><strong>Fecha fin:</strong> {new Date(claseDetalle.fechaFin).toLocaleDateString()}</p>
            <p><strong>Alumnos:</strong></p>
            {renderAlumnos(claseDetalle.alumnos)}

            <button onClick={() => setModalDetalleVisible(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
