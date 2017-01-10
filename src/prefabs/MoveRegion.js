import Phaser from 'phaser'

class MoveRegion extends HighlightedRegion {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
    }

    select() {
        let player1_unit, player2_unit;
        player1_unit = this.game_state.find_prefab_in_tile("player1_units", this.position);
        player2_unit = this.game_state.find_prefab_in_tile("player2_units", this.position);
        if (!player1_unit && !player2_unit) {
            this.game_state.send_move_command(this.position);
        }
    }
}