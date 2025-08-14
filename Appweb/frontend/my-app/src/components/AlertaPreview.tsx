import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AlertaPreview = () => {
  const mostrarAlerta = (tipo: string) => {
    const opciones = { position: "top-right", autoClose: 2500 };

    switch (tipo) {
      case "success":
        toast.success("✅ Operación exitosa!", opciones);
        break;
      case "error":
        toast.error("❌ Algo salió mal...", opciones);
        break;
      case "info":
        toast.info("ℹ️ Esto es información útil", opciones);
        break;
      case "warn":
        toast.warn("⚠️ Atención: Verifica los campos", opciones);
        break;
      default:
        toast("🟡 Alerta genérica", opciones);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎉 Vista previa de alertas</h2>
      <button onClick={() => mostrarAlerta("success")}>✅ Éxito</button>
      <button onClick={() => mostrarAlerta("error")}>❌ Error</button>
      <button onClick={() => mostrarAlerta("info")}>ℹ️ Info</button>
      <button onClick={() => mostrarAlerta("warn")}>⚠️ Advertencia</button>
      <button onClick={() => mostrarAlerta("default")}>🔔 Genérica</button>
      <ToastContainer />
    </div>
  );
};
