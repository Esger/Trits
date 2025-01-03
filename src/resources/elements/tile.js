import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        const colors = ['crimson', 'olive', 'cornflowerblue'];
        const colorNames = ['crimson', 'olive', 'cornflower&shy;blue'];

        this.allTreats = [{
            text: colorNames,
            color: colors,
            background: colors,
            borderRadiusEven: ['0 9in 9in 0', '9in 0 0 9in', '9in 9in 0 0'],
        }];

        this.treats = this.allTreats[0];
    }

    attached() {
        this.tileObj.treats = this.treats;
        const timeOut = Math.random() * 500 + 500;
        this.tileObj.visible = false;
        setTimeout(_ => {
            setTimeout(_ => this._randomizeTreats(), 500);
            this.tileObj.visible = true;
            this._eventAggregator.publish('tile-ready');
        }, timeOut);
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

}
