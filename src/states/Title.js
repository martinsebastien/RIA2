import Phaser from 'phaser'

export default class extends Phaser.State {
  constructor () {
    super();
      this.prefab_classes = {
          "text": Tactics.TextPrefab
      };
  }

  create () {
      Tactics.JSONLevelState.create.call(this);
      this.game.input.onDown.add(this.start_battle, this);
  }

    start_battle () {
        this.game.state.start("BootState", true, false, "assets/levels/lobby.json", "LobbyState");
    }

}
