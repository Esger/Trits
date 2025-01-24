import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Board {
    @bindable value;
    WIDTH = 3;
    HEIGHT = 4;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
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

    _drawRandomTile() {
        return this.deck.splice(Math.floor(Math.random() * this.deck.length), 1)[0];
    }

    _toDeck(oldtile) {
        this.deck.splice(oldtile.id, 0, oldtile);
    }

    _toBoard(tile) {
        const tileToReplace = this.tiles.find(tile => tile.marked);
        if (tileToReplace) {
            tile.x = tileToReplace.x;
            tile.y = tileToReplace.y;
            tile.marked = false;
            const index = this.tiles.indexOf(tileToReplace);
            this.tiles.splice(index, 1, tile);
            tileToReplace.x = undefined;
            tileToReplace.y = undefined;
            tileToReplace.marked = false;
        }
        return tileToReplace;
    }

    _newTiles() {
        this.tiles = [];
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                const newtile = this._drawRandomTile();
                newtile.x = x;
                newtile.y = y;
                this.tiles.push(newtile);
            }
        }
    }

    _buildDeck() {
        const features = ['left', 'center', 'right'];
        const deck = [];
        for (let i = 0; i < features.length; i++) {
            for (let j = 0; j < features.length; j++) {
                for (let k = 0; k < features.length; k++) {
                    for (let l = 0; l < features.length; l++) {
                        deck.push({
                            id: deck.length,
                            chin: features[i],
                            hair: features[j],
                            nose: features[k],
                            mouth: features[l]
                        });
                    }
                }
            }
        }
        this.deck = deck;
    }

    _isCorrect(tiles) {
        const alltreats = ['chin', 'hair', 'nose', 'mouth'];
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
            const newtile = this._drawRandomTile();
            const replacedTile = this._toBoard(newtile);
            this._toDeck(replacedTile);
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
