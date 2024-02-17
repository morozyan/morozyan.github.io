/// <reference path="bacteriummap.ts" />
var BacteriumMapFactory = (function () {
    function BacteriumMapFactory() {
    }
    BacteriumMapFactory.getBacteriumMap = function () {
        if (this.bacteriumMap == null) {
            this.bacteriumMap = new BacteriumMap(20);
        }
        else {
            this.bacteriumMap.clearCells();
            this.bacteriumMap.createMinEnemies();
            this.bacteriumMap.createMainCell();
        }
        return this.bacteriumMap;
    };
    return BacteriumMapFactory;
}());
//# sourceMappingURL=bacteriummapfactory.js.map