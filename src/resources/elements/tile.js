import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        const allColors = ['crimson', 'olive', 'navy', 'cornflowerblue', 'orange', 'purple', 'darkgoldenrod', 'yellowgreen'];
        const colors = ['crimson', 'olive', 'cornflowerblue'];
        const colorNames = ['crimson', 'olive', 'cornflower&shy;blue'];

        this.allTreats = {
            text: colors,
            color: colors,
            background: colors,
            borderRadiusEven: ['0 0 0 0', '0 0 9in 9in', '0 9in 0 9in', '0 9in 9in 0', '9in 0 0 9in', '9in 0 9in 0', '9in 9in 0 0', '9in 9in 9in 9in '],
            borderRadiusAll: ['0 0 0 0', '0 0 0 9in', '0 0 9in 0', '0 0 9in 9in', '0 9in 0 0', '0 9in 0 9in', '0 9in 9in 0', '0 9in 9in 9in', '9in 0 0 0', '9in 0 0 9in', '9in 0 9in 0', '9in 0 9in 9in', '9in 9in 0 0', '9in 9in 0 9in', '9in 9in 9in 0', '9in'],
            borderWidthEven: ['0 0 0 0', '0 0 .5rem .5rem', '0 .5rem 0 .5rem', '0 .5rem .5rem 0', '.5rem 0 0 .5rem', '.5rem 0 .5rem 0', '.5rem .5rem 0 0', '.5rem',],
            borderWidthAll: ['0 0 0 0', '1px 0 0 0', '0 1px 0 0', '0 0 1px 0', '0 0 0 1px', '1px 0 1px 0', '0 1px 1px 0', '1px 1px 1px 0', '1px 1px 0 0', '1px 0 1px 1px', '0 1px 1px 1px', '1px 1px 1px 1px'],
        }

        this.treats = {
            text: colorNames,
            color: colors,
            background: colors,
            borderRadiusEven: ['0 9in 9in 0', '9in 0 0 9in', '9in 9in 0 0'],
        }
    }

    attached() {
        this.tileObj.treats = this.treats;
        this._randomizeTreats();
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
        this.tileObj.marked = false;
        this.tileObj.visible = true;
    }

    _randomProperty(properties) {
        return properties[Math.floor(Math.random() * properties.length)]
    }

    _renew() {
        const timeOut = Math.random() * 500 + 500;
        setTimeout(_ => {
            this.tileObj.visible = false;
            setTimeout(_ => this._randomizeTreats(), 500);
        }, timeOut);
    }
}
