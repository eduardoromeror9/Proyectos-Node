import express from 'express'; // agregar el modulo en el package.json
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';


// Crear la app
const app = express()

// Habilitar lector de datos en formularios
app.use(express.urlencoded({ extended: true }))


// conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log('DB conectada con exito!!');
} catch (error) {
  console.log(error);
}



// habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');


// Carpeta publica
app.use(express.static('public'));


// Routing
app.use('/auth', usuarioRoutes);


// Definir puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
})