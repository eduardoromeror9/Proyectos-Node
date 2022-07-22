(function() {

  const lat = -33.4442865;
  const lng = -70.6538152;
  const mapa = L.map('mapa').setView([lat, lng ], 13);

  let marker;
  

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  // Pin de ubicación
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa)

  // Detectar el ubicación del Pin
  marker.on('moveend', function(e) {
    marker = e.target
    const posicion = marker.getLatLng()
    mapa.panTo(posicion)
    // mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
  })


})()