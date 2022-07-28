import { exit } from "node:process"
import categorias from './categorias.js' // Datos de categorias
import precios from    './precios.js' // Datos de precios
import usuarios from "./usuarios.js" // Datos de usuarios 
import db from         '../config/db.js'  // Conexión a la base de datos
import { Categoria, Precio, Usuario } from '../models/index.js' // Modelos importados con las relaciones


const importarDatos = async () => {
  try {

    // Autenticar
    await db.authenticate()

    // Generar columnas
    await db.sync()

    // Insertar datos
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios)
    ])

    console.log('Datos insertados correctamente')
    exit()
    
  } catch (error) {
    console.log(error)
    exit(1)
  }   
}

const eliminarDatos = async () => {
  try {
    // await Promise.all([
    //   Categoria.destroy({where: {}, truncate: true }),
    //   Precio.destroy({where: {}, truncate: true })
    // ])

    await db.sync({force: true}) // Eliminar todos los datos de la base de datos con una sola linea, en la otra hay que agregar cado de los modelos
    console.log('Datos eliminados correctamente')
    exit()    
  } catch (error) {
    console.log(error)
    exit(1)    
  }
}

if(process.argv[2] === '-i') {
  importarDatos()
}

if(process.argv[2] === '-e') {
  eliminarDatos()
}
