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
        this.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.add.sprite(0, 0, "wp_home");

        let mainTitle = game.add.text(game.world.centerX, game.world.centerY - 100, "M A G I C");
        let secondTitle = game.add.text(game.world.centerX, game.world.centerY + 20, "T A C T I C A L  L E G I O N S");
        let clickStart = game.add.text(game.world.centerX, game.world.centerY + 130, "S T A R T");
        mainTitle.anchor.setTo(0.5);
        secondTitle.anchor.setTo(0.5);
        clickStart.anchor.setTo(0.5);

        mainTitle.font = "Roboto";
        secondTitle.font = "Roboto";
        clickStart.font = "Roboto";

        mainTitle.fontSize = 80;
        secondTitle.fontSize = 36;

        mainTitle.style.fontWeight = "bold";
        secondTitle.style.fontWeight = "bold";
        clickStart.style.fontWeight = "light";

        mainTitle.setShadow(-5, 5, 'rgba(0,0,0,0.35)', 30);
        secondTitle.setShadow(2, 2, 'rgba(0,0,0,0.35)', 15);
        clickStart.setShadow(1, 1, 'rgba(0,0,0,0.35)', 5);

        mainTitle.style.fill = "white";
        secondTitle.style.fill = "white";
        clickStart.style.fill = "white";

        this.game.input.onDown.add(this.start_battle, this);
    }

    start_battle() {
        this.game.state.start("Boot", true, false, "assets/levels/lobby.json", "Lobby");
    }

}