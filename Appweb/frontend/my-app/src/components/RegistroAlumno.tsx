import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/registro.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const RegistroAlumno = ({ onRegistrado }: { onRegistrado?: () => void }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    correo: "",
    direccion: "",
    telefono: "",
    contraseña: "",
    clase: "",
    esMenorEdad: false,
    padre: { nombre: "", telefono: "" }
  });

  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const edadNum = Number(formData.edad);
    setFormData(prev => ({
      ...prev,
      esMenorEdad: edadNum > 0 && edadNum < 18
    }));
  }, [formData.edad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("padre.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        padre: { ...prev.padre, [key]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const tieneDigito =
    Object.values(formData).some(valor =>
      typeof valor === "string"
        ? /\d/.test(valor)
        : typeof valor === "object"
        ? Object.values(valor).some(v => /\d/.test(v))
        : false
    ) || /\d/.test(confirmar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposObligatorios = [
      formData.nombre,
      formData.apellido,
      formData.edad,
      formData.correo,
      formData.direccion,
      formData.telefono,
      formData.contraseña,
      confirmar
    ];

    const faltanCampos = camposObligatorios.some(valor => !valor.trim());
    const faltanPadre = formData.esMenorEdad &&
      (!formData.padre.nombre.trim() || !formData.padre.telefono.trim());

    if (faltanCampos || faltanPadre) {
      toast.warn("Completa todos los campos para registrar", {
        position: "bottom-right",
        autoClose: 3000
      });
      return;
    }

    if (formData.contraseña !== confirmar) {
      toast.warn("🔐 Las contraseñas no coinciden", {
        position: "bottom-right",
        autoClose: 3000
      });
      return;
    }

    const alumnoData = {
      ...formData,
      edad: Number(formData.edad),
      clase: formData.clase.trim() ? formData.clase : undefined,
      padre: formData.esMenorEdad ? formData.padre : undefined
    };

    try {
      await axios.post(`${API_BASE}/alumno`, alumnoData);

      toast.success("Alumno registrado con éxito", {
        position: "bottom-right",
        autoClose: 2500,
        onClose: () => navigate("/alumnos")
      });

      if (onRegistrado) onRegistrado();

      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        correo: "",
        direccion: "",
        telefono: "",
        contraseña: "",
        clase: "",
        esMenorEdad: false,
        padre: { nombre: "", telefono: "" }
      });
      setConfirmar("");
    } catch (error) {
      console.error("❌ Error al registrar:", error);

      toast.error("❌ Ocurrió un error al registrar el alumno", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-card">
        <h2>Registro de Alumno</h2>

        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
        <input
          name="edad"
          type="number"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          min={1}
        />
        <input name="correo" type="email" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
        <input name="contraseña" type="password" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} />
        <input type="password" placeholder="Confirmar contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)} />
        {/*<input name="clase" placeholder="ID de la clase (opcional)" value={formData.clase} onChange={handleChange} />*/}

        {formData.esMenorEdad && (
          <>
            <input
              name="padre.nombre"
              placeholder="Nombre del tutor"
              value={formData.padre.nombre}
              onChange={handleChange}
            />
            <input
              name="padre.telefono"
              placeholder="Teléfono del tutor"
              value={formData.padre.telefono}
              onChange={handleChange}
            />
          </>
        )}

        <button
          type="submit"
          disabled={!tieneDigito}
          style={{
            backgroundColor: tieneDigito ? "#007bff" : "#ccc",
            color: tieneDigito ? "white" : "#666",
            cursor: tieneDigito ? "pointer" : "not-allowed",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            marginTop: "1rem"
          }}
        >
          Registrar Alumno
        </button>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          closeOnClick
          pauseOnHover
          draggable
          limit={2}
          closeButton={
            <button style={{
              fontSize: "0.75rem",
              background: "transparent",
              border: "none",
              color: "#555",
              marginRight: "6px",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1"
            }}>
              ×
            </button>
          }
        />
      </form>
    </div>
  );
};
