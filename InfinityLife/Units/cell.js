var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 1] = "Empty";
    CellType[CellType["Main"] = 2] = "Main";
    CellType[CellType["Enemy"] = 3] = "Enemy";
    CellType[CellType["Bonus"] = 4] = "Bonus";
    CellType[CellType["Freeze"] = 5] = "Freeze";
})(CellType || (CellType = {}));
var Cell = (function () {
    function Cell(cellType) {
        this.cellType = cellType;
    }
    Object.defineProperty(Cell.prototype, "cellType", {
        get: function () {
            return this._cellType;
        },
        set: function (value) {
            this._timeToDead = value;
            this._cellType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "timeToDead", {
        get: function () {
            return this._timeToDead;
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.decrease = function () {
        if (this._timeToDead > 0 && CellType.Main != this._cellType && CellType.Empty != this._cellType) {
            this._timeToDead--;
            if (this._timeToDead == 0) {
                this.cellType = CellType.Empty;
            }
        }
    };
    return Cell;
}());
//# sourceMappingURL=cell.js.map