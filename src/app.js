import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';

@inject(EventAggregator)
export class App {
    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }
}
