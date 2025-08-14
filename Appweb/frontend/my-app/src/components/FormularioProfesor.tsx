import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarProfesor } from "../services/profesorService";
import type { ProfesorDatos } from "../services/profesorService";
import "../styles/formulario.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const FormularioProfesor = ({ onRegistrado }: { onRegistrado?: () => void }) => {
  const [formulario, setFormulario] = useState<ProfesorDatos>({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    contraseña: ""
  });

  const [confirmar, setConfirmar] = useState(""); // ✅ campo adicional
  const navigate = useNavigate();

  const formularioParcial =
    Object.values(formulario).some(valor => valor.trim() !== "") || confirmar.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposIncompletos = Object.entries(formulario).filter(([_, valor]) => !valor.trim());
    if (camposIncompletos.length > 0 || !confirmar.trim()) {
      toast.warn("Completa todos los campos antes de registrar", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    if (formulario.contraseña !== confirmar) {
      toast.warn("🔐 Las contraseñas no coinciden", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    try {
      await registrarProfesor(formulario);

      toast.success("✅ Profesor registrado con éxito", {
        position: "top-center",
        autoClose: 2500,
        onClose: () => navigate("/profesores")
      });

      if (onRegistrado) onRegistrado();

      setFormulario({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        direccion: "",
        contraseña: ""
      });
      setConfirmar("");
    } catch (err: any) {
      console.error("❌ Error al registrar:", err);
      const mensaje = err?.response?.data?.message;

      if (mensaje === "El correo ya está registrado") {
        toast.warn("⚠️ Ese correo ya está en uso. Intenta con otro.", {
          position: "top-center",
          autoClose: 3000
        });
      } else {
        toast.error("❌ No se pudo registrar. Correo inválido.", {
          position: "top-center",
          autoClose: 3000
        });
      }
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>Registrar Profesor</h2>

      <label>Nombre</label>
      <input name="nombre" value={formulario.nombre} onChange={handleChange} />

      <label>Apellido</label>
      <input name="apellido" value={formulario.apellido} onChange={handleChange} />

      <label>Correo</label>
      <input name="correo" type="email" value={formulario.correo} onChange={handleChange} />

      <label>Teléfono</label>
      <input name="telefono" value={formulario.telefono} onChange={handleChange} />

      <label>Dirección</label>
      <input name="direccion" value={formulario.direccion} onChange={handleChange} />

      <label>Contraseña</label>
      <input name="contraseña" type="password" value={formulario.contraseña} onChange={handleChange} />

      <label>Confirmar Contraseña</label>
      <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />

      <button
        type="submit"
        disabled={!formularioParcial}
        style={{
          backgroundColor: formularioParcial ? "#007bff" : "#ccc",
          color: formularioParcial ? "white" : "#666",
          cursor: formularioParcial ? "pointer" : "not-allowed",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          marginTop: "1rem"
        }}
      >
        Registrar
      </button>

      <ToastContainer />
    </form>
  );
};
