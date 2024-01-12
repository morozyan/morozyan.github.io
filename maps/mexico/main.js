import states from './states.js';
import setFeatureLayerStyle from './styles.js';
import setCoatOfArmsClickHandler from './handler.js';

let map;
let featureLayer;

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");

    map = new Map(document.querySelector("#MyMexico"), {
        center: { lat: 21.011806, lng: -101.368917 },
        zoom: 5,
        mapId: "16284e329274360c",
    });

    featureLayer = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");

    setFeatureLayerStyle(featureLayer, states);
    setCoatOfArmsClickHandler(featureLayer, InfoWindow, map);
}

initMap();