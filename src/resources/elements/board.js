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
        this.score = 0;
        this._newTiles();
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
        this._hintSubscription = this._eventAggregator.subscribe('hint', _ => {
            const combination = this._findWin();
            if (combination) {
                combination.forEach(tile => tile.marked = true);
                this.score -= 2;
                setTimeout(_ => combination.forEach(tile => tile.marked = false), 1000);
            } else {
                this.tiles.forEach(tile => tile.marked = true);
                setTimeout(_ => this.tiles.forEach(tile => tile.marked = false), 1000);
                setTimeout(_ => {
                    this._newTiles();
                    this.score += 10;
                }, 1100);
            }
        });
    }

    _newTiles() {
        this.tiles = [];
        for (let i = 0; i < this.tileCount; i++)
            this.tiles.push({ id: i });

    }

    detached() {
        this._clickSubscription.dispose();
        this._hintSubscription.dispose();
    }

    _evaluate(tiles) {
        const treats = Object.keys(tiles[0].treats);
        const treatSets = {};
        treats.forEach(treat => treatSets[treat] = new Set(tiles.map(tile => tile[treat])));

        const inclusiveResults = treats.map(treat => treatSets[treat].size === 1).filter(result => result).length;
        const exclusiveResults = treats.map(treat => treatSets[treat].size === 3).filter(result => result).length;
        const results = inclusiveResults + exclusiveResults;
        const correct = results === 4;

        console.log(results, correct);
        return correct;
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
                // document.querySelector('tile').triggerEvent('blur');
            }
        }
    }

    // binary search this.tiles for any combination of 3 tiles that _evaluate() to true
    _findWin() {
        const combinations = this._getCombinations(this.tiles, 3);
        for (const combination of combinations) {
            if (this._evaluate(combination)) {
                return combination;
            }
        }
        return null;
    }

    _getCombinations(arr, len) {
        if (len === 1) return arr.map(x => [x]);
        let result = [];
        for (let i = 0; i < arr.length - len + 1; i++) {
            let current = arr[i];
            let rest = arr.slice(i + 1);
            for (let p of this._getCombinations(rest, len - 1)) {
                result.push([current, ...p]);
            }
        }
        return result;
    }
}
