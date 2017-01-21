import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {

    constructor() {
        super();
    }

    init(level_data, next_state, extra_parameters) {
        this.level_data = level_data;
        this.next_state = next_state;
        this.extra_parameters = extra_parameters;
    }

    preload() {
        let assets, asset_loader, asset_key, asset;
        assets = this.level_data.assets;
        for (asset_key in assets) { // load assets according to asset key
            if (assets.hasOwnProperty(asset_key)) {
                asset = assets[asset_key];
                switch (asset.type) {
                    case "image":
                        this.load.image(asset_key, asset.source);
                        break;
                    case "spritesheet":
                        this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                        break;
                    case "tilemap":
                        console.log(asset_key, asset.source);
                        this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                        break;
                    case "sprites":
                        this.load.atlasJSONArray(asset_key, asset.source, asset.generator);
                        break;
                }
            }
        }
    }

    create() {
        this.game.state.start(this.next_state, true, false, this.level_data, this.extra_parameters);
    }

}