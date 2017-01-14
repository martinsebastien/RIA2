import Phaser from 'phaser'
import HighlightedRegion from '../prefabs/HighlightedRegion'

export default class PlaceRegion extends HighlightedRegion {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
        this.player = properties.player;
    }

    select() {
        let current_placed_unit;
        current_placed_unit = this.game_state.find_prefab_in_tile("unit_sprites", this.position);
        if (!current_placed_unit && this.player === this.game_state.local_player) {
            this.game_state.place_unit(this.position);
        }
    }
}