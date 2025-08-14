import { Routes, Route, useLocation } from "react-router-dom";

// 🧩 Componentes base
import { Login } from "./components/Login";
import { RegistroAlumno } from "./components/RegistroAlumno";
import { TablaAlumnos } from "./components/TablaAlumnos";
import { MonitorPiscina } from "./components/MonitorPiscina";
import { TablaClasesNatacion } from "./components/TablaClasesNatacion";
import { FormularioClase } from "./components/FormularioClase";
import { FormularioProfesor } from "./components/FormularioProfesor";
import { TablaProfesores } from "./components/TablaProfesores";
import { Navbar } from "./components/Navbar";
import { RutaPrivada } from "./components/RutaPrivada";
import { NoAutorizado } from "./components/NoAutorizado";
import { AlertaPreview } from "./components/AlertaPreview";

// Paneles por rol
import { PanelClasesProfesor } from "./components/PanelClasesProfesor";
import { PanelClaseAlumno } from "./components/PanelClaseAlumno";
import { PanelAdmin } from "./components/PanelAdmin";

import "./styles/global.css";

const App = () => {
  const location = useLocation();
  const esLogin = location.pathname === "/";

  return (
    <>
      {!esLogin && <Navbar />}
      <div style={{ paddingTop: !esLogin ? "80px" : "0" }}>
        <Routes>
          {/* 🟢 Pública */}
          <Route path="/" element={<Login />} />

          {/* 🔐 Admin */}
          <Route path="/admin/panel" element={<RutaPrivada rolPermitido="admin"><PanelAdmin /></RutaPrivada>} />
          <Route path="/registro-alumno" element={<RutaPrivada rolPermitido="admin"><RegistroAlumno /></RutaPrivada>} />
          <Route path="/alumnos" element={<RutaPrivada rolPermitido="admin"><TablaAlumnos /></RutaPrivada>} />
          <Route path="/clases-natacion" element={<RutaPrivada rolPermitido="admin"><TablaClasesNatacion /></RutaPrivada>} />
          <Route path="/crear-clase" element={<RutaPrivada rolPermitido="admin"><FormularioClase /></RutaPrivada>} />
          <Route path="/registrar-profesor" element={<RutaPrivada rolPermitido="admin"><FormularioProfesor /></RutaPrivada>} />
          <Route path="/profesores" element={<RutaPrivada rolPermitido="admin"><TablaProfesores /></RutaPrivada>} />
          <Route path="/alertas" element={<RutaPrivada rolPermitido="admin"><AlertaPreview /></RutaPrivada>} />

          {/* Compartido */}
          <Route path="/monitor" element={<RutaPrivada rolPermitido={["admin", "profesor"]}><MonitorPiscina /></RutaPrivada>} />

          {/*  Profesor */}
          <Route path="/mis-clases" element={<RutaPrivada rolPermitido="profesor"><PanelClasesProfesor /></RutaPrivada>} />

          {/*  Alumno */}
          <Route path="/clase-alumno" element={<RutaPrivada rolPermitido="alumno"><PanelClaseAlumno /></RutaPrivada>} />

          {/* No autorizado */}
          <Route path="/no-autorizado" element={<NoAutorizado />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
