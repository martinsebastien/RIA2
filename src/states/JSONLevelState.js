import Phaser from 'phaser'

export default class extends Phaser.State {

  constructor () {
    super();
      this.prefab_classes = {
      }
  }

  init (level_data) {
      this.level_data = level_data;
  }

  create () {
      let group_name, prefab_name;

      // create groups
      this.groups = {};
      this.level_data.groups.forEach(function (group_name) {
          this.groups[group_name] = this.game.add.group();
      }, this);

      // create prefabs
      this.prefabs = {};
      for (prefab_name in this.level_data.prefabs) {
          if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
              // create prefab
              this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
          }
      }
  }

  create_prefab (prefab_name, prefab_data) {
      let prefab_position, prefab;
      // create object according to its type
      if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
          if (prefab_data.position.x > 0 && prefab_data.position.x <= 1) {
              // position as percentage
              prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width,
                  prefab_data.position.y * this.game.world.height);
          } else {
              // position as absolute number
              prefab_position = prefab_data.position;
          }
          prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_position, prefab_data.properties);
      }
  }
}
