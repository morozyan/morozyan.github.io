mapboxgl.accessToken = 'pk.eyJ1IjoibW9yb3p5YW4iLCJhIjoiY2xtbG9pejdkMGN0dzJqbXd2bTVzZzVoaSJ9.jYAn1Xi2o3bZ20bpohSbdg';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-103.34872062829716, 20.672494028475253], // starting position [lng, lat]
    zoom: 11 // starting zoom
});

let buffer = [];

map.on('click', (e) => {
    let coordinates = e.lngLat.toArray();
    let id = coordinates[0].toString()+coordinates[1].toString();
    buffer.push(coordinates);

    e.target.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                // These coordinates outline Maine.
                'coordinates': coordinates
            }
        }
    });

    // Add a new layer to visualize the polygon.
    e.target.addLayer({
        'id': id,
        'type': 'circle',
        'source': id, // reference the data source
        'layout': {},
        'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222'
        }
    });
});

document.addEventListener("keyup", function (event) {
    if (" "==event.key) {
        buffer.forEach(arr => console.log(`[${arr}],`))
        buffer=[];
    }
});


export default map;