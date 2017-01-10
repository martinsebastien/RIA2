import Phaser from 'phaser'

class Menu extends Prefab {

    constructor(game_state, name, position, properties) {
        let live_index, life;

        super(game_state, name, position, properties);

        this.anchor.setTo(0);
        this.menu_items = [];
        this.show(false);
    }

    add_item(item) {
        this.menu_items.push(item);
        item.visible = this.visible;
    }

    show(show) {
        this.visible = show;
        this.menu_items.forEach(function (menu_item) {
            menu_item.visible = show;
        }, this);
    }
}