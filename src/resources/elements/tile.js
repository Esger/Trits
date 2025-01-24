import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    attached() {
        this._eventAggregator.publish('tile-ready');
    }

    clicked() {
        this.tileObj.marked = !this.tileObj.marked;
        this._eventAggregator.publish('tile-clicked');
    }
}
