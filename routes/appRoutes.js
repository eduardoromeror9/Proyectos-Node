import express from 'express'
import { inicio, categoria, error, buscador } from '../controllers/appControllers.js'


const router = express.Router()


// Pagina de Inicio
router.get('/', inicio)


// Categorias
router.get('/categorias/:id', categoria)


// Pagina 404
router.get('/404', error)


// Buscador
router.post('/buscador', buscador)


export default router