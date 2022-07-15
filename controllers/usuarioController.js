import { check, validationResult } from 'express-validator';
import { emailRegistro } from '../helpers/emails.js';
import { generarId } from '../helpers/tokens.js';
import Usuario from '../models/Usuario.js';



const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar sesión'
  });
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crea tu cuenta'
  });
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

  //* Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    // Error de validacion
    return res.render('auth/registro', {
      pagina: 'Crea tu cuenta',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }

  // Extraer los datos
  const { nombre, email, password } = req.body;

  // Verificar que el usuario no este registrado
  const existeUsuario = await Usuario.findOne({ where : { email } })
  if (existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crea tu cuenta',
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
  });



  // Mostrar mensaje de confirmacion
  res.render('templates/mensaje', {
    pagina: 'Usuario creado correctamente',
    mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace',
  })
}

// Confirmar cuenta
const confirmar = (req, res) => {
  const { token } = req.params;
  console.log(token);
}


const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Olvide mi password'
  });
}


export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword
}
