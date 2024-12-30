import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Tile {
    @bindable value;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    bind() {
        this.value.marked = false;
    }

    clicked() {
        this.value.marked = !this.value.marked;
        this._eventAggregator.publish('tile-clicked');
    }
}
