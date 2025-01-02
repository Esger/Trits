import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    hint() {
        this._eventAggregator.publish('hint');
    }

}
