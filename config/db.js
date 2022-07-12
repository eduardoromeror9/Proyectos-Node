import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// leer el archivo .env
dotenv.config({ path: '.env' });


// crear la conexion a la base de datos
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '', {
  host: process.env.BD_HOST,
  port: 3306,
  dialect: 'mysql',
  define: {
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

export default db;