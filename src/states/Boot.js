import Phaser from 'phaser'

export default class extends Phaser.State {

    constructor() {
        super();
    }

    init(level_file, next_state, extra_parameters) {
        this.level_file = level_file;
        this.next_state = next_state;
        this.extra_parameters = extra_parameters;

    }

    preload() {
        this.load.text("level1", this.level_file);
    }

    create() {
        var level_text, level_data;
        level_text = this.game.cache.getText("level1");
        level_data = JSON.parse(level_text);
        this.game.state.start("Splash", true, false, level_data, this.next_state, this.extra_parameters);

    }
}