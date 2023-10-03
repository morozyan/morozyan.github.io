mapboxgl.accessToken = 'pk.eyJ1IjoibW9yb3p5YW4iLCJhIjoiY2xtbG9pejdkMGN0dzJqbXd2bTVzZzVoaSJ9.jYAn1Xi2o3bZ20bpohSbdg';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-103.34872062829716, 20.672494028475253], // starting position [lng, lat]
    zoom: 11 // starting zoom
});

map.on('click', (e) => {
    console.log(`A click event has occurred at ${e.lngLat}`);
});

export default map;