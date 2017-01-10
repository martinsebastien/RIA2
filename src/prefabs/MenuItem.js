import Phaser from 'phaser'

class MenuItem extends TextPrefab {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.select, this);
        this.anchor.setTo(0);
    }

    select() {
    }
}