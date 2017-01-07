import 'pixi'
import 'p2'
import Phaser from 'phaser'
// import * as Firebase from 'firebase'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import TitleState from './states/Title'
import LobbyState from './states/Lobby'
import PreparationState from './states/Preparation'
import BattleState from './states/Battle'

class Game extends Phaser.Game {

  constructor () {
    let width = document.documentElement.clientWidth > 600 ? 600 : document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight > 600 ? 600 : document.documentElement.clientHeight;

    super(width, height, Phaser.AUTO, 'content', null, false, false);

    this.state.add('Boot', BootState, false);                    // Boot the game (load the loading state)
    this.state.add('Splash', SplashState, false);                // Is the loading state
    this.state.add('Title', TitleState, false);                  // Is the title screen state
    this.state.add('Lobby', LobbyState, false);                  // Is the "waiting player" state
    this.state.add('Preparation', PreparationState, false);      // Is the preparation of the battle state
    this.state.add('Battle', BattleState, false);                // Is the battle state

    this.state.start('Boot', true, false, 'assets/levels/title_screen.json', 'TitleState');                                    // Run the Boot state
  }
}

window.game = new Game();

// const firebase = new Firebase("https://tactics-a6625.firebaseio.com/")

// Make sure you swap this out with your Firebase app's config
// const config = {
//     apiKey: "XXXXXXXXXXXX-XXXXXXXXXXX-XX-XXXXXXXXXXX",
//     authDomain: "XXXX.firebaseapp.com",
//     databaseURL: "https://XXXX.firebaseio.com",
//     storageBucket: "XXXX.appspot.com",
// };
//
// const fb = firebase
//     .initializeApp(config)
//     .database()
//     .ref();

