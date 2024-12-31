import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Board {
    @bindable value;
    WIDTH = 3;
    HEIGHT = 4;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.tileCount = this.WIDTH * this.HEIGHT;
        this.tiles = [];
        for (let i = 0; i < this.tileCount; i++)
            this.tiles.push({ id: i });
        this.score = 0;
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
    }

    detached() {
        this._clickSubscription.dispose();
    }

    _evaluate(tiles) {
        const treats = Object.keys(tiles[0].treats);
        const treatSets = {};
        treats.forEach(treat => treatSets[treat] = new Set(tiles.map(tile => tile[treat])));

        const inclusiveResults = treats.map(treat => treatSets[treat].size === 1);
        const exclusiveResults = treats.map(treat => treatSets[treat].size === treats.length);
        const results = inclusiveResults.concat(exclusiveResults);
        const score = results.filter(result => result).length;

        console.log(score);
        return score;
    }

    _checkWin() {
        const markedTiles = this.tiles.filter(tile => tile.marked);
        if (markedTiles.length === 3) {
            const result = this._evaluate(markedTiles);
            if (result) {
                this.score += result;
                // alert('Continue?');
                this._eventAggregator.publish('renew-tiles', markedTiles);
            } else {
                markedTiles.forEach(tile => tile.marked = false);
                document.querySelector('tile').triggerEvent('blur');
            }
        }
    }
}
