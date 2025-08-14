import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { actualizarProfesor } from "../services/profesorService";
import "../styles/modalAlumno.css";

type Profesor = {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
};

export const ModalEditarProfesor = ({
  profesor,
  onClose,
  onActualizado
}: {
  profesor: Profesor;
  onClose: () => void;
  onActualizado: () => void;
}) => {
  const [datos, setDatos] = useState<Profesor>(profesor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "¿Estás seguro de que deseas actualizar al profesor?",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      backdrop: true
    });

    if (!resultado.isConfirmed) return;

    try {
      await actualizarProfesor(datos._id, { ...datos, contraseña: "" });

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
        <h2>Editar Profesor</h2>

        <input name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="apellido" value={datos.apellido} onChange={handleChange} placeholder="Apellido" />
        <input name="correo" value={datos.correo} onChange={handleChange} placeholder="Correo" />
        <input name="telefono" value={datos.telefono} onChange={handleChange} placeholder="Teléfono" />
        <input name="direccion" value={datos.direccion} onChange={handleChange} placeholder="Dirección" />

        <div className="botones-acciones">
          <button className="guardar-btn" onClick={guardarCambios}>Guardar cambios</button>
          <button className="cancelar-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
