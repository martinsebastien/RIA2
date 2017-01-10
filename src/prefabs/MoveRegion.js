var Tactics = Tactics || {};

Tactics.MoveRegion = function (game_state, name, position, properties) {
    "use strict";
    Tactics.HighlightedRegion.call(this, game_state, name, position, properties);
};

Tactics.MoveRegion.prototype = Object.create(Tactics.HighlightedRegion.prototype);
Tactics.MoveRegion.prototype.constructor = Tactics.MoveRegion;

Tactics.MoveRegion.prototype.select = function () {
    "use strict";
    var player1_unit, player2_unit;
    player1_unit = this.game_state.find_prefab_in_tile("player1_units", this.position);
    player2_unit = this.game_state.find_prefab_in_tile("player2_units", this.position);
    if (!player1_unit && !player2_unit) {
        this.game_state.send_move_command(this.position);
    }
};