let setFeatureLayerStyle = (featureLayer, states) => {

    const visitedStateFeatureStyleOptions = {
        strokeColor: "#810FCB",
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: "#810FCB",
        fillOpacity: 0.5,
    };

    const unvisitedStateFeatureStyleOptions = {
        strokeColor: "#810FCB",
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
    };

    featureLayer.style = (options) => {
        let state = states[options.feature.placeId];
        if (state != undefined) {
            if (state.date != undefined) {
                return visitedStateFeatureStyleOptions;
            }
            return unvisitedStateFeatureStyleOptions;
        }
    };
}

export default setFeatureLayerStyle;