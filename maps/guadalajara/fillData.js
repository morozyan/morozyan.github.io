let fillData = (map, areas) => {
    map.on('load', () => {

        areas.forEach(area => {
            // Add a data source containing GeoJSON data.
            map.addSource(area.id, {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        // These coordinates outline Maine.
                        'coordinates': [area.coordinates]
                    }
                }
            });

            // Add a new layer to visualize the polygon.
            map.addLayer({
                'id': area.id,
                'type': 'fill',
                'source': area.id, // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': '#805d47',
                    'fill-opacity': 0.5
                }
            });

        })

    });
};

export default fillData;