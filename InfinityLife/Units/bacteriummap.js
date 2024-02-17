/// <reference path="cell.ts" />
/// <reference path="../helpers.ts" />
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Left"] = 0] = "Left";
    ActionType[ActionType["Up"] = 1] = "Up";
    ActionType[ActionType["Down"] = 2] = "Down";
    ActionType[ActionType["Right"] = 3] = "Right";
})(ActionType || (ActionType = {}));
var BacteriumMap = (function () {
    function BacteriumMap(_length) {
        this.turnPoint = 1;
        this.bonusMaxCount = 5;
        this.freezeMaxCount = 3;
        this._length = _length;
        //создание всей карты
        this._area = new Array(this._length);
        for (var i = 0; i < this._length; i++) {
            this._area[i] = new Array(this._length);
            for (var j = 0; j < this._length; j++) {
                this._area[i][j] = new Cell(CellType.Empty);
            }
        }
        this._freezeCounter = 0;
        //создание врагов
        this.createMinEnemies();
        this.createMainCell();
    }
    Object.defineProperty(BacteriumMap.prototype, "isEnd", {
        get: function () {
            var mainCellCoords = this.getMainCoords();
            return (mainCellCoords.x == -1 && mainCellCoords.y == -1);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BacteriumMap.prototype, "isFreezeMap", {
        get: function () {
            return this._freezeCounter > 0;
        },
        enumerable: true,
        configurable: true
    });
    BacteriumMap.prototype.calcWorld = function (actionType) {
        var mainCellCoords = this.getMainCoords();
        if (this.isEnd) {
            return -1;
        } // если конец игры
        switch (actionType) {
            case ActionType.Left:
                {
                    if (mainCellCoords.x == 0) {
                        return 0;
                    }
                }
                break;
            case ActionType.Up:
                {
                    if (mainCellCoords.y == 0) {
                        return 0;
                    }
                }
                break;
            case ActionType.Down:
                {
                    if (mainCellCoords.y == this._length - 1) {
                        return 0;
                    }
                }
                break;
            case ActionType.Right:
                {
                    if (mainCellCoords.x == this._length - 1) {
                        return 0;
                    }
                }
                break;
        }
        if (this._freezeCounter == 0)
            this.cellDivision();
        if (this._freezeCounter == 0)
            this.createBonuses();
        if (this._freezeCounter == 0)
            this.createFreezes();
        var points = this.doAction(actionType);
        if (this._freezeCounter == 0)
            this.createMinEnemies();
        if (this._freezeCounter > 0) {
            this._freezeCounter--;
        }
        return points + this.turnPoint;
    };
    BacteriumMap.prototype.getMainCoords = function () {
        for (var i = 0; i < this._length; i++) {
            for (var j = 0; j < this._length; j++) {
                if (this._area[i][j].cellType == CellType.Main) {
                    return { x: j, y: i };
                }
            }
        }
        return { x: -1, y: -1 };
    };
    BacteriumMap.prototype.killEnemy = function (x, y, power) {
        var killedCount = 0; //todo
        for (var i = 0; i < this._length; i++) {
            if (i == y || i == x)
                continue;
            if (this._area[i][x].cellType == CellType.Enemy)
                killedCount++;
            if (this._area[y][i].cellType == CellType.Enemy)
                killedCount++;
            this._area[i][x].cellType = CellType.Empty;
            this._area[y][i].cellType = CellType.Empty;
        }
        //todo
        if (power > 1) {
            if (x > 0) {
                for (var i = 0; i < this._length; i++) {
                    if (this._area[i][x - 1].cellType == CellType.Enemy)
                        killedCount++;
                    this._area[i][x - 1].cellType = CellType.Empty;
                }
            }
            if (y > 0) {
                for (var i = 0; i < this._length; i++) {
                    if (this._area[y - 1][i].cellType == CellType.Enemy)
                        killedCount++;
                    this._area[y - 1][i].cellType = CellType.Empty;
                }
            }
            if (x + 1 != this._length) {
                for (var i = 0; i < this._length; i++) {
                    if (this._area[i][x + 1].cellType == CellType.Enemy)
                        killedCount++;
                    this._area[i][x + 1].cellType = CellType.Empty;
                }
            }
            if (y + 1 != this._length) {
                for (var i = 0; i < this._length; i++) {
                    if (this._area[y + 1][i].cellType == CellType.Enemy)
                        killedCount++;
                    this._area[y + 1][i].cellType = CellType.Empty;
                }
            }
        }
        return killedCount;
    };
    BacteriumMap.prototype.doAction = function (actionType) {
        var points = 0;
        var mainCellCoords = this.getMainCoords();
        if (mainCellCoords.x == -1 && mainCellCoords.y == -1) {
            return 0;
        }
        var y;
        var x;
        var nextCell;
        switch (actionType) {
            case ActionType.Left:
                {
                    y = mainCellCoords.y;
                    x = mainCellCoords.x - 1;
                }
                break;
            case ActionType.Up:
                {
                    y = mainCellCoords.y - 1;
                    x = mainCellCoords.x;
                }
                break;
            case ActionType.Down:
                {
                    y = mainCellCoords.y + 1;
                    x = mainCellCoords.x;
                }
                break;
            case ActionType.Right:
                {
                    y = mainCellCoords.y;
                    x = mainCellCoords.x + 1;
                }
                break;
        }
        nextCell = this._area[y][x];
        if (nextCell.cellType != CellType.Enemy) {
            if (nextCell.cellType == CellType.Bonus) {
                points = this.killEnemy(x, y, nextCell.timeToDead);
            }
            else if (nextCell.cellType == CellType.Freeze) {
                this._freezeCounter = nextCell.timeToDead;
            }
            nextCell.cellType = CellType.Main;
        }
        this._area[mainCellCoords.y][mainCellCoords.x].cellType = CellType.Empty;
        return points;
    };
    BacteriumMap.prototype.createBonuses = function () {
        var bonusCount = this._area.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.filter(function (c) { return c.cellType == CellType.Bonus; }).length;
        }, 0);
        var newBonusCount = this.bonusMaxCount - bonusCount;
        while (newBonusCount > 0) {
            if (getRandomIntNumber(0, 2) == 1) {
                var index = getRandomIntNumber(0, this._length * this._length);
                if (this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType == CellType.Empty) {
                    this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType = CellType.Bonus;
                    bonusCount++;
                }
            }
            newBonusCount--;
        }
    };
    BacteriumMap.prototype.createFreezes = function () {
        var freezeCount = this._area.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.filter(function (c) { return c.cellType == CellType.Freeze; }).length;
        }, 0);
        var newFreezeCount = this.freezeMaxCount - freezeCount;
        while (newFreezeCount > 0) {
            if (getRandomIntNumber(0, 2) == 1) {
                var index = getRandomIntNumber(0, this._length * this._length);
                if (this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType == CellType.Empty) {
                    this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType = CellType.Freeze;
                    freezeCount++;
                }
            }
            newFreezeCount--;
        }
    };
    BacteriumMap.prototype.cellDivision = function () {
        var _this = this;
        this._notNull = 0;
        var newCells = [];
        //--------------
        var x;
        var y;
        for (var i = 0; i < this._length; i++) {
            for (var j = 0; j < this._length; j++) {
                if (newCells.length == 0 || newCells.filter(function (el) { return el == _this._area[i][j]; }).length == 0) {
                    if (this._area[i][j].cellType != CellType.Empty) {
                        this._area[i][j].decrease();
                    }
                    if (this._area[i][j].cellType == CellType.Enemy) {
                        x = getRandomIntNumber(j - 1, j + 2);
                        y = getRandomIntNumber(i - 1, i + 2);
                        if (x >= 0 && x < this._length && y >= 0 && y < this._length && this._area[y][x].cellType != CellType.Enemy) {
                            this._area[y][x].cellType = CellType.Enemy; //l;
                            newCells.push(this._area[y][x]);
                        }
                    }
                }
            }
        }
        this._notNull = this._area.filter(function (o) { return o.filter(function (c) { return c.cellType != CellType.Empty; }).length != 0; }).length;
    };
    Object.defineProperty(BacteriumMap.prototype, "area", {
        get: function () {
            return this._area;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BacteriumMap.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BacteriumMap.prototype, "notNull", {
        get: function () {
            return this._notNull;
        },
        enumerable: true,
        configurable: true
    });
    BacteriumMap.prototype.clearCells = function () {
        for (var i = 0; i < this._length; i++) {
            for (var j = 0; j < this._length; j++) {
                this._area[i][j].cellType = CellType.Empty;
            }
        }
    };
    BacteriumMap.prototype.createMinEnemies = function () {
        //создание 5 первых бактерий 
        var enemiesCount = this._area.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.filter(function (c) { return c.cellType == CellType.Enemy; }).length;
        }, 0);
        var index;
        for (var i = enemiesCount; i < 5; i++) {
            index = getRandomIntNumber(0, this._length * this._length);
            while (this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType != CellType.Empty) {
                index = getRandomIntNumber(0, this._length * this._length);
            }
            this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType = CellType.Enemy;
        }
    };
    BacteriumMap.prototype.createMainCell = function () {
        while (this._area.filter(function (o) { return o.filter(function (c) { return c.cellType == CellType.Main; }).length != 0; }).length == 0) {
            var index = getRandomIntNumber(0, this._length * this._length);
            if (this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType == CellType.Empty) {
                this._area[(index >= this._length) ? Math.floor(index / this._length) : index][index % this._length].cellType = CellType.Main;
            }
        }
    };
    return BacteriumMap;
}());
//# sourceMappingURL=bacteriummap.js.map