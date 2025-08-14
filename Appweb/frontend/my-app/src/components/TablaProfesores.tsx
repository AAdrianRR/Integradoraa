import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerProfesores,
  eliminarProfesor
} from "../services/profesorService";
import { ModalEditarProfesor } from "./ModalEditarProfesor";
import "../styles/tabla.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type Profesor = {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
};

export const TablaProfesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [profesorEditando, setProfesorEditando] = useState<Profesor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = () => {
    obtenerProfesores()
      .then(res => setProfesores(res.data as Profesor[]))
      .catch(err => {
        console.error("❌ Error al cargar:", err);
        setError("No se pudieron obtener los profesores.");
      });
  };

  const eliminar = async (id: string) => {
    const prof = profesores.find(p => p._id === id);
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar profesor?",
      text: `¿Eliminar a ${prof?.nombre || "el profesor"}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarProfesor(id);
      toast.success("🗑️ Profesor eliminado correctamente", {
        position: "bottom-right",
        autoClose: 2500
      });
      setProfesores(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
      toast.error("❌ No se pudo eliminar el profesor", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const filtrados = profesores.filter(p =>
    `${p.nombre} ${p.apellido} ${p.correo} ${p.direccion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tabla-container">
      <h2>Lista de Profesores</h2>

      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔎 Buscar por nombre, correo o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-busqueda"
        />

        <button
          className="registrar-btn"
          onClick={() => navigate("/registrar-profesor")}
        >
          Registrar Profesor
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="tabla-alumnos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(p => (
            <tr key={p._id}>
              <td>{p.nombre} {p.apellido}</td>
              <td>{p.correo}</td>
              <td>{p.telefono}</td>
              <td>{p.direccion}</td>
              <td>
                <button onClick={() => {
                  setProfesorEditando(p);
                  setModalVisible(true);
                }}>✏️ Editar</button>
                <button onClick={() => eliminar(p._id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && profesorEditando && (
        <ModalEditarProfesor
          profesor={profesorEditando}
          onClose={() => setModalVisible(false)}
          onActualizado={cargarProfesores}
        />
      )}
    </div>
  );
};
