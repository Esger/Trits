import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Board {
    @bindable value;
    WIDTH = 4;
    HEIGHT = 5;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.tileCount = this.WIDTH * this.HEIGHT;
        this.tiles = [];
        for (let i = 0; i < this.tileCount; i++)
            this.tiles.push({ id: i });
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
    }

    detached() {
        this._clickSubscription.dispose();
    }

    _checkWin() {
        const markedTiles = this.tiles.filter(tile => tile.marked);
        if (markedTiles.length === 3) {
            if (markedTiles.every(tile => tile.color === markedTiles[0].color)) {
                // alert('You won!');
                this._eventAggregator.publish('renew-tiles', markedTiles);
            } else {
                markedTiles.forEach(tile => tile.marked = false);
            }
        }
    }
}
