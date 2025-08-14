const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); 

// Registro de admin
const registrarAdmin = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, direccion, contraseña } = req.body;

    const existe = await Admin.findOne({ correo });
    if (existe) {
      return res.status(400).json({ message: "Ya existe un admin con ese correo." });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoAdmin = new Admin({
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      contraseña: hash
    });

    await nuevoAdmin.save();

    res.status(201).json({ message: "Administrador registrado con éxito." });
  } catch (error) {
    console.error(" Error al registrar admin:", error);
    res.status(500).json({ message: "Error interno al registrar administrador." });
  }
};

// Inicio de sesión de admin
const loginAdmin = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const admin = await Admin.findOne({ correo });
    if (!admin) {
      return res.status(404).json({ message: "Correo no registrado como administrador." });
    }

    const coincide = await bcrypt.compare(contraseña, admin.contraseña);
    if (!coincide) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: admin._id, rol: "admin" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        correo: admin.correo
      }
    });
  } catch (error) {
    console.error("Error en login admin:", error);
    res.status(500).json({ message: "Error al iniciar sesión como administrador." });
  }
};

module.exports = {
  registrarAdmin,
  loginAdmin
};
