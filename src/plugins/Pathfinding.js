import Phaser from 'phaser'
import EasyStar from 'easystarjs'

export default class Pathfinding extends Phaser.Plugin {

    constructor(game, parent) {
        super(game, parent);
        // We initialise an easystar object. Which is the core of the pathinding function
        this.easy_star = new EasyStar.js();
    }

    init(world_grid, acceptable_tiles, tile_dimensions) {
        let grid_row, grid_column, grid_indices;
        // We set the dimension of the grid where the pathfinding can take place
        this.grid_dimensions = { row: world_grid.length, column: world_grid[0].length };
        this.world_grid = world_grid;

        this.easy_star.setGrid(this.world_grid);
        this.easy_star.setAcceptableTiles(acceptable_tiles);

        this.tile_dimensions = tile_dimensions;
    }

    find_path(origin, target, callback, context) {
        let origin_coord, target_coord;
        // We find the path to follow (we can find this function in action in Unit.js)
        origin_coord = this.get_coord_from_point(origin);
        target_coord = this.get_coord_from_point(target);

        // If the target is in range of the grid, then we calculate the right path
        if (!this.outside_grid(origin_coord) && !this.outside_grid(target_coord)) {
            this.easy_star.findPath(origin_coord.column, origin_coord.row, target_coord.column, target_coord.row, this.call_callback_function.bind(this, callback, context));
            this.easy_star.calculate();
            return true;
        } else {
            return false;
        }
    }

    call_callback_function(callback, context, path) {
        let path_positions;
        path_positions = [];
        if (path) {
            // We push all the coordinate in an array
            path.forEach(function (path_coord) {
                path_positions.push(this.get_point_from_coord({ row: path_coord.y, column: path_coord.x }));
            }, this);
            callback.call(context, path_positions);
        }
    }

    outside_grid(coord) {
        return coord.row < 0 || coord.row > this.grid_dimensions.row - 1 || coord.column < 0 || coord.column > this.grid_dimensions.column - 1;
    }

    remove_tile(coord) {
        this.world_grid[coord.row][coord.column] = -1;
        this.easy_star.setGrid(this.world_grid);
    }

    get_coord_from_point(point) {
        let row, column;
        row = Math.floor(point.y / this.tile_dimensions.y);
        column = Math.floor(point.x / this.tile_dimensions.x);
        return { row: row, column: column };
    }

    get_point_from_coord(coord) {
        let x, y;
        x = (coord.column * this.tile_dimensions.x) + (this.tile_dimensions.x / 2);
        y = (coord.row * this.tile_dimensions.y) + (this.tile_dimensions.y / 2);
        return new Phaser.Point(x, y);
    }
}