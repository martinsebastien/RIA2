import Phaser from 'phaser'

export default class Prefab extends Phaser.Sprite {

    constructor(game_state, name, position, properties) {
        super(game_state.game, position.x, position.y, properties.texture);

        let list_hero = ["player2_dragon_unit", "player2_blaster_unit", "player2_mage_unit", "player2_assassin_unit",
            "player1_dragon_unit", "player1_blaster_unit", "player1_mage_unit", "player1_assassin_unit"];

        this.game_state = game_state;

        this.name = name;
        this.game_state.groups[properties.group].add(this);
        this.frame = +properties.frame;

        for (let i = 0; i < list_hero.length; i++) {
            if (this.name == list_hero[i]) {
                this.anchor.setTo(0.5, 0.7);
                break;
            } else {
                this.anchor.setTo(0.5);
            }
        }
        this.setupAnimations();
        this.game_state.prefabs[name] = this;
    }

    setupAnimations() {
        this.animations.add('walk_down', [
            "walk/down/0.png",
            "walk/down/1.png",
            "walk/down/0.png",
            "walk/down/2.png"
        ], 60, true);
        this.animations.add('walk_up', [
            "walk/up/0.png",
            "walk/up/1.png",
            "walk/up/0.png",
            "walk/up/2.png"
        ], 60, true);

        this.animations.add('walk_side', [
            "walk/side/0.png",
            "walk/side/1.png",
            "walk/side/0.png",
            "walk/side/2.png"
        ], 60, true);
    }

    walkDown() {
        this.animations.play("walk_down", 6, true);
    }

    walkUp () {
        this.animations.play("walk_up", 6, true);
    }

    walkLeft () {
        this.scale.x = 1;
        this.animations.play("walk_side", 6, true);
    }

    walkRight () {
        this.scale.x = -1;
        this.animations.play("walk_side", 6, true);
    }

    stopAnimation () {
        this.animations.stop();
    }

}