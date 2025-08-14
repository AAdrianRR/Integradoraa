export const obtenerRutaClases = (): string | null => {
  const rol = localStorage.getItem("rol");

  switch (rol) {
    case "profesor":
      return "http://localhost:3000/profesor/mis-clases";
    case "admin":
      return "http://localhost:3000/clase";
    default:
      return null; // 🚫 No autorizado o no definido
  }
};
