var Tactics = Tactics || {};

Tactics.CommandItem = function (game_state, name, position, properties) {
    "use strict";
    Tactics.MenuItem.call(this, game_state, name, position, properties);

    this.callback = properties.callback;
};

Tactics.CommandItem.prototype = Object.create(Tactics.MenuItem.prototype);
Tactics.CommandItem.prototype.constructor = Tactics.CommandItem;

Tactics.CommandItem.prototype.select = function () {
    "use strict";
    //this.game_state.prefabs.menu.show(false);
    this.game_state[this.callback].call(this.game_state);
};