import Phaser from 'phaser'

export default class BreadthFirstSearch extends Phaser.Plugin {

    constructor(game, parent) {
        super(game, parent);
    }

    init(map) {
        this.map = map;
        this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    }

    check_repetition(position, array) {
        let found;
        found = false;

        array.forEach(function (array_position) {
            if (array_position.x === position.x && array_position.y === position.y) {
                found = true;
            }
        }, this);
        return found;
    }

    add_neighbors(position, positions_to_check, visited_positions) {
        let left_neighbor, right_neighbor, top_neighbor, bottom_neighbor;
        left_neighbor = new Phaser.Point(position.x - this.tile_dimensions.x, position.y);

        if (!this.check_repetition(left_neighbor, positions_to_check) && !this.check_repetition(left_neighbor, visited_positions) && !this.map.getTileWorldXY(left_neighbor.x, left_neighbor.y, this.tile_dimensions.x, this.tile_dimensions.y, "collision")) {
            positions_to_check.push(left_neighbor);
        }
        
        right_neighbor = new Phaser.Point(position.x + this.tile_dimensions.x, position.y);
        if (!this.check_repetition(right_neighbor, positions_to_check) && !this.check_repetition(right_neighbor, visited_positions) && !this.map.getTileWorldXY(right_neighbor.x, right_neighbor.y, this.tile_dimensions.x, this.tile_dimensions.y, "collision")) {
            positions_to_check.push(right_neighbor);
        }

        top_neighbor = new Phaser.Point(position.x, position.y + this.tile_dimensions.y);
        if (!this.check_repetition(top_neighbor, positions_to_check) && !this.check_repetition(top_neighbor, visited_positions) && !this.map.getTileWorldXY(top_neighbor.x, top_neighbor.y, this.tile_dimensions.x, this.tile_dimensions.y, "collision")) {
            positions_to_check.push(top_neighbor);
        }

        bottom_neighbor = new Phaser.Point(position.x, position.y - this.tile_dimensions.y);
        if (!this.check_repetition(bottom_neighbor, positions_to_check) && !this.check_repetition(bottom_neighbor, visited_positions) && !this.map.getTileWorldXY(bottom_neighbor.x, bottom_neighbor.y, this.tile_dimensions.x, this.tile_dimensions.y, "collision")) {
            positions_to_check.push(bottom_neighbor);
        }
    }

    find_reachable_area(source_position, radius) {
        let reachable_positions, positions_to_check, next_position, distance_to_source, highlighted_bitmap, highlighted_region;
        reachable_positions = [source_position];
        positions_to_check = [];
        this.add_neighbors(source_position, positions_to_check, reachable_positions);

        while (positions_to_check.length > 0) {
            next_position = positions_to_check.shift();
            reachable_positions.push(next_position);
            distance_to_source = (Math.abs(next_position.x - source_position.x) / this.tile_dimensions.x) + (Math.abs(next_position.y - source_position.y) / this.tile_dimensions.y);
            if (distance_to_source < radius) {
                this.add_neighbors(next_position, positions_to_check, reachable_positions);
            }
        }

        return reachable_positions;
    }
}
