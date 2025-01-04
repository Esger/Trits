import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        const colors = ['crimson', 'olive', 'cornflowerblue'];
        const colorNames = ['crimson', 'olive', 'cornflower&shy;blue'];
        const faceOptions = ['left', 'center', 'right'];

        this.allTreats = {
            colors: {
                text: colorNames,
                color: colors,
                background: colors,
                borderRadiusEven: ['0 9in 9in 0', '9in 0 0 9in', '9in 9in 0 0'],
            },
            faces: {
                chin: faceOptions,
                hair: faceOptions,
                nose: faceOptions,
                mouth: faceOptions,
            }
        };

        this.treats = this.allTreats.faces;
    }

    attached() {
        this.tileObj.treats = this.treats;
        this.tileObj.visible = false;
        this._randomizeTreats();
        this.tileObj.visible = true;
        this._eventAggregator.publish('tile-ready');
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
