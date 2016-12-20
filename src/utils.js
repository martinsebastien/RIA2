export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const setResponsiveWidth = (sprite, percent, parent) => {
  let percentWidth = (sprite.texture.width - (parent.width / (100 / percent))) * 100 / sprite.texture.width
  sprite.width = parent.width / (100 / percent)
  sprite.height = sprite.texture.height - (sprite.texture.height * percentWidth / 100)
}

class Create_prefab_from_pool {

    constructor (pool, prefab_constructor, game_state, prefab_name, prefab_position, prefab_properties) {

        let prefab;
        // get the first dead prefab from the pool
        prefab = pool.getFirstDead();

        if (!prefab) {
            // if there is no dead prefab, create a new one
            prefab = new prefab_constructor(game_state, prefab_name, prefab_position, prefab_properties);
        } else {
            // if there is a dead prefab, reset it in the new position
            prefab.reset(prefab_position.x, prefab_position.y);
        }

    }
}

