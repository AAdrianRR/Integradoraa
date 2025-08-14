import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerAlumnos,
  eliminarAlumno
} from "../services/alumnoService";
import { ModalEditarAlumno } from "./ModalEditarAlumno";
import "../styles/tabla.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  correo?: string;
  edad?: number;
  direccion?: string;
  telefono?: string;
  clase?: string;
  esMenorEdad?: boolean;
  padre?: { nombre: string; telefono?: string };
}

export const TablaAlumnos = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alumnoEditando, setAlumnoEditando] = useState<Alumno | null>(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [alumnoDetalle, setAlumnoDetalle] = useState<Alumno | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = () => {
    obtenerAlumnos()
      .then((res) => {
        const datosConId = (res.data as (Alumno & { _id: string })[]).map((a) => ({
          ...a,
          id: a._id
        }));
        setAlumnos(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar alumnos:", err);
        setError("No se pudieron obtener los alumnos.");
      });
  };

  const manejarEliminacion = async (id: string) => {
    const alumno = alumnos.find(a => a.id === id);
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar alumno?",
      text: `¿Eliminar a ${alumno?.nombre || "el alumno"}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarAlumno(id);
      toast.success("🗑️ Alumno eliminado correctamente", {
        position: "bottom-right",
        autoClose: 2500
      });
      setAlumnos((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar alumno:", error);
      toast.error("❌ No se pudo eliminar el alumno", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const resultadosFiltrados = alumnos.filter((a) =>
    `${a.nombre} ${a.apellido} ${a.correo} ${a.clase}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tabla-container">
      <h2>Lista de Alumnos</h2>

      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔎 Buscar alumno por nombre, correo o clase..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-busqueda"
        />

        <button
          className="registrar-btn"
          onClick={() => navigate("/registro-alumno")}
        >
          Registrar Alumno
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {resultadosFiltrados.length === 0 ? (
        <p>No hay coincidencias para tu búsqueda.</p>
      ) : (
        <table className="tabla-alumnos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Edad</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre} {a.apellido}</td>
                <td>{a.correo}</td>
                <td>{a.edad || "—"}</td>
                <td>{a.direccion || "—"}</td>
                <td>
                  <button onClick={() => {
                    setAlumnoDetalle(a);
                    setModalDetalleVisible(true);
                  }}>Ver más</button>
                  <button onClick={() => {
                    setAlumnoEditando(a);
                    setModalVisible(true);
                  }}>✏️ Editar</button>
                  <button onClick={() => manejarEliminacion(a.id)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de edición de alumno */}
      {modalVisible && alumnoEditando && (
        <ModalEditarAlumno
          alumno={alumnoEditando}
          onClose={() => setModalVisible(false)}
          onActualizado={cargarAlumnos}
        />
      )}

      {/* Modal de detalle informativo */}
      {modalDetalleVisible && alumnoDetalle && (
        <div className="modal-detalle">
          <div className="modal-contenido">
            <h3>Información de {alumnoDetalle.nombre} {alumnoDetalle.apellido}</h3>
            <p><strong>Correo:</strong> {alumnoDetalle.correo}</p>
            <p><strong>Edad:</strong> {alumnoDetalle.edad || "—"}</p>
            <p><strong>Dirección:</strong> {alumnoDetalle.direccion || "—"}</p>
            <p><strong>Teléfono:</strong> {alumnoDetalle.telefono || "—"}</p>
            <p><strong>Clase:</strong> {alumnoDetalle.clase || "—"}</p>
            <p><strong>Menor de Edad:</strong> {alumnoDetalle.esMenorEdad ? "Sí" : "No"}</p>
            <p><strong>Padre/Tutor:</strong> {alumnoDetalle.padre?.nombre || "—"}</p>
            <p><strong>Tel. Tutor:</strong> {alumnoDetalle.padre?.telefono || "—"}</p>

            <button onClick={() => setModalDetalleVisible(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
