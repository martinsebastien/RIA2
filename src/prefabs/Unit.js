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
        // We reset all animations and stop them if one is running
        this.resetCurrentTweens();
        // We calculate the path that the sprite has to follow
        this.game_state.pathfinding.find_path(this.position, position, this.follow_path, this);
    }

    follow_path(path) {
        let next_position, tween, healthbar_moving_tween;

        healthbar_moving_tween = this.game_state.game.tweens.create(this.healthbar);
        // For each position calculated in the pathfinding function
        path.forEach(position => {
            // We put a tween with the properties of the current position in an array
            this.currentTweens.push(this.game.add.tween(this.position).to({ x: position.x, y: position.y }, this.moveDuration));
            // We set the tweens for the healthbar
            healthbar_moving_tween.to({ x: position.x, y: position.y - (this.height / 2 + 10) }, this.moveDuration);
        });

        // Then we call the moveInPath function that will initialize the movement of the sprite
        this.moveInPath();
        // We move the health sprite
        healthbar_moving_tween.start();
    }

    moveInPath() {
        // If there is no tweens, we don't need to move the sprite
        if (this.currentTweens.length === 0) {
            return;
        }
        let index = 1, me = this;
        // We initialise the statut of the sprite as moving
        this.moving = true;
        // We call the function that makes the sprite moves to the next position
        moveToNext(this.currentTweens[index]);

        // The function that makes the magic happen
        function moveToNext(tween) {
            index++;
            let nextTween = me.currentTweens[index];
            // If this is not the last tween
            if (nextTween != null) {
                // When the current tween is complete
                tween.onComplete.add(function () {
                    // We can start the next tween
                    me.tweenInProgress = false;
                    moveToNext(nextTween);
                });
            } else {
                // if i am the last tween
                tween.onComplete.add(function () {
                    me.onStopMovement();
                });
            }
            // We start the current tween
            tween.start();
            // We make the sprite to face the correct direction
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
        // We initialise a boolean variable to know if the sprite is moving vertically or not
        let isVerticalMovement = tween.properties.y == this.position.y;

        //If that is a vertical movement
        if (isVerticalMovement) {
            // We look if the sprite is moving down or up
            if (tween.properties.x > this.position.x) {
                // And we run the correct animation
                this.walkRight();
            } else {
                this.walkLeft();
            }
        } else {
            // Else it's moving horizontally
            if (tween.properties.y > this.position.y) {
                this.walkDown();
            } else {
                this.walkUp();
            }

        }
    }


}