var Tactics = Tactics || {};

Tactics.AttackRegion = function (game_state, name, position, properties) {
    "use strict";
    Tactics.HighlightedRegion.call(this, game_state, name, position, properties);
};

Tactics.AttackRegion.prototype = Object.create(Tactics.HighlightedRegion.prototype);
Tactics.AttackRegion.prototype.constructor = Tactics.AttackRegion;

Tactics.AttackRegion.prototype.select = function () {
    "use strict";
    var target_unit;
    target_unit = this.game_state.find_prefab_in_tile(this.game_state.remote_player + "_units", this.position);
    if (target_unit) {
        this.game_state.send_attack_command(target_unit);
    }
};