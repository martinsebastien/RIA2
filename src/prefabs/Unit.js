import Phaser from 'phaser'
import Prefab from '../prefabs/Prefab'


export default class Unit extends Prefab {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
        this.unit_class = properties.unit_class;
    }

    load_stats(classes_data) {
        this.stats = Object.create(classes_data[this.unit_class]);

        this.healthbar = this.game_state.game.add.sprite(this.x, this.y - (this.height / 2 + 10), "healthbar_image");
        this.healthbar.scale.setTo(this.stats.health, 1);
        this.moveDuration = Phaser.Timer.SECOND * 0.3;
        this.currentTweens = [];
        this.moving = false;
        this.tweenInProgress = false;

        this.attacked_tween = this.game_state.game.add.tween(this);
        this.attacked_tween.to({ tint: 0xFF0000 }, 200);
        this.attacked_tween.onComplete.add(this.restore_tint, this);

        this.calculate_act_turn(0);
    }

    move_to(position) {
        this.resetCurrentTweens();
        this.game_state.pathfinding.find_path(this.position, position, this.follow_path, this);
    }

    follow_path(path) {
        let next_position, tween, healthbar_moving_tween, index;
        index = 0;

        healthbar_moving_tween = this.game_state.game.tweens.create(this.healthbar);
        path.forEach(position => {
            this.currentTweens.push(this.game.add.tween(this.position).to({ x: position.x, y: position.y }, this.moveDuration));
            healthbar_moving_tween.to({ x: position.x, y: position.y - (this.height / 2 + 10) }, this.moveDuration);
            index++;
        });
        this.moveInPath();
        healthbar_moving_tween.start();
    }

    moveInPath() {
        if (this.currentTweens.length === 0) {
            return;
        }
        let index = 1, me = this;
        this.moving = true;
        moveToNext(this.currentTweens[index]);
        function moveToNext(tween) {
            index++;
            let nextTween = me.currentTweens[index];
            if (nextTween != null) {
                tween.onComplete.add(function () {
                    me.tweenInProgress = false;
                    moveToNext(nextTween);
                });
            } else {
                // if i am the last tween
                tween.onComplete.add(function () {
                    me.onStopMovement();
                });
            }
            tween.start();
            me.faceNextTile(tween);
            me.tweenInProgress = true;
        }
    }

    onStopMovement() {
        this.resetCurrentTweens();
    }

    resetCurrentTweens() {
        var me = this;
        this.currentTweens.map(function (tween) {
            me.game.tweens.remove(tween);
        });
        this.currentTweens = [];
        this.moving = false;
        this.stopAnimation();
    }


    calculate_act_turn(current_turn) {
        this.act_turn = current_turn + Math.ceil(100 / this.stats.speed);
    }

    calculate_damage(target_unit) {
        let damage = this.stats.attack - target_unit.stats.defense;
        console.log(damage);
        return damage;
    }

    receive_damage(damage) {
        console.log(damage);
        this.stats.health -= damage;

        this.healthbar.scale.setTo(this.stats.health, 1);

        if (this.stats.health <= 0) {
            this.kill();
            this.healthbar.kill();
        }
    }

    restore_tint() {
        this.tint = 0xFFFFFF;
    }

    faceNextTile(tween) {

        let isVerticalMovement = tween.properties.y == this.position.y;

        if (isVerticalMovement) {
            if (tween.properties.x > this.position.x) {
                this.walkRight();
            } else {
                this.walkLeft();
            }
        } else {
            if (tween.properties.y > this.position.y) {
                this.walkDown();
            } else {
                this.walkUp();
            }

        }
    }


}