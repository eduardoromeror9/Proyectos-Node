import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js';
import { generarId, generarJWT } from '../helpers/tokens.js';
import Usuario from '../models/Usuario.js';


const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar sesión',
    csrfToken: req.csrfToken()
  });
}

const autenticar = async(req, res) => {
  // Validar
  await check('email').isEmail().withMessage('El email es obligatorio').run(req);
  await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    // Error de validacion
    return res.render('auth/login', {
      pagina: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  const { email, password } = req.body

  // Comprobar que el usuario existe
  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return res.render('auth/login', {
      pagina: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no existe' }],
    })
  }

  // Confirmar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render('auth/login', {
      pagina: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no esta confirmado' }],
    })
  }

  // Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render('auth/login', {
      pagina: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El password es incorrecto' }],
    })
  }

  // Autenticar el usuario
  const token = generarJWT( {id:usuario.id, nombre: usuario.nombre} )
  console.log(token)

  // Almacenar en el cookie
  return res.cookie('_token', token, {
    httpOnly: true,
    // secure: true,
    // sameSite: true,
  }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) => {
  return res.cookie('_token').status(200).redirect('/auth/login')
}


const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crea tu cuenta',
    csrfToken: req.csrfToken()
  })
}

const registrar = async(req, res) => {

  // Validar los datos
  await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('email').isEmail().withMessage('El email no es válido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req);
  await check('repetir_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('El password no coincide');
    } return value }).run(req);


  let resultado = validationResult(req);

  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    // Error de validacion
    return res.render('auth/registro', {
      pagina: 'Crea tu cuenta',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  // Extraer los datos
  const { nombre, email, password } = req.body;

  // Verificar que el usuario no este registrado
  const existeUsuario = await Usuario.findOne({ where : { email } })
  if (existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crea tu cuenta',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario ya existe' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  // Crear el usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  })


  // Enviar el email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })


  // Mostrar mensaje de confirmacion
  res.render('templates/mensaje', {
    pagina: 'Usuario creado correctamente',
    mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace',
  })
}

// Confirmar cuenta
const confirmar = async(req, res) => {
  const { token } = req.params;

  // Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } })

  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error: true
    })
  }

  // Confirmar cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  // await Usuario.update({ confirmado: true }, { where: { id: usuario.id } })


  // Mostrar mensaje de confirmacion
  res.render('auth/confirmar-cuenta', {
    pagina: 'Cuenta confirmada correctamente',
    mensaje: 'Tu cuenta ya esta confirmada',
  })

}


const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Olvide mi password',
    csrfToken: req.csrfToken()
  });
}

const resetPassword = async(req, res) => {
  // Validar los datos
  await check('email').isEmail().withMessage('El email no es válido').run(req)
  let resultado = validationResult(req)

  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    // Error de validacion
    return res.render('auth/olvide-password', {
      pagina: 'Olvide mi password',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    })
  }

  // Buscar el usuario
  const { email } = req.body
  const usuario = await Usuario.findOne({ where: { email } })

  if (!usuario) {
    return res.render('auth/olvide-password', {
      pagina: 'Olvide mi password',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no existe' }]
    })
  }

  // Generar el token y enviar el email
  usuario.token = generarId()
  await usuario.save()

  // Enviar el email
  emailOlvidePassword({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })


  // Renderizar el formulario de reseteo de password
  res.render('templates/mensaje', {
    pagina: 'Enviamos un email para resetear tu password',
    mensaje: 'Hemos enviado un email para resetear tu password, presiona en el enlace',
  })

}

const comprobarToken = async(req, res) => {

  const { token } = req.params
  const usuario = await Usuario.findOne({ where: { token } })

  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al resetear tu password',
      mensaje: 'Hubo un error al resetear tu password, intenta de nuevo',
      error: true
    })
  }

  // Mostrar formulario para modificar password
  res.render('auth/reset-password', {
    pagina: 'Reestablece tu Password',
    csrfToken: req.csrfToken(),
  })

}

const nuevoPassword = async(req, res) => {

  // Validar el password
  await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req)

  let resultado = validationResult(req)

  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    // Error de validacion
    return res.render('auth/reset-password', {
      pagina: 'Reestablece tu Password',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    })
  }

  const { token } = req.params
  const { password } = req.body

  
  // identificar el usuario
  const usuario = await Usuario.findOne({ where: { token } })
  console.log(usuario)
  

  // Hashear el password
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)
  usuario.token = null
  await usuario.save()

  // Mostrar mensaje de confirmacion
  res.render('auth/confirmar-cuenta', {
    pagina: 'Password cambiado correctamente',
    mensaje: 'Tu password ya fue cambiado',
  })

}


export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword
}
