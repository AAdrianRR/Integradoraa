// COMPONENTE: Login
// ------------------

import { useState } from "react"; // // VARIABLES
import { useNavigate } from "react-router-dom"; // // MÉTODO DE NAVEGACIÓN
import Swal from "sweetalert2";
import { loginDetectandoTipo } from "../services/authService"; // // CONEXIÓN A BASE DE DATOS
import "../styles/login.css";

export const Login = () => { // // COMPONENTE
  const [email, setEmail] = useState(""); // // VARIABLES
  const [password, setPassword] = useState(""); // // VARIABLES
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { // // MÉTODO
    e.preventDefault();

    try { // // EXCEPCIÓN
      const { tipo, datos } = await loginDetectandoTipo(email, password); // // CONEXIÓN A BASE DE DATOS
      localStorage.setItem("token", datos.token); // // ATRIBUTOS
      navigate("/panel");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
};

// COMPONENTE: ModalEditarAlumno
// -----------------------------

interface Alumno { // // ATRIBUTOS
  id: string;
  nombre: string;
  edad?: number;
}

export const ModalEditarAlumno = ({ alumno }: { alumno: Alumno }) => { // // COMPONENTE
  const [datos, setDatos] = useState<Alumno>(alumno); // // VARIABLES

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // // MÉTODO
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const guardarCambios = async () => { // // MÉTODO + EXCEPCIÓN
    try {
      await actualizarAlumno(datos.id, datos); // // CONEXIÓN A BASE DE DATOS
    } catch (error) {
      console.error("Error al guardar", error); // // EXCEPCIÓN
    }
  };

  return (
    <form>
      <input name="nombre" value={datos.nombre} onChange={handleChange} />
      <input name="edad" value={datos.edad || ""} onChange={handleChange} />
    </form>
  );
};

// COMPONENTE: Navbar
// ------------------

export const Navbar = () => { // // COMPONENTE
  const [activo, setActivo] = useState<string | null>(null); // // VARIABLES
  const token = localStorage.getItem("token"); // // ATRIBUTOS

  const confirmarCerrarSesion = async () => { // // MÉTODO + EXCEPCIÓN
    try {
      await Swal.fire({
        icon: "success",
        title: "Sesión cerrada"
      });
      localStorage.clear(); // // ATRIBUTOS
    } catch (error) {
      console.error("Error al cerrar sesión", error); // // EXCEPCIÓN
    }
  };

  return (
    <nav>
      <button onClick={confirmarCerrarSesion}>Cerrar sesión</button>
    </nav>
  );
};
