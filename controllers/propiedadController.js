import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin = async(req, res) => {

  const { id } = req.usuario

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id
    }
  })

  res.render('propiedades/admin', {
    pagina: 'Mis Propiedades',
    propiedades
  })
}


// Formulario para crear una propiedad
const crear = async (req, res) => {

  // Consultar modelo de precio y categorias
  const [ categorias, precios ] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crear', {
    pagina: 'Crear Propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  })
}

const guardar = async (req, res) => {

  // Validacion
  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {

    // Consultar modelo de precio y categorias
    const [ categorias, precios ] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    return res.render('propiedades/crear', {
      pagina: 'Crear Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    })
  }

  // Crear el registro
  const { 
    titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId
  } = req.body

  const { id: usuarioId } = req.usuario

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: ''
    })

    const { id } = propiedadGuardada

    res.redirect(`/propiedades/agregar-imagen/${id}`)
    
  } catch (error) {
    console.log(error)
  }

}

const agregarImagen = async (req, res) => {

  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que el usuario sea el dueño de la propiedad
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen a: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad
  })
}

const almacenarImagen = async (req, res, next) => {
  
  const { id } = req.params
  
  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }
  
  // Validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }
  
  // Validar que el usuario sea el dueño de la propiedad
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  try {
    // console.log(req.file)

    // Almacenar la imagen y publicar la propiedad
    propiedad.imagen = req.file.filename
    propiedad.publicado = 1
    await propiedad.save()

    next()
    
  } catch (error) {
    console.log(error)
  }
  
  
}


export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen
}