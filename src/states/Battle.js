import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Tiled {

  constructor() {
    super();
  }

  init(level_data, extra_parameters) {
    super.init(level_data);

    this.battle_ref = firebase.child("battles").child(extra_parameters.battle_id);
    this.local_player = extra_parameters.local_player;
    this.remote_player = extra_parameters.remote_player;
  }

  preload() {
    this.load.text("classes_data", "assets/classes_data.json");
  }

  create() {
    let world_grid;
    super.create();

    this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);

    this.groups.menu_items.forEach(function (menu_item) {
      this.prefabs.menu.add_item(menu_item);
    }, this);

    world_grid = this.create_world_grid();
    this.pathfinding = this.game.plugins.add(Pathfinding, world_grid, [-1], this.tile_dimensions); // Previously Tactics.Pathfinding
    this.bfs = this.game.plugins.add(BreadthFirstSearch, this.map);

    this.classes_data = JSON.parse(this.game.cache.getText("classes_data"));

    this.battle_ref.once("value", this.create_units_queue.bind(this));

    this.battle_ref.onDisconnect().remove();

    this.game.stage.disableVisibilityChange = true;
  }

  fontsLoaded() {
    this.fontsReady = true
  }

}
