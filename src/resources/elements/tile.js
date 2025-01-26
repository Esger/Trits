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
        this._toDeckSubscription = this._eventAggregator.subscribe('tile-to-deck-ready', _ => {
            if (!this.tileObj.toBoard) return;
            this.tileObj.marked = true;
            this.tileObj.onBoard = true;
            this.tileObj.toBoard = false;
        });
        this._toBoardSubscription = this._eventAggregator.subscribe('tile-to-board-ready', tileObj => {
            if (tileObj.id !== this.tileObj.id) return;
            this.tileObj.marked = false;
            this.tileObj.toDeck = false;
            this.tileObj.toBoard = false;
        });
        this._element.addEventListener('transitionend', _ => this.deckOrBoard());
    }

    clicked() {
        this.tileObj.marked = !this.tileObj.marked;
        this._eventAggregator.publish('tile-clicked');
    }

    deckOrBoard() {
        this.tileObj.marked = false;
        if (this.tileObj.toBoard) {
            this._eventAggregator.publish('tile-to-board-ready', this.tileObj);
        }
        if (this.tileObj.toDeck) {
            this._eventAggregator.publish('tile-to-deck-ready');
        }
    }

    detached() {
        this._toDeckSubscription.dispose();
        this._toBoardSubscription.dispose();
        this._element.removeEventListener('transitionend', this.deckOrBoard);
    }

}
