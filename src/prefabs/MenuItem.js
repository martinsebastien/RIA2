var Tactics = Tactics || {};

Tactics.MenuItem = function (game_state, name, position, properties) {
    "use strict";
    Tactics.TextPrefab.call(this, game_state, name, position, properties);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.select, this);
    this.anchor.setTo(0);
};

Tactics.MenuItem.prototype = Object.create(Tactics.TextPrefab.prototype);
Tactics.MenuItem.prototype.constructor = Tactics.MenuItem;

Tactics.MenuItem.prototype.select = function () {
    "use strict";
    // the default item does nothing
};