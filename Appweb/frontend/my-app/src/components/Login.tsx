import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginDetectandoTipo } from "../services/authService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../styles/login.css";

import difLogo from "../imagenes/dif.png";
import renaceLogo from "../imagenes/Logotipo RENACE 2025.png";
import splashLogo from "../imagenes/DGO_Mesa de trabajo 1.png";
import splashPostLogin from "../imagenes/dif.svg";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoPostLogin, setCargandoPostLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setCargandoInicial(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoPostLogin(true);

    try {
      const { tipo, datos } = await loginDetectandoTipo(email, password);

      localStorage.setItem("token", datos.token);
      localStorage.setItem("rol", tipo);
      localStorage.setItem("nombre", datos[tipo]?.nombre || "");

      toast.success("✅ Inicio de sesión exitoso", {
        position: "bottom-right",
        autoClose: 2000
      });

      setTimeout(() => {
        if (tipo === "admin") navigate("/admin/panel");
        else if (tipo === "profesor") navigate("/mis-clases");
        else if (tipo === "alumno") navigate("/clase-alumno");
      }, 2000);
    } catch (error) {
      setCargandoPostLogin(false);

      await Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Verifica tu correo y contraseña",
        confirmButtonColor: "#d33"
      });
    }
  };

  if (cargandoInicial) {
    return (
      <div className="splash-container">
        <img src={splashLogo} alt="Pantalla de carga" className="splash-logo" />
      </div>
    );
  }

  if (cargandoPostLogin) {
    return (
      <div className="splash-container">
        <img src={splashPostLogin} alt="Accediendo al sistema..." className="splash-logo" />
      </div>
    );
  }

  return (
    <div className="login-container fade-in">
      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-images">
          <img src={difLogo} alt="Logo DIF institucional" />
          <img src={renaceLogo} alt="Logotipo RENACE 2025" />
        </div>

        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={!email || !password}
          className={!email || !password ? "btn-disabled" : ""}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};
