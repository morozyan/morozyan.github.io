/// <reference path="units/bacteriummapfactory.ts" />
/// <reference path="units/bacteriummap.ts" />
var Game = (function () {
    function Game() {
        this._score = 0;
        this._bacteriumMap = BacteriumMapFactory.getBacteriumMap();
    }
    Game.prototype.doAction = function (actionType) {
        if (this._bacteriumMap.isEnd) {
            return false;
        }
        var point = this._bacteriumMap.calcWorld(actionType);
        this._score += point;
        return point > 0;
    };
    Object.defineProperty(Game.prototype, "score", {
        get: function () {
            return this._score;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "area", {
        get: function () {
            return this._bacteriumMap.area;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "isEnd", {
        get: function () {
            return this._bacteriumMap.isEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "isFreezeMap", {
        get: function () {
            return this._bacteriumMap.isFreezeMap;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
}());
//# sourceMappingURL=game.js.map