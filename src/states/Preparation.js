import Phaser from 'phaser'
import Tiled from './Tiled'

export default class extends Tiled {
    constructor() {
        super();
    }

    init(level_data, extra_parameters) {
        super.init(level_data);
        this.battle_ref = bdd.database().ref().child("battles").child(extra_parameters.battle_id);

        this.local_player = extra_parameters.local_player;
        this.remote_player = extra_parameters.remote_player;

        this.units_to_place = [{ type: "unit", name: this.local_player + "_dragon_unit", properties: { texture: "dragon_image", group: this.local_player + "_units", unit_class: "dragon" } },
        { type: "unit", name: this.local_player + "_blaster_unit", properties: { texture: "blaster_image", group: this.local_player + "_units", unit_class: "blaster" } },
        { type: "unit", name: this.local_player + "_mage_unit", properties: { texture: "mage_image", group: this.local_player + "_units", unit_class: "mage" } },
        { type: "unit", name: this.local_player + "_assassin_unit", properties: { texture: "assassin_image", group: this.local_player + "_units", unit_class: "assassin" } }];
    }

    create() {
        super.create();

        this.current_unit_to_place = this.units_to_place.shift();
        this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);

        this.battle_ref.on("value", this.disconnect.bind(this));

        this.battle_ref.onDisconnect().remove();

        // Unlock the achivement : First battle !
        gapi.load('auth2,signin2', function () {
            let auth2 = gapi.auth2.init();
            auth2.then(function () {
                // Current values
                let isSignedIn = auth2.isSignedIn.get();
                let currentUser = auth2.currentUser.get();

                if (!isSignedIn) {
                    console.log('Player is not sign in');
                } else {
                    gapi.client.load('games', 'v1', function () {
                    });

                    gapi.client.request({
                        path: '/games/v1/achievements/CgkIhom5grsNEAIQAw/unlock',
                        method: 'post',
                        callback: function (response) {
                            if (response.newlyUnlocked) {
                                popupSuccess();
                            }
                        }
                    });
                }
            });
        });
        // End achievement


        this.game.stage.disableVisibilityChange = true;
    }

    place_unit(position) {
        this.current_unit_to_place.position = position;

        this.battle_ref.child(this.local_player).child("units").push(this.current_unit_to_place);
        this.create_prefab(this.current_unit_to_place.name, { type: "unit_sprite", properties: { texture: this.current_unit_to_place.properties.texture, group: "unit_sprites" } }, position);

        if (this.units_to_place.length > 0) {
            this.current_unit_to_place = this.units_to_place.shift();
            this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
        } else {
            this.prefabs.current_unit_sprite.kill();
            this.groups.place_regions.forEach(function (region) {
                region.kill();
            }, this);

            this.battle_ref.child(this.local_player).child("prepared").set(true, this.wait_for_enemy.bind(this));
        }
    }

    wait_for_enemy() {
        this.battle_ref.child(this.remote_player).child("prepared").on("value", this.start_battle.bind(this));
    }

    start_battle(snapshot) {
        let prepared = snapshot.val();
        if (prepared) {
            this.game.state.start("Boot", true, false, "assets/levels/battle_level.json", "Battle", { battle_id: this.battle_ref.key, local_player: this.local_player, remote_player: this.remote_player });
        }
    }

    disconnect(snapshot) {
        if (!snapshot.val()) {
            this.game.state.start("Boot", true, false, "assets/levels/title_screen.json", "Title");
            popupDisconnect();
        }
    }

}