import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearClase } from "../services/claseService";
import { obtenerProfesores } from "../services/profesorService";
import "../styles/registro.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const FormularioClase = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigoClase: "",
    nombre: "",
    maestro: "",
    dias: [] as string[],
    hora: "",
    fechaInicio: "",
    fechaFin: ""
  });

  const [profesores, setProfesores] = useState([]);

  const formParcial = Object.values(form).some(valor =>
    Array.isArray(valor) ? valor.length > 0 : typeof valor === "string" && valor.trim() !== ""
  );

  useEffect(() => {
    obtenerProfesores().then(res => setProfesores(res.data || []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleDiaDobleClick = (dia: string) => {
    setForm(prev => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposVacios = Object.entries(form).filter(([_, valor]) =>
      Array.isArray(valor) ? valor.length === 0 : !valor.trim()
    );

    if (camposVacios.length > 0) {
      toast.warn("⚠️ Completa todos los campos antes de crear la clase", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    try {
      await crearClase({
        ...form,
        fechaInicio: new Date(form.fechaInicio),
        fechaFin: new Date(form.fechaFin)
      });

      toast.success("✅ Clase creada exitosamente", {
        position: "top-center",
        autoClose: 2500
      });

      setTimeout(() => navigate("/clases-natacion"), 1800);

    } catch (error: any) {
      console.error("❌ Error al registrar clase:", error);
      toast.error(error.response?.data?.message || "❌ Error inesperado al crear la clase", {
        position: "top-center",
        autoClose: 3000
      });
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>Registrar Nueva Clase</h2>

      <label>Código de clase</label>
      <input name="codigoClase" value={form.codigoClase} onChange={handleChange} />

      <label>Nombre de la clase</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} />

      <label>Profesor</label>
      <select name="maestro" value={form.maestro} onChange={handleChange}>
        <option value="">Selecciona un profesor</option>
        {profesores.map(p => (
          <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
        ))}
      </select>

      <label>Días de la semana (doble clic para seleccionar)</label>
      <div className="checkbox-dias-grid">
        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(dia => (
          <div key={dia} className="dia-item" onDoubleClick={() => toggleDiaDobleClick(dia)}>
            <input
              type="checkbox"
              readOnly
              checked={form.dias.includes(dia)}
            />
            <span>{dia}</span>
          </div>
        ))}
      </div>

      <label>Hora</label>
      <input type="time" name="hora" value={form.hora} onChange={handleChange} />

      <label>Fecha de inicio</label>
      <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />

      <label>Fecha de fin</label>
      <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />

      <button
        type="submit"
        disabled={!formParcial}
        style={{
          backgroundColor: formParcial ? "#007bff" : "#ccc",
          color: formParcial ? "white" : "#666",
          cursor: formParcial ? "pointer" : "not-allowed",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          marginTop: "1.4rem"
        }}
      >
        Crear Clase
      </button>

      <ToastContainer />
    </form>
  );
};
