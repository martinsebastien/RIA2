import Phaser from 'phaser'
import Tiled from './Tiled'
import Pathfinding from '../plugins/Pathfinding'
import BreadthFirstSearch from '../plugins/BreadthFirstSearch'
import PriorityQueue from 'priorityqueuejs'
import Fifo from 'fifo'
import { Create_prefab_from_pool } from '../utils'
import MoveRegion from '../prefabs/MoveRegion'
import AttackRegion from '../prefabs/AttackRegion'

export default class extends Tiled {

  constructor() {
    super();
  }

  init(level_data, extra_parameters) {
    super.init(level_data);

    this.battle_ref = bdd.database().ref().child("battles").child(extra_parameters.battle_id);
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

    this.battle_ref.on("value", this.disconnect.bind(this));

    this.battle_ref.once("value", this.create_units_queue.bind(this));

    this.battle_ref.onDisconnect().remove();

    this.game.stage.disableVisibilityChange = true;
  }

  create_world_grid() {
    let obstacles_layer, row_index, column_index, world_grid;
    obstacles_layer = this.map.layers[1];
    world_grid = [];

    for (row_index = 0; row_index < this.map.height; row_index += 1) {
      world_grid.push([]);
      for (column_index = 0; column_index < this.map.width; column_index += 1) {
        world_grid[row_index].push(obstacles_layer.data[row_index][column_index].index);
      }
    }
    return world_grid;
  }

  create_units_queue(snapshot) {
    let battle_data;
    battle_data = snapshot.val();

    this.units_queue = new PriorityQueue(function (unit_a, unit_b) {
      return unit_a.prefab.act_turn - unit_b.prefab.act_turn;
    }
    );

    this.queue_player_units(battle_data, "player1");
    this.queue_player_units(battle_data, "player2");

    this.fifo_queue_units = new Fifo();
    console.log(this.units_queue);
    for (let unit in this.units_queue._elements) {
      this.fifo_queue_units.push(this.units_queue._elements[unit]);
    }
    console.log(this.fifo_queue_units);
    this.battle_ref.child("command").on("value", this.receive_command.bind(this));

    this.next_turn();
  }

  queue_player_units(battle_data, player) {
    let unit_key, unit_data, unit_prefab;

    for (unit_key in battle_data[player].units) {

      if (battle_data[player].units.hasOwnProperty(unit_key)) {

        unit_data = battle_data[player].units[unit_key];
        unit_prefab = this.create_prefab(unit_data.name, unit_data, unit_data.position);
        unit_prefab.load_stats(this.classes_data);

        this.units_queue.enq({ player: player, prefab: unit_prefab });
      }
    }
  }

  receive_command(snapshot) {
    let command;
    command = snapshot.val();
    if (command) {
      switch (command.type) {
        case "move":
          this.move_unit(command.target);
          break;
        case "attack":
          this.attack_unit(command.target, command.damage);
          break;
        case "wait":
          this.wait();
          break;
      }
    }
  }

  next_turn() {
    if (this.groups.player1_units.countLiving() === 0 || this.groups.player2_units.countLiving() === 0) {
      this.game_over();
    } else {

      // Clear all the highlight_regions
      this.clear_previous_turn();
      this.current_unit = this.fifo_queue_units.shift();
      console.log(this.fifo_queue_units.length);

      if (this.current_unit.prefab.alive) {
        this.current_unit.prefab.tint = (this.current_unit.prefab.name.search("player1") !== -1) ? 0x0000ff : 0xff0000;

        if (this.current_unit.player === this.local_player) {
          this.prefabs.menu.show(true);
        } else {
          this.prefabs.menu.show(false);
        }

        this.current_unit.prefab.calculate_act_turn(this.current_unit.prefab.act_turn);
        this.fifo_queue_units.push(this.current_unit);
      } else {
        this.send_wait_command();
      }
    }
  }

  game_over() {
    if (bdd.database().ref().child("battles") == null) {
      this.game.state.start("Boot", true, false, "assets/levels/title_screen.json", "Title");
    }
    let winner, winner_message;
    winner = (this.groups.player1_units.countLiving() === 0) ? "player2" : "player1";
    winner_message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, winner + " wins", { font: "24px Arial", fill: "#FFF" });
    winner_message.anchor.setTo(0.5);
    this.game.input.onDown.add(function () {
      this.game.state.start("Boot", true, false, "assets/levels/title_screen.json", "Title");
    }, this);

  }

  disconnect(snapshot) {
    console.log(snapshot.val());
    if (!snapshot.val()) {
      this.game.state.start("Boot", true, false, "assets/levels/title_screen.json", "Title");
    }
  }


  clear_previous_turn() {
    if (this.current_unit) {
      this.current_unit.prefab.tint = 0xffffff;
    }
    this.groups.move_regions.forEach(function (region) {
      region.kill();
    }, this);
    this.groups.attack_regions.forEach(function (region) {
      region.kill();
    }, this);
  }

  highlight_regions(source, radius, region_pool, region_constructor) {
    let positions, region_name, highlighted_region;
    positions = this.bfs.find_reachable_area(source, radius);
    positions.forEach(function (position) {
      region_name = "region_" + this.groups[region_pool].countLiving();
      highlighted_region = new Create_prefab_from_pool(this.groups[region_pool], region_constructor, this, region_name, position, { texture: "highlighted_region_image", group: region_pool });
    }, this);
  }

  move() {
    this.highlight_regions(this.current_unit.prefab.position, this.current_unit.prefab.stats.walking_radius, "move_regions", MoveRegion);
  }

  send_move_command(target_position) {
    this.battle_ref.child("command").set({ type: "move", target: { x: target_position.x, y: target_position.y } });
  }

  move_unit(target) {
    this.current_unit.prefab.move_to(target);
    this.next_turn();
  }

  attack() {
    this.highlight_regions(this.current_unit.prefab.position, this.current_unit.prefab.stats.attack_range, "attack_regions", AttackRegion);
  }

  send_attack_command(target_unit) {
    let damage;
    damage = this.current_unit.prefab.calculate_damage(target_unit);
    this.battle_ref.child("command").set({ type: "attack", target: target_unit.name, damage: damage });
  }

  attack_unit(target_name, damage) {
    this.prefabs[target_name].receive_damage(damage);
    this.next_turn();
  }

  send_wait_command() {
    this.battle_ref.child("command").set({ type: "wait", unit: this.current_unit.prefab.name });
  }

  wait() {
    this.next_turn();
  }
}