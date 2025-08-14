import { toast, type ToastOptions } from "react-toastify";
import type { NavigateFunction } from "react-router-dom";

const configBase: ToastOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  pauseOnHover: true,
  draggable: true,
  closeOnClick: true
};

export const mostrarExito = (mensaje: string, navigate?: NavigateFunction, ruta?: string) => {
  toast.success(mensaje, {
    ...configBase,
    onClose: ruta && navigate ? () => navigate(ruta) : undefined
  });
};

export const mostrarError = (mensaje: string) => {
  toast.error(mensaje, configBase);
};

export const mostrarInfo = (mensaje: string) => {
  toast.info(mensaje, configBase);
};

export const mostrarAdvertencia = (mensaje: string) => {
  toast.warn(mensaje, configBase);
};
