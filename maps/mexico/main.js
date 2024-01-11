import states from './states.js';

let map;
let featureLayer;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.querySelector("#MyMexico"), {
    center: { lat: 19.434144973754883, lng: -99.13312530517578 },
    zoom: 6,
    mapId: "16284e329274360c", 
  });

  featureLayer = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");

  const visitedStateFeatureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
    fillColor: "#810FCB",
    fillOpacity: 0.5,
  };

  const unvisitedStateFeatureStyleOptions = {
    strokeColor: "#7E7A7F",
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
  };

  featureLayer.style = (options) => {
    let state = states[options.feature.placeId];
    if (state != undefined) {
        if(state.date != undefined){
            return visitedStateFeatureStyleOptions;
        }
        return unvisitedStateFeatureStyleOptions;
    }
  };
}


initMap();