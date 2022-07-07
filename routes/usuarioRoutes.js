import express from 'express';

const router = express.Router();

// Rutas
router.get('/', (req, res) => {
    res.json({ msg: 'Hello World en express'});
})



export default router;