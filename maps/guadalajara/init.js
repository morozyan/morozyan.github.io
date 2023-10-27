mapboxgl.accessToken = 'pk.eyJ1IjoibW9yb3p5YW4iLCJhIjoiY2xtbG9pejdkMGN0dzJqbXd2bTVzZzVoaSJ9.jYAn1Xi2o3bZ20bpohSbdg';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/morozyan/clo84qyo400o401qxgea14jz3', // style URL
    center: [-103.34872062829716, 20.672494028475253], // starting position [lng, lat]
    zoom: 11, // starting zoom
    maxBounds:[
        [-103.50617948537355,20.500299755571675],
        [-103.17914597913854,20.77067939179409],
    ]
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
    if (" " == event.key) {
        let collector = "";
        buffer.forEach(arr => collector += `[${arr}],\n`);
        console.log(collector);

        buffer = [];
    }
});


export default map;
