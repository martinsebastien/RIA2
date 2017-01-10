import Phaser from 'phaser'

class AttackRegion extends HighlightedRegion {

    constructor(game_state, name, position, properties) {
        super(game_state, name, position, properties);
    }

    select() {
        let target_unit;
        target_unit = this.game_state.find_prefab_in_tile(this.game_state.remote_player + "_units", this.position);
        if (target_unit) {
            this.game_state.send_attack_command(target_unit);
        }
    }
}