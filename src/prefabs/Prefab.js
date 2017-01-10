var Tactics = Tactics || {};

Tactics.Prefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);

    this.game_state = game_state;

    this.name = name;

    this.game_state.groups[properties.group].add(this);
    this.frame = +properties.frame;
    this.anchor.setTo(0.5);

    this.game_state.prefabs[name] = this;
};

Tactics.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Tactics.Prefab.prototype.constructor = Tactics.Prefab;