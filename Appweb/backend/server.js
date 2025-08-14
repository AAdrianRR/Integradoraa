require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;  


if (!MONGO_URI) {
  console.error(" Error: La variable de entorno MONGO_URI no está definida.");
  process.exit(1); 
}

console.log(" MONGO_URI:", MONGO_URI); 

app.use(express.json());
app.use(cors());
//                                                                                        //SERVIDOR CONEXION ALA BASE DATOS

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' Conectado a MongoDB'))
  .catch(err => {
    console.error('Error al conectar:', err);
    process.exit(1);
  });


const alumnoRoutes = require('./routes/alumno');
app.use('/alumno', alumnoRoutes);


const claseRoutes = require('./routes/clase');
app.use('/clase', claseRoutes);


const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const profesorRoutes = require('./routes/profesor.js');
app.use('/profesor', profesorRoutes);

const iotRoutes = require('./routes/iot');
app.use('/iot', iotRoutes);





app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
