import bcrypt from 'bcrypt'

const usuarios = [
  {
    nombre: 'Eduardo Romero',
    email: 'eduardo@eduardo.com',
    confirmado: 1,
    password: bcrypt.hashSync('password', 10)
  },
  {
    nombre: 'Hector Romero',
    email: 'hector@hector.com',
    confirmado: 1,
    password: bcrypt.hashSync('password', 10)
  }
]

export default usuarios