let map;
//@ts-ignore
let featureLayer;

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.querySelector("#MyMexico"), {
    center: { lat: 19.434144973754883, lng: -99.13312530517578 },
    zoom: 6,
    // In the cloud console, configure this Map ID with a style that enables the
    // "Locality" feature layer.
    mapId: "16284e329274360c", // <YOUR_MAP_ID_HERE>,
  });
  //@ts-ignore
  featureLayer = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");

  // Define a style with purple fill and border.
  //@ts-ignore
  const featureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
    fillColor: "#810FCB",
    fillOpacity: 0.5,
  };

  // Apply the style to a single boundary.
  //@ts-ignore
  featureLayer.style = (options) => {
    if (options.feature.placeId == "ChIJb05i1OtAH4QRU0obWqOw_qA") {
      // Hana, HI
      return featureStyleOptions;
    }
  };
}
