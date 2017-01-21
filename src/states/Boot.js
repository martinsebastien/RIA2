import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../main'

export default class extends Phaser.State {

    constructor() {
        super();
    }

    init(level_file, next_state, extra_parameters) {
        this.level_file = level_file;
        this.next_state = next_state;
        this.extra_parameters = extra_parameters;

        //test scaling
        this.game.scale.fullScreenTarget = this.parentElement;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; // Important            
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;
        this.game.scale.setResizeCallback(function () {
            this.resize(document.getElementById("content"), true);
            this.game.scale.setResizeCallback(this.resize, this);
        }, this);
        //end test scaling
    }

    preload() {
        this.load.text("level1", this.level_file);
        this.load.image("wp_home", "assets/images/wp.jpg");
    }

    create() {
        let level_text, level_data;
        level_text = this.game.cache.getText("level1");
        level_data = JSON.parse(level_text);

        this.input.onDown.add(this.goLarge, this);

        this.game.state.start("Splash", true, false, level_data, this.next_state, this.extra_parameters);
    }

    resize(element, logging) {
        let scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
        element.minHeight = window.innerHeight.toString() + "px";
        this.game.scale.setUserScale(scale, scale, 0, 0);
    }

    goLarge(){
        game.scale.startFullScreen();
    }

}