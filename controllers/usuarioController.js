import { check, validationResult } from 'express-validator';
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
  await check('nombre', 'el nombre es obligatorio ').notEmpty().run(req)
  await check('email', 'el email es obligatorio ').isEmail().run(req)
  await check('password', 'el password tiene que ser de 6 caracteres minimo ').isLength({ min: 6 }).run(req)
  await check('repetir_password', 'los password tienen que ser iguales').equals('password').run(req)

  let resultado = validationResult(req);

  // Verificar que el resultado este vacio



  res.json(resultado.array());

  const usuario = await Usuario.create(req.body);
  res.json(usuario);
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
  formularioOlvidePassword
}
