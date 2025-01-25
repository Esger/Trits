import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class Tile {
    @bindable tileObj;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
    }

    attached() {
        this._eventAggregator.publish('tile-ready');
        this.tileObj.element = this._element;
        this.tileObj.unMarkOnTransitionEnd = this.unMarkOnTransitionEnd;
    }

    clicked() {
        this.tileObj.marked = !this.tileObj.marked;
        this._eventAggregator.publish('tile-clicked');
    }

    unMarkOnTransitionEnd = _ => {
        this._element.addEventListener('transitionend', _ => {
            this.tileObj.marked = false;
        }, { once: true });
    }
}
