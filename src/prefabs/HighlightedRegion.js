import Phaser from 'phaser'
import Prefab from '../prefabs/Prefab'

export default class HighlightedRegion extends Prefab {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);

        this.alpha = 0.5;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.select, this);
    }

    select() {
    }
}