import Phaser from 'phaser'

export default class TextPrefab extends Phaser.Text{

    constructor(game_state, name, position, properties) {
        super(game_state.game, position.x, position.y, properties.text, properties.style);

        this.game_state = game_state;

        this.name = name;

        this.game_state.groups[properties.group].add(this);

        if (properties.anchor) {
            this.anchor.setTo(properties.anchor.x, properties.anchor.y);
        }

        this.game_state.prefabs[name] = this;
    }
}