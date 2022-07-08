// const express = require('express');
import express from 'express'; // agregar el modulo en el package.json
import usuarioRoutes from './routes/usuarioRoutes.js';

// Crear la app
const app = express()


// habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');


// Carpeta publica
app.use(express.static('public'));


// Routing
app.use('/auth', usuarioRoutes);


// Definir puerto
const port = 3000;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
})