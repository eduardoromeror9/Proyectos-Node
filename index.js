// const express = require('express');
import express from 'express'; // agregar el modulo en el package.json
import usuarioRoutes from './routes/usuarioRoutes.js';

// Crear la app
const app = express()

// Rutas
app.use('/', usuarioRoutes); // usebusca las rutas que empiecen con una /


// Definir puerto
const port = 3000;
app.listen(port, () => {
    console.log(`Server on port ${port}`);
})