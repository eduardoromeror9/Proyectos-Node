const inicio = (req, res) => {
  res.render('inicio', {
    pagina: 'Inicio',
  })
}


const categoria = (req, res) => {}


const error = (req, res) => {}


const buscador = (req, res) => {}


export {
  inicio,
  categoria,
  error,
  buscador
}