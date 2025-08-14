import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { actualizarAlumno } from "../services/alumnoService";
import "../styles/modalAlumno.css";

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

export const ModalEditarAlumno = ({
  alumno,
  onClose,
  onActualizado
}: {
  alumno: Alumno;
  onClose: () => void;
  onActualizado: () => void;
}) => {
  const [datos, setDatos] = useState<Alumno>(alumno);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("padre.")) {
      const key = name.split(".")[1];
      setDatos(prev => ({
        ...prev,
        padre: {
          ...prev.padre,
          [key]: value
        }
      }));
    } else {
      setDatos(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const guardarCambios = async () => {
    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar la información del alumno?",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await actualizarAlumno(alumno.id, datos);
      toast.success("✅ Cambios guardados exitosamente", {
        position: "bottom-right",
        autoClose: 2500
      });
      onActualizado();
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      toast.error("❌ No se pudieron guardar los cambios", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="cerrar-btn" onClick={onClose}>×</button>
        <h2>Editar Alumno</h2>

        <label>Nombre</label>
        <input name="nombre" value={datos.nombre} onChange={handleChange} />

        <label>Apellido</label>
        <input name="apellido" value={datos.apellido} onChange={handleChange} />

        <label>Correo</label>
        <input name="correo" value={datos.correo || ""} onChange={handleChange} />

        <label>Teléfono</label>
        <input name="telefono" value={datos.telefono || ""} onChange={handleChange} />

        <label>Dirección</label>
        <input name="direccion" value={datos.direccion || ""} onChange={handleChange} />

        <label>Edad</label>
        <input name="edad" type="number" value={datos.edad || ""} onChange={handleChange} />

        <label>Clase (opcional)</label>
        <input name="clase" value={datos.clase || ""} onChange={handleChange} />

        {datos.esMenorEdad && (
          <>
            <label>Nombre del tutor</label>
            <input name="padre.nombre" value={datos.padre?.nombre || ""} onChange={handleChange} />

            <label>Teléfono del tutor</label>
            <input name="padre.telefono" value={datos.padre?.telefono || ""} onChange={handleChange} />
          </>
        )}

        <div className="botones-acciones">
          <button className="guardar-btn" onClick={guardarCambios}>Guardar cambios</button>
          <button className="cancelar-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
