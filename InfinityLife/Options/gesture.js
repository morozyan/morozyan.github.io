var createGestureListener = function () {

    var tableQuoEl = $$("table");
    tableQuoEl.on("swipeUp", function (ev) {
        actionHandler(ActionType.Up);
    });
    tableQuoEl.on("swipeLeft", function (ev) {
        actionHandler(ActionType.Left);
    });
    tableQuoEl.on("swipeRight", function (ev) {
        actionHandler(ActionType.Right);
    });
    tableQuoEl.on("swipeDown", function (ev) {
        actionHandler(ActionType.Down);
    });
    tableQuoEl.on("touchstart", function (e) {
      e.preventDefault();
    });
}

var baseWindowOnload = window.onload;
window.onload = () => {
    baseWindowOnload();
    createGestureListener();
};