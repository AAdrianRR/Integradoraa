import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/modalAlumno.css";

export const ModalAsignarAlumnos = ({
  claseId,
  onClose,
  onActualizado
}: {
  claseId: string;
  onClose: () => void;
  onActualizado: () => void;
}) => {
  const [alumnosDisponibles, setAlumnosDisponibles] = useState<any[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("⚠️ Token no encontrado. Inicia sesión nuevamente.", { position: "bottom-right" });
      setCargando(false);
      return;
    }

    axios.get("http://localhost:3000/alumno/disponibles", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then(res => {
        const alumnos = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.alumnos)
          ? res.data.alumnos
          : [];
        setAlumnosDisponibles(alumnos);
        setCargando(false);
      })
      .catch(err => {
        console.error("❌ Error:", err.response?.status, err.response?.data || err);
        toast.error("No se pudieron cargar los alumnos disponibles", { position: "bottom-right" });
        setCargando(false);
      });
  }, []);

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const asignar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No se puede asignar sin sesión válida.", { position: "bottom-right" });
      return;
    }

    if (seleccionados.length === 0) {
      toast.warn("Selecciona al menos un alumno", { position: "bottom-right" });
      return;
    }

    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Asignar alumnos?",
      text: "¿Deseas asignar los alumnos seleccionados a esta clase?",
      showCancelButton: true,
      confirmButtonText: "Sí, asignar",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.patch(
        `http://localhost:3000/clase/${claseId}/asignar-alumnos`,
        { alumnos: seleccionados },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("✅ Alumnos asignados correctamente", {
        position: "bottom-right",
        autoClose: 2500
      });

      onActualizado();
      onClose();
    } catch (err) {
      console.error("❌ Error:", err.response?.status, err.response?.data || err);
      toast.error("❌ No se pudo asignar alumnos", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="cerrar-btn" onClick={onClose}>×</button>
        <h2>Asignar Alumnos</h2>

        {cargando ? (
          <p>Cargando alumnos disponibles...</p>
        ) : alumnosDisponibles.length === 0 ? (
          <p>No hay alumnos disponibles.</p>
        ) : (
          <div className="grid-alumnos">
            {alumnosDisponibles.map(al => (
              <label key={al._id} className="card-alumno">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(al._id)}
                  onChange={() => toggleSeleccion(al._id)}
                />
                {al.nombre} {al.apellido}
              </label>
            ))}
          </div>
        )}

        <div className="botones-acciones">
          <button className="guardar-btn" onClick={asignar}>Asignar seleccionados</button>
          <button className="cancelar-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
