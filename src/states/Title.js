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
        let background = this.add.sprite(game.world.centerX, 0, "wp_home");
        background.anchor.setTo(0.5, 0);

        document.getElementById("container-google-button").style.display = "block";

        let mainTitle = this.add.text(game.world.centerX, game.world.centerY - game.world.centerY / 2, "M A G I C");
        let secondTitle = this.add.text(game.world.centerX, game.world.centerY - (game.world.centerY / 3 - 40), "T A C T I C A L  L E G I O N S");
        //let clickStart = this.add.text(game.world.centerX, game.world.centerY + game.world.centerY / 2, "S T A R T");
        mainTitle.anchor.setTo(0.5);
        secondTitle.anchor.setTo(0.5);
        //clickStart.anchor.setTo(0.5);

        mainTitle.font = "Roboto";
        secondTitle.font = "Roboto";
        //clickStart.font = "Roboto";

        mainTitle.fontSize = 80;
        secondTitle.fontSize = 36;

        mainTitle.style.fontWeight = "bold";
        secondTitle.style.fontWeight = "bold";
        //clickStart.style.fontWeight = "light";

        mainTitle.setShadow(-5, 5, 'rgba(0,0,0,0.35)', 30);
        secondTitle.setShadow(2, 2, 'rgba(0,0,0,0.35)', 15);
        //clickStart.setShadow(1, 1, 'rgba(0,0,0,0.35)', 5);

        mainTitle.style.fill = "white";
        secondTitle.style.fill = "white";
        //clickStart.style.fill = "white";

        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            this.game.input.onDown.add(this.start_battle, this);
        }


    }

    start_battle() {
        this.game.state.start("Boot", true, false, "assets/levels/lobby.json", "Lobby");
    }

}