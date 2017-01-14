import Phaser from 'phaser'
import MenuItem from '../prefabs/MenuItem'

class CommandItem extends MenuItem {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);

        this.callback = properties.callback;
    }

    select() {
        this.game_state[this.callback].call(this.game_state);
    }
}