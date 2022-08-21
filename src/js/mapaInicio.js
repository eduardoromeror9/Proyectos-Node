(function() {
  const lat = -33.4442865;
  const lng = -70.6538152;
  const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);
  
})()