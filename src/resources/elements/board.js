import { bindable } from 'aurelia-framework';

export class Board {
    @bindable value;

    constructor() {
        this.tileCount = 9;
        this.tiles = [];
        for (let i = 0; i < this.tileCount; i++) {
            this.tiles.push(this.newTile());
        }
    }

    newTile() {
        const tile = {
            color: 'orange',
            size: 'small',
            background: 'smoke',
            capitals: Math.random() > 0.5
        };
        return tile;
    }

    valueChanged(newValue, oldValue) {
        //
    }
}
