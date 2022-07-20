import nodemailer from 'nodemailer';


const emailRegistro = async (datos) => {

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  
  const { email, nombre, token } = datos

  // Enviar el email
  await transport.sendMail({
    from: 'bienesraices.com',
    to: email,
    subject: 'Confirma tu cuenta de bienesraices.com',
    text: 'Confirma tu cuenta de bienesraices.com',
    html: `
      <p>Hola ${nombre}, confirma tu cuenta en bienesraices.com</p>
      
      <p>Tu cuenta ya esta lista, solo tienes que confirmarla en el siguiente enlace:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a> </p>

      <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
      
      `
  })

}

const emailOlvidePassword = async (datos) => {

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  
  const { email, nombre, token } = datos

  // Enviar el email
  await transport.sendMail({
    from: 'bienesraices.com',
    to: email,
    subject: 'Reestablece tu password de bienesraices.com',
    text: 'Reestablece tu password de bienesraices.com',
    html: `
      <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesraices.com</p>
      
      <p>Click en el siguiente enlace para reestablecer tu password:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablece Password</a> </p>

      <p>Si no solicitaste el cambio de password puedes ignorar el mensaje</p>
      
      `
  })

}



export {
  emailRegistro,
  emailOlvidePassword
}
