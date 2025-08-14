import { useEffect, useState } from "react";
import "../styles/panel-admin.css";
import renaceLogo from "../imagenes/Logotipo RENACE 2025.png";

const imagenes = [
  { src: "/imagenes/centro.jpg", titulo: "Centro RENACE Oriente" },
  { src: "/imagenes/nata.jpg", titulo: "Natación" },
  { src: "/imagenes/take.jpg", titulo: "Taekwondo " }
];

export const PanelAdmin = () => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="panel-admin">
      <img src={renaceLogo} alt="RENACE 2025" className="logo-renace" />
      <h1 className="titulo-admin">Centro de Desarrollo Oriente</h1>

      <div className="carrusel-elegante">
        {imagenes.map((img, i) => (
          <div
            key={i}
            className={`slide ${i === indice ? "activo" : ""}`}
          >
            <img src={img.src} alt={img.titulo} />
            <div className="titulo-slide">{img.titulo}</div>
          </div>
        ))}
        <div className="indicadores">
          {imagenes.map((_, i) => (
            <span
              key={i}
              className={i === indice ? "punto activo" : "punto"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
