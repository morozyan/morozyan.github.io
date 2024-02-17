var haveEvents = 'ongamepadconnected' in window;
var controllers = {};
var buttonPressCount = [0, 0, 0, 0];
var buttonPressIndex = [0, 0, 0, 0];
var axePressCount = [0, 0, 0, 0];
var axePressIndex = [0, 0, 0, 0];

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;

    requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    delete controllers[gamepad.index];
}


function setAction(leftStickValue, j) {
    var actions = [ActionType.Left, ActionType.Right, ActionType.Up, ActionType.Down];
    var offset = Math.pow(-1,j+1)*0.75;
    var val = (offset < 0 && leftStickValue < offset || offset > 0 && leftStickValue > offset);
    if (val && axePressCount[j] == axePressIndex[j]) {
        axePressCount[j]++;
        actionHandler(actions[j]);
    } else if (!val && axePressCount[j] > axePressIndex[j]) {
        axePressIndex[j]++;
    }
}
function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];
        for (i = 0; i < controller.buttons.length; i++) {
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof (val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }
            
            if (pressed) {
                if (i < 4 && buttonPressCount[i] == buttonPressIndex[i]) {
                    buttonPressCount[i]++;
                    var actionType;
                    if (i == 0) {
                        actionType = ActionType.Down;
                    } else if (i == 1) {
                        actionType = ActionType.Right;
                    } else if (i == 2) {
                        actionType = ActionType.Left;
                    } else if (i == 3) {
                        actionType = ActionType.Up;
                    }
                    actionHandler(actionType);
                }
            } else {
                if (i < 4 && buttonPressCount[i] > buttonPressIndex[i]) {
                    buttonPressIndex[i]++;
                }
            }
        }

        for (i = 0; i < controller.axes.length; i++) {
            if (i < 2) {
                var leftStickValue = controller.axes[i];
                setAction(leftStickValue, 2*i+1);
                setAction(leftStickValue, 2*i);
            }
        }
    }
    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in controllers) {
                controllers[gamepads[i].index] = gamepads[i];
            } else {
                addgamepad(gamepads[i]);
            }
        }
    }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
    setInterval(scangamepads, 500);
}