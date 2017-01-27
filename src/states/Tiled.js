import Phaser from 'phaser'
import Unit from '../prefabs/Unit'
import CommandItem from '../prefabs/CommandItem'
import Menu from '../prefabs/Menu'
import PlaceRegion from '../prefabs/PlaceRegion'
import Prefab from '../prefabs/Prefab'


export default class Tiled extends Phaser.State {

    constructor() {
        super();

        this.prefab_classes = {
            "unit": Unit,
            "command_item": CommandItem,
            "menu": Menu,
            "place_region": PlaceRegion,
            "unit_sprite": Prefab
        };
    }

    init(level_data) {
        let tileset_index;
        this.level_data = level_data;

        this.scale.setGameSize(700, 525);

        // start physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;

        // We add a tilemap type image to the game
        this.map = this.game.add.tilemap(level_data.map.key);
        tileset_index = 0;
        // For each tiles find in the tilemap, we display it
        this.map.tilesets.forEach(function (tileset, index) {
            this.map.addTilesetImage(tileset.name, level_data.map.tilesets[0]);
            tileset_index += 1;
        }, this);
    }

    create() {
        let group_name, object_layer, collision_tiles, world_grid, tile_dimensions, prefab_name;

        this.layers = {};
        // We set the collison layer
        this.map.layers.forEach(function (layer) {
            this.layers[layer.name] = this.map.createLayer(layer.name);
            if (layer.properties.collision) {
                this.map.setCollisionByExclusion([-1], true, layer.name);
            }
        }, this);
        // We resize the layer to the world size
        this.layers[this.map.layer.name].resizeWorld();

        this.groups = {};
        this.level_data.groups.forEach(function (group_name) {
            this.groups[group_name] = this.game.add.group();
        }, this);

        this.prefabs = {};
        for (object_layer in this.map.objects) {
            if (this.map.objects.hasOwnProperty(object_layer)) {
                this.map.objects[object_layer].forEach(this.create_object, this);
            }
        }
        for (prefab_name in this.level_data.prefabs) {
            if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
                this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name], this.level_data.prefabs[prefab_name].position);
            }
        }
    }

    create_object(object) {
        // We create all object on the map and set them position
        let object_y, object_x, position;
        object_y = object.y - (this.map.tileHeight / 2);
        object_x = object.x + (this.map.tileWidth / 2);
        position = { x: object_x, y: object_y };
        this.create_prefab(object.name, object, position);
    }

    create_prefab(prefab_name, prefab_data, position) {
        let prefab;
        if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
            prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, position, prefab_data.properties);
        }
        this.prefabs[prefab_name] = prefab;
        return prefab;
    }

    find_prefab_in_tile(group, position) {
        let found_prefab;
        this.groups[group].forEach(function (prefab) {
            if (prefab.x === position.x && prefab.y === position.y) {
                found_prefab = prefab;
            }
        }, this);
        return found_prefab;
    }

}