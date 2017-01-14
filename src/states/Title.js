import Phaser from 'phaser'
import JSONLevelState from './JSONLevelState'
import TextPrefab from '../prefabs/TextPrefab'

export default class extends JSONLevelState {
    constructor() {
        super();

        this.prefab_classes = {
            "text": TextPrefab
        };
    }

    create() {
        super.create();
        this.game.input.onDown.add(this.start_battle, this);
    }

    start_battle() {
        this.game.state.start("Boot", true, false, "assets/levels/lobby.json", "Lobby");
    }

}