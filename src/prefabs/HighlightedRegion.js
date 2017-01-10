var Tactics = Tactics || {};

Tactics.HighlightedRegion = function (game_state, name, position, properties) {
    "use strict";
    Tactics.Prefab.call(this, game_state, name, position, properties);

    this.alpha = 0.5;
    this.inputEnabled = true;
    this.events.onInputDown.add(this.select, this);
};

Tactics.HighlightedRegion.prototype = Object.create(Tactics.Prefab.prototype);
Tactics.HighlightedRegion.prototype.constructor = Tactics.HighlightedRegion;

Tactics.HighlightedRegion.prototype.select = function () {
    "use strict";

};