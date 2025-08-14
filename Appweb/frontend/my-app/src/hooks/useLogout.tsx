import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useLogout = () => {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    await Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has salido correctamente.",
      confirmButtonColor: "#2d89ef"
    });

    navigate("/", { replace: true });
  };

  return cerrarSesion;
};
