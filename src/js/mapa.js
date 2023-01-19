(function () {
    const lat = 14.0585797;
    const lng = -87.2439907;
    const mapa = L.map('mapa').setView([lat, lng], 18);

    let marker;

    //Utilizar Provider y Geocoder para obtener la informacion de las calles
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    //el pin
    marker = new L.marker(
        { lat, lng },
        {
            draggable: true /* mover el pin */,
            autoPan: true /* despues de mover el pin se vuelve a centrar el mapa */,
        }
    ).addTo(mapa);

    //detectar el movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target;

        const posicion = marker.getLatLng();

        //centrar el mapa
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        //obtener la informacion de la calle al soltar el pin
        geocodeService
            .reverse()
            .latlng(posicion, 13)
            .run(function (error, resultado) {
                //agregar un globo con la informacion de la posicion
                marker.bindPopup(resultado.address.LongLabel);

                //llenar los campos ocultos de la calle , lat y lng
                document.querySelector('.calle').textContent =
                    resultado?.address?.Address ?? '';

                document.querySelector('#calle').value =
                    resultado?.address?.Address ?? '';

                document.querySelector('#lat').value =
                    resultado?.latlng?.lat ?? '';

                document.querySelector('#lng').value =
                    resultado?.latlng?.lng ?? '';
            });
    });
})();
