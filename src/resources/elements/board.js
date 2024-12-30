import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Board {
    @bindable value;
    WIDTH = 4;
    HEIGHT = 5;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.textTranforms = ['capitalize', 'uppercase', 'lowercase'];
        this.colors = ['crimson', 'olive', 'navy'];
        this.backgrounds = ['lightgoldenrodyellow', 'wheat', 'lightblue'];
        this.tiles = [];
        this.tileCount = this.WIDTH * this.HEIGHT;
        for (let i = 0; i < this.tileCount; i++) {
            this.tiles.push(this.newTile());
        }
    }

    attached() {
        this._clickSubscription = this._eventAggregator.subscribe('tile-clicked', _ => this._checkWin());
    }

    detached() {
        this._clickSubscription.dispose();
    }

    _randomProperty(properties) {
        return properties[Math.floor(Math.random() * properties.length)]
    }

    newTile() {
        const tile = {
            color: this._randomProperty(this.colors),
            background: this._randomProperty(this.backgrounds),
            textTransform: this._randomProperty(this.textTranforms),
        };
        return tile;
    }

    _renewTiles(tiles) {
        const baseTimeOut = 500;
        let timeOut = 500;
        for (let tile of tiles) {
            setTimeout(_ => {
                tile.visible = false;
                setTimeout(_ => {
                    tile.color = this._randomProperty(this.colors);
                    tile.background = this._randomProperty(this.backgrounds);
                    tile.textTransform = this._randomProperty(this.textTranforms);
                    tile.marked = false;
                    tile.visible = true;
                });
            }, timeOut);
            timeOut += baseTimeOut;
        }
    }

    _checkWin() {
        const markedTiles = this.tiles.filter(tile => tile.marked);
        if (markedTiles.length === 3) {
            if (markedTiles.every(tile => tile.color === markedTiles[0].color)) {
                alert('You won!');
                this._renewTiles(markedTiles);
            } else {
                markedTiles.forEach(tile => tile.marked = false);
            }
        }
    }
}
