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
        this._buildDeck();
        this._newTiles();
        this.allCorrectCombinations = [];
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
        this._hintSubscription = this._eventAggregator.subscribe('hint', _ => {
            const combination = this._findCorrectCombinations();
            if (combination) {
                this.tiles.forEach(tile => tile.marked = false);
                combination.forEach(tile => tile.marked = true);
                this.score -= 2;
                setTimeout(_ => combination.forEach(tile => tile.marked = false), 1500);
            } else {
                // this should never happen
                this._highlightTiles(this.tiles);
                setTimeout(_ => {
                    this._newTiles();
                    this.score += 10;
                }, 1600);
            }
        });
        this._readySubscription = this._eventAggregator.subscribe('tile-ready', _ => {
            clearTimeout(this._readyTimeout);
            this._readyTimeout = setTimeout(_ => {
                const combination = this._findCorrectCombinations();
                if (combination) return;
                if (this.markedTiles?.length)
                    this._renewTiles(this.markedTiles)
                else
                    this._newTiles();
            }, 100);
        });
    }

    detached() {
        this._clickSubscription.dispose();
        this._hintSubscription.dispose();
        this._readySubscription.dispose();
    }

    currentCombinationChanged(index) {
        this._highlightTiles(this.allCorrectCombinations[index]);
    }

    _highlightTiles(tiles) {
        tiles.forEach(tile => tile.marked = true);
        setTimeout(_ => tiles.forEach(tile => tile.marked = false), 1500);
    }

    _newTiles() {
        this.tiles = [];
        for (let i = 0; i < this.tileCount; i++)
            this.tiles.push({ id: i });
    }

    _buildDeck() {
        const features = ['left', 'center', 'right'];
        const deck = [];
        for (let i = 0; i < features.length; i++) {
            for (let j = 0; j < features.length; j++) {
                for (let k = 0; k < features.length; k++) {
                    for (let l = 0; l < features.length; l++) {
                        deck.push({
                            chin: features[i],
                            hair: features[j],
                            nose: features[k],
                            mouth: features[l]
                        });
                    }
                }
            }
        }
        return deck;
    }

    _isCorrect(tiles) {
        const alltreats = Object.keys(tiles[0].treats);
        const treatSets = {};
        alltreats.forEach(treat => treatSets[treat] = new Set(tiles.map(tile => tile[treat])));

        const inclusiveResults = alltreats.map(treat => treatSets[treat].size === 1).filter(result => result).length;
        const exclusiveResults = alltreats.map(treat => treatSets[treat].size === 3).filter(result => result).length;
        const results = inclusiveResults + exclusiveResults;
        const correct = results === 4;

        return correct;
    }

    _renewTiles(tiles) {
        tiles.forEach(tile => {
            this.tiles.splice(tile.id, 1, { id: tile.id });
        });
    }

    _checkWin() {
        this.markedTiles = this.tiles.filter(tile => tile.marked);
        if (this.markedTiles.length === 3) {
            const result = this._isCorrect(this.markedTiles);
            if (result) {
                this.score += result;
                this._renewTiles(this.markedTiles);
            } else {
                this.markedTiles.forEach(tile => tile.marked = false);
            }
        }
    }

    _findCorrectCombinations() {
        this.allCorrectCombinations = [];
        const combinations = this._getCombinations(this.tiles, 3);
        for (const combination of combinations) {
            if (this._isCorrect(combination)) {
                this.allCorrectCombinations.push(combination);
            }
        }
        return this.allCorrectCombinations[0] || null;
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
