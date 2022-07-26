import Propiedad from './Propiedad.js'
import Precio    from './Precio.js'
import Categoria from './Categoria.js'
import Usuario   from './Usuario.js'


Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'}) // Se puede pasar sin la ForeignKey, igual le pasaria elnombre (categoriaId)
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})



export {
  Propiedad,
  Precio,
  Categoria,
  Usuario
}