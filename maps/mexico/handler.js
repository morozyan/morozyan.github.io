import states from "./states.js";

let infoWindow;

function handleClick(e) {
    let feature = e.features[0];

    if (!feature.placeId) return;
    let state = states[feature.placeId];
    if (state != undefined) {
        createStateInfoWindow(state, e);
    }
}

async function createStateInfoWindow(state, event) {

    let imageUrl = `CoatOfArms/${state.coatOfArms}`;

    let content =
        `<span style="font-size:small">${state.name}<br/>`
        +
        `<img src="${imageUrl}" alt="Coat of arms" /></span>`;
    updateInfoWindow(content, event.latLng);
}

function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
        map,
        shouldFocus: false,
    });
}

let setCoatOfArmsClickHandler = (featureLayer, InfoWindow) => {
    featureLayer.addListener("click", handleClick);
    infoWindow = new InfoWindow({});
};

export default setCoatOfArmsClickHandler;