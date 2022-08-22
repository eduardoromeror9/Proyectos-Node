(function() {
  const lat = -33.4442865;
  const lng = -70.6538152;
  const mapa = L.map('mapa-inicio').setView([lat, lng ], 12)

  let markers = new L.FeatureGroup().addTo(mapa)

  let propiedades = []

  // Filtros 
  const filtros = {
    categoria: '',
    precio: ''
  }

  const categoriasSelect = document.querySelector('#categorias')
  const preciosSelect = document.querySelector('#precios')

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);


  // Filtrado de categorias y precios
  categoriasSelect.addEventListener('change', e => {
    filtros.categoria = +e.target.value
    filtrarPropiedades()
  })

  preciosSelect.addEventListener('change', e => {
    filtros.precio = +e.target.value
    filtrarPropiedades()
  })


  const obtenerPropiedades = async() => {

    try {

      const url = '/api/propiedades'
      const respuesta = await fetch(url)
      propiedades = await respuesta.json()

      mostrarPropiedades(propiedades)
      // console.log(`${propiedades.length} propiedades encontradas`)
      
    } catch (error) {
      console.log(error);
    }
  }

  const mostrarPropiedades = propiedades => {

    // Limpiar los markers previos
    markers.clearLayers()
    
    propiedades.forEach(propiedad => {
      // Agregar los pines en el mapaInicio
      const marker = new L.marker([ propiedad?.lat, propiedad?.lng ], {
        autoPan: true,
      })
      .addTo(mapa)
      .bindPopup(`
        <h1 class="font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
        <img class="w-full" src="/uploads/${propiedad?.imagen}" alt="Imagen propiedad ${propiedad.titulo}">
        <p class="text-gray-700 text-base mt-5">${propiedad?.descripcion}</p>
        <p ></p>Precio: <span class="font-bold">${propiedad.precio.nombre}</span></p>
        <p ></p>Tipo: <span class="font-bold">${propiedad.categoria.nombre}</span></p>
        <a class="bg-indigo-600 block p-2 text-center font-bold uppercase rounded" href="/propiedad/${propiedad.id}">Ver Propiedad</a>
      `)

      markers.addLayer(marker)
    })

  }

  const filtrarPropiedades = () => {
    const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )
    mostrarPropiedades(resultado)
  }

  const filtrarCategoria = propiedad => {
    return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
  }

  const filtrarPrecio = propiedad => {
    return filtros.precio ? propiedad.precioId === filtros.precio : propiedad
  }

  obtenerPropiedades()
  
})()