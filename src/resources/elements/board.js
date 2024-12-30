import { bindable } from 'aurelia-framework';

export class Board {
    @bindable value;
    WIDTH = 4;
    HEIGHT = 5;

    constructor() {
        this.textTranforms = ['capitalize', 'uppercase', 'lowercase'];
        this.colors = ['crimson', 'olive', 'navy'];
        this.backgrounds = ['lightgoldenrodyellow', 'wheat', 'lightblue'];
        this.tiles = [];
        this.tileCount = this.WIDTH * this.HEIGHT;
        for (let i = 0; i < this.tileCount; i++) {
            this.tiles.push(this.newTile());
        }
    }

    newTile() {
        const tile = {
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            background: this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)],
            textTransform: this.textTranforms[Math.floor(Math.random() * this.textTranforms.length)],
        };
        return tile;
    }

    valueChanged(newValue, oldValue) {
        //
    }
}
