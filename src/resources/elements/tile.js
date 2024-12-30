import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.treats = {
            textTranform: ['capitalize', 'uppercase', 'lowercase'],
            color: ['crimson', 'olive', 'navy'],
            background: ['lightgoldenrodyellow', 'wheat', 'lightblue']
        }
    }

    attached() {
        this._randomizeTreats();
        this.tileObj.marked = false;
        this.tileObj.visible = true;
        this._renewSubscription = this._eventAggregator.subscribe('renew-tiles', tiles => {
            const renewTile = tiles.some(tile => tile.id === this.tileObj.id);
            if (renewTile)
                this._renew()
        });
    }

    detached() {
        this._renewSubscription.dispose();
    }

    clicked() {
        this.tileObj.marked = !this.tileObj.marked;
        this._eventAggregator.publish('tile-clicked');
    }

    _randomizeTreats() {
        const treats = Object.keys(this.treats);
        for (let treat of treats) {
            this.tileObj[treat] = this._randomProperty(this.treats[treat]);
        }
    }

    _randomProperty(properties) {
        return properties[Math.floor(Math.random() * properties.length)]
    }

    _renew() {
        let timeOut = 500;
        setTimeout(_ => {
            this.tileObj.visible = false;
            setTimeout(_ => {
                this._randomizeTreats();
                this.tileObj.marked = false;
                this.tileObj.visible = true;
            }, timeOut);
        }, timeOut);
    }
}
