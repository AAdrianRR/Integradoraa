const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config");
const Admin = require("../models/admin"); 

const loginAdmin = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const admin = await Admin.findOne({ correo });
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado." });
    }

    const validar = await bcrypt.compare(contraseña, admin.contraseña);
    if (!validar) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign({ id: admin._id, rol: "admin" }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error en login:", error.message || error);
    res.status(500).json({ message: "Error al iniciar sesión como admin." });
  }
};

module.exports = loginAdmin;
