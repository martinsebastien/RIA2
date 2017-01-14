import Phaser from 'phaser'
import TextPrefab from '../prefabs/TextPrefab'

export default class MenuItem extends TextPrefab {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.select, this);
        this.anchor.setTo(0);
    }

    select() {
    }
}