var Tactics = Tactics || {};

Tactics.Menu = function (game_state, name, position, properties) {
    "use strict";
    var live_index, life;
    Tactics.Prefab.call(this, game_state, name, position, properties);

    this.anchor.setTo(0);
    this.menu_items = [];
    this.show(false);
};

Tactics.Menu.prototype = Object.create(Tactics.Prefab.prototype);
Tactics.Menu.prototype.constructor = Tactics.Menu;

Tactics.Menu.prototype.add_item = function (item) {
    "use strict";
    this.menu_items.push(item);
    item.visible = this.visible;
};

Tactics.Menu.prototype.show = function (show) {
    "use strict";
    this.visible = show;
    this.menu_items.forEach(function (menu_item) {
        menu_item.visible = show;
    }, this);
};