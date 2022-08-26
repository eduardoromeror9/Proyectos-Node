const esVendedor = ( usuaroId, propiedadUsuarioId ) => {

  return usuaroId === propiedadUsuarioId

}

const formatDate = ( date ) => {

  return date.toLocaleDateString( 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}


export {
  esVendedor,
  formatDate

}