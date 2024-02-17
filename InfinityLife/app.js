/// <reference path="game.ts" />
/// <reference path="units/cell.ts" />
var AppState;
(function (AppState) {
    AppState[AppState["Menu"] = 0] = "Menu";
    AppState[AppState["Game"] = 1] = "Game";
})(AppState || (AppState = {}));
var invisibleClass = "invisible";
var inactiveMenuClass = "inactiveMenu";
var animationOptionsClass = "animationOptions";
var freezeTableClass = "freezeTable";
var bornedCell = "bornedCell";
var dyingEnemyCell = "dyingEnemyCell";
var dyingBonusCell = "dyingBonusCell";
var dyingFreezeCell = "dyingFreezeCell";
var leftMoveMainCell = "leftMoveMainCell";
var rightMoveMainCell = "rightMoveMainCell";
var upMoveMainCell = "upMoveMainCell";
var downMoveMainCell = "downMoveMainCell";
var rowCount = 20;
var bestScore;
var appState;
var game;
var menuDiv;
var newGame;
var resumeGame;
var author;
var help;
var gameDiv;
var pauseDiv;
var endGameDiv;
var newRecordDiv;
var startNewGameDiv;
var gotoMenuDiv;
var getCellClassname = function (cellType) {
    switch (cellType) {
        case CellType.Empty: {
            return "empty";
        }
        case CellType.Main: {
            return "main";
        }
        case CellType.Enemy: {
            return "enemy";
        }
        case CellType.Bonus: {
            return "bonus";
        }
        case CellType.Freeze: {
            return "freeze";
        }
    }
};
var refresh = function (stateIsChanged, actionType) {
    if (game == null) {
        return;
    }
    if (game.isFreezeMap) {
        document.querySelector("table").classList.add(freezeTableClass);
    }
    else {
        document.querySelector("table").classList.remove(freezeTableClass);
    }
    var rows = document.querySelectorAll('tr');
    var enemyCount = 0;
    for (var i = 0; i < rowCount; i++) {
        var tds = rows[i].querySelectorAll('td div');
        for (var j = 0; j < rowCount; j++) {
            var cell = game.area[i][j];
            var classList = tds[j].classList;
            if (CellType.Main == cell.cellType) {
                tds[j].className = "";
                if (stateIsChanged) {
                    switch (actionType) {
                        case ActionType.Left:
                            classList.add(leftMoveMainCell);
                            break;
                        case ActionType.Right:
                            classList.add(rightMoveMainCell);
                            break;
                        case ActionType.Up:
                            classList.add(upMoveMainCell);
                            break;
                        case ActionType.Down:
                            classList.add(downMoveMainCell);
                            break;
                    }
                }
            }
            else {
                var isBornedCell = !classList.contains(getCellClassname(cell.cellType)) && cell.cellType != CellType.Empty;
                var isDyingEnemyCell = (CellType.Empty == cell.cellType) && classList.contains(getCellClassname(CellType.Enemy));
                var isDyingBonusCell = (CellType.Empty == cell.cellType) && classList.contains(getCellClassname(CellType.Bonus));
                var isDyingFreezeCell = (CellType.Empty == cell.cellType) && classList.contains(getCellClassname(CellType.Freeze));
                tds[j].className = "";
                if (isBornedCell) {
                    classList.add(bornedCell);
                }
                if (isDyingEnemyCell) {
                    classList.add(dyingEnemyCell);
                }
                if (isDyingBonusCell) {
                    classList.add(dyingBonusCell);
                }
                if (isDyingFreezeCell) {
                    classList.add(dyingFreezeCell);
                }
            }
            classList.add(animationOptionsClass);
            classList.add(getCellClassname(cell.cellType));
            tds[j].setAttribute("style", "opacity:" + cell.timeToDead / cell.cellType);
            if (cell.cellType == CellType.Enemy)
                enemyCount++;
        }
    }
    document.querySelector("#enemy").textContent = enemyCount.toString();
    document.querySelector("#score").textContent = game.score.toString();
    document.querySelector("#bestScore").textContent = bestScore.toString();
};
var actionHandler = function (actionType) {
    if (appState == AppState.Menu || game == null || game.isEnd) {
        return;
    }
    var stateIsChanged = game.doAction(actionType);
    if (game.isEnd) {
        endGameDiv.className = "";
        if (game.score > bestScore) {
            newRecordDiv.classList.remove(invisibleClass);
            bestScore = game.score;
            newRecordDiv.textContent = "New record " + bestScore.toString();
            window.localStorage.setItem("bestScore", (game.score + 1).toString());
        }
        else {
            newRecordDiv.classList.add(invisibleClass);
        }
    }
    refresh(stateIsChanged, actionType);
};
var keyPressListener = function (event) {
    var actionType;
    switch (event.keyCode) {
        case 87:
            {
                actionType = ActionType.Up;
            }
            break;
        case 65:
            {
                actionType = ActionType.Left;
            }
            break;
        case 83:
            {
                actionType = ActionType.Down;
            }
            break;
        case 68:
            {
                actionType = ActionType.Right;
            }
            break;
        case 38:
            {
                actionType = ActionType.Up;
            }
            break;
        case 37:
            {
                actionType = ActionType.Left;
            }
            break;
        case 40:
            {
                actionType = ActionType.Down;
            }
            break;
        case 39:
            {
                actionType = ActionType.Right;
            }
            break;
        default: {
            return;
        }
    }
    actionHandler(actionType);
};
var menuClick = function () {
    var self = this;
    switch (appState) {
        case AppState.Menu:
            {
                if (self.id == "newGame") {
                    game = new Game();
                }
                else if (game == null) {
                    return;
                }
                appState = AppState.Game;
                menuDiv.classList.add(invisibleClass);
                gameDiv.className = "";
                resumeGame.className = "";
            }
            break;
        case AppState.Game:
            {
                endGameDiv.classList.add(invisibleClass);
                appState = AppState.Menu;
                gameDiv.classList.add(invisibleClass);
                menuDiv.className = "";
                if (game.isEnd) {
                    resumeGame.classList.add(inactiveMenuClass);
                }
            }
            break;
    }
    refresh();
};
var newGameClick = function () {
    endGameDiv.classList.add(invisibleClass);
    game = new Game();
    refresh();
};
var createTable = function () {
    var tableBody = document.querySelector("tbody");
    for (var i = 0; i < rowCount; i++) {
        var tableRow = document.createElement("tr");
        tableBody.appendChild(tableRow);
        for (var j = 0; j < rowCount; j++) {
            var tdRow = document.createElement("td");
            tableRow.appendChild(tdRow);
            var divTd = document.createElement("div");
            tdRow.appendChild(divTd);
            divTd.classList.add(animationOptionsClass);
        }
    }
};
window.onload = function () {
    createTable();
    appState = AppState.Menu;
    menuDiv = document.querySelector("#menu");
    gameDiv = document.querySelector("#game");
    newGame = document.querySelector("#newGame");
    resumeGame = document.querySelector("#resumeGame");
    author = document.querySelector("#author");
    help = document.querySelector("#help");
    pauseDiv = document.querySelector("#pause");
    endGameDiv = document.querySelector("#endGame");
    newRecordDiv = document.querySelector("#newRecord");
    startNewGameDiv = document.querySelector("#startNewGame");
    gotoMenuDiv = document.querySelector("#gotoMenu");
    resumeGame.classList.add(inactiveMenuClass);
    gameDiv.classList.add(invisibleClass);
    endGameDiv.classList.add(invisibleClass);
    newGame.addEventListener("click", menuClick, false);
    pauseDiv.addEventListener("click", menuClick, false);
    resumeGame.addEventListener("click", menuClick, false);
    gotoMenuDiv.addEventListener("click", menuClick, false);
    startNewGameDiv.addEventListener("click", newGameClick, false);
    addEventListener("keydown", keyPressListener, false);
    bestScore = window.localStorage.getItem("bestScore") == null ? 0 : window.localStorage.getItem("bestScore");
};
//# sourceMappingURL=app.js.map