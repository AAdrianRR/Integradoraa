import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { actualizarClase } from "../services/claseService";
import "../styles/modalAlumno.css";
export type { Clase } from "../types";

export const ModalEditarClase = ({
  clase,
  onClose,
  onActualizado
}: {
  clase: Clase;
  onClose: () => void;
  onActualizado: () => void;
}) => {
  const [datos, setDatos] = useState<Partial<Clase>>(clase);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  };

  const guardar = async () => {
    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar la información de la clase?",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await actualizarClase(clase._id, datos);
      toast.success("✅ Clase actualizada", { position: "bottom-right", autoClose: 2500 });
      onActualizado();
      onClose();
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      toast.error("❌ No se pudo actualizar la clase", { position: "bottom-right" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="cerrar-btn" onClick={onClose}>×</button>
        <h2>Editar Clase</h2>

        <input name="codigoClase" value={datos.codigoClase || ""} onChange={handleChange} placeholder="Código" />
        <input name="nombre" value={datos.nombre || ""} onChange={handleChange} placeholder="Nombre" />
        <input name="hora" value={datos.hora || ""} onChange={handleChange} placeholder="Hora" />
        <input name="fechaInicio" type="date" value={datos.fechaInicio?.substring(0, 10) || ""} onChange={handleChange} />
        <input name="fechaFin" type="date" value={datos.fechaFin?.substring(0, 10) || ""} onChange={handleChange} />
        <input
          name="dias"
          value={(datos.dias || []).join(", ")}
          onChange={e => setDatos(prev => ({
            ...prev,
            dias: e.target.value.split(",").map(d => d.trim())
          }))}
          placeholder="Días (ej: lunes, miércoles)"
        />

        <div className="botones-acciones">
          <button className="guardar-btn" onClick={guardar}>Guardar cambios</button>
          <button className="cancelar-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
