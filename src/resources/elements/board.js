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
        this._newTiles();
        console.log(this.deck);
        this.allCorrectCombinations = [];
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
        this._hintSubscription = this._eventAggregator.subscribe('hint', _ => {
            const combination = this._findCorrectCombinations();
            if (combination) {
                this.deck.forEach(tile => tile.marked = false);
                combination.forEach(tile => tile.marked = true);
                this.score -= 2;
                setTimeout(_ => combination.forEach(tile => tile.marked = false), 1500);
            } else {
                const tile = this.deck.filter(tile => !tile.onBoard)[0];
                this._highlightTiles([tile]);
            }
        });
    }

    detached() {
        this._clickSubscription.dispose();
        this._hintSubscription.dispose();
        this._readySubscription.dispose();
        this._toDeckSubscription.dispose();
    }

    currentCombinationChanged(index) {
        this._highlightTiles(this.allCorrectCombinations[index]);
    }

    _highlightTiles(tiles) {
        tiles.forEach(tile => tile.marked = true);
        setTimeout(_ => tiles.forEach(tile => tile.marked = false), 1200);
    }

    _getRandomIndex() {
        let tile, index, found = false;
        while (!found) {
            index = Math.floor(Math.random() * this.deck.length);
            tile = this.deck[index];
            if (!(tile.onBoard || tile.marked || tile.toBoard || tile.toDeck || tile.chosen)) {
                found === true;
                tile.chosen = true;
                return index;
            };
        }
    }

    _newTiles() {
        this._buildDeck();
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                const randomIndex = this._getRandomIndex();
                const tile = this.deck[randomIndex];
                tile.x = x;
                tile.y = y;
                tile.onBoard = true;
                tile.marked = false;
            }
        }
        this.deck.forEach(tile => tile.chosen = false);
    }

    _buildDeck() {
        const features = ['left', 'center', 'right'];
        this.deck = [];
        for (let i = 0; i < features.length; i++) {
            for (let j = 0; j < features.length; j++) {
                for (let k = 0; k < features.length; k++) {
                    for (let l = 0; l < features.length; l++) {
                        this.deck.push({
                            id: this.deck.length,
                            chin: features[i],
                            hair: features[j],
                            nose: features[k],
                            mouth: features[l],
                            x: 0,
                            y: 0,
                            onBoard: false,
                            marked: false
                        });
                    }
                }
            }
        }
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
        const randomIndices = [];
        tiles.forEach(_ => randomIndices.push(this._getRandomIndex()));
        this.deck.forEach(tile => tile.chosen = false);
        for (let i = 0; i < randomIndices.length; i++) {
            const boardTile = tiles[i];
            const randomTile = this.deck[randomIndices[i]];
            const toBoard = (toBoard, toDeck) => {
                toBoard.x = toDeck.x;
                toBoard.y = toDeck.y;
                toBoard.toBoard = true;
            }
            const toDeck = tile => {
                tile.x = 0;
                tile.y = 0;
                tile.toDeck = true;
                tile.onBoard = false;
            }
            toBoard(randomTile, boardTile);
            toDeck(boardTile);
        }
    }

    _checkWin() {
        this.markedTiles = this.deck.filter(tile => tile.marked);
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
        const onboardTiles = this.deck.filter(tile => tile.onBoard);
        const combinations = this._getCombinations(onboardTiles, 3);
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
