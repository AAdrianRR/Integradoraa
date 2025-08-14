export interface Profesor {
  _id: string;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

export interface Alumno {
  _id: string;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

export interface Clase {
  _id: string;
  codigoClase: string;
  nombre: string;
  maestro: Profesor | string;      // Si usas populate, será un objeto; si no, es un ID string
  alumnos: (Alumno | string)[];    // Array de alumnos con datos completos o solo IDs
  dias: string[];
  hora: string;
  fechaInicio: string;             // Puedes cambiar a Date si estás usando objetos Date
  fechaFin: string;
}
