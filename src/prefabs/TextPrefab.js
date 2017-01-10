class TextPrefab {

    constructor (game_state, name, position, properties) {

    }
}

        Tactics.TextPrefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text, properties.style);

    this.game_state = game_state;

    this.name = name;

    this.game_state.groups[properties.group].add(this);

    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }

    this.game_state.prefabs[name] = this;
};

Tactics.TextPrefab.prototype = Object.create(Phaser.Text.prototype);
Tactics.TextPrefab.prototype.constructor = Tactics.TextPrefab;