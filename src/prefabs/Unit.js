var Tactics = Tactics || {};

Tactics.Unit = function (game_state, name, position, properties) {
    "use strict";
    Tactics.Prefab.call(this, game_state, name, position, properties);

    this.unit_class = properties.unit_class;
};

Tactics.Unit.prototype = Object.create(Tactics.Prefab.prototype);
Tactics.Unit.prototype.constructor = Tactics.Unit;

Tactics.Unit.prototype.load_stats = function (classes_data) {
    "use strict";
    this.stats = Object.create(classes_data[this.unit_class]);

    this.healthbar = this.game_state.game.add.sprite(this.x, this.y - this.height, "healthbar_image");
    this.healthbar.scale.setTo(this.stats.health, 1);

    this.attacked_tween = this.game_state.game.add.tween(this);
    this.attacked_tween.to({tint: 0xFF0000}, 200);
    this.attacked_tween.onComplete.add(this.restore_tint, this);

    this.calculate_act_turn(0);
};

Tactics.Unit.prototype.move_to = function (position) {
    "use strict";
    this.game_state.pathfinding.find_path(this.position, position, this.follow_path, this);
};

Tactics.Unit.prototype.follow_path = function (path) {
    "use strict";
    var next_position, moving_tween, healthbar_moving_tween;
    moving_tween = this.game_state.game.tweens.create(this);
    healthbar_moving_tween = this.game_state.game.tweens.create(this.healthbar);
    path.forEach(function (position) {
        moving_tween.to({x: position.x, y: position.y}, Phaser.Timer.SECOND * 0.3);
        healthbar_moving_tween.to({x: position.x, y: position.y - this.height}, Phaser.Timer.SECOND * 0.3);
    }, this);
    moving_tween.start();
    healthbar_moving_tween.start();
};

Tactics.Unit.prototype.calculate_act_turn = function (current_turn) {
    "use strict";
    this.act_turn = current_turn + Math.ceil(100 / this.stats.speed);
};

Tactics.Unit.prototype.calculate_damage = function (target_unit) {
    "use strict";
    var random_attack, random_defense, damage;
    random_attack = this.game_state.game.rnd.between(0, this.stats.attack);
    random_defense = this.game_state.game.rnd.between(0, target_unit.stats.defense);
    damage = Math.max(random_attack - random_defense, 0);
    return damage;
};

Tactics.Unit.prototype.receive_damage = function (damage) {
    "use strict";
    this.stats.health -= damage;
    this.healthbar.scale.setTo(this.stats.health, 1);
    if (this.stats.health <= 0) {
        this.kill();
        this.healthbar.kill();
    }
};

Tactics.Unit.prototype.restore_tint = function () {
    "use strict";
    this.tint = 0xFFFFFF;
};