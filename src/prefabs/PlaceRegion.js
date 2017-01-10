var Tactics = Tactics || {};

Tactics.PlaceRegion = function (game_state, name, position, properties) {
    "use strict";
    Tactics.HighlightedRegion.call(this, game_state, name, position, properties);

    this.player = properties.player;
};

Tactics.PlaceRegion.prototype = Object.create(Tactics.HighlightedRegion.prototype);
Tactics.PlaceRegion.prototype.constructor = Tactics.PlaceRegion;

Tactics.PlaceRegion.prototype.select = function () {
    "use strict";
    var current_placed_unit;
    current_placed_unit = this.game_state.find_prefab_in_tile("unit_sprites", this.position);
    if (!current_placed_unit && this.player === this.game_state.local_player) {
        this.game_state.place_unit(this.position);
    }
};