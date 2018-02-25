'use strict';

import eventbus from '/app/tinycentraldispatch.js';

export class DeckOrderer{

    constructor(deck_containers, container){
        this.decks = deck_containers;
        this.container = container;
        this.previous_order = [];

        eventbus.listen("order_decks", undefined, (param) => this.order_decks(param));
    }

    matches_previous_order(decks){

        if (decks.length !== this.previous_order.length)
            return false;
        for (var i = 0; i < decks.length; i++) {
            if (decks[i] !== this.previous_order[i])
                return false;
        }
        return true;
    }

    order_decks(param){
        var last_position;

        if (this.matches_previous_order(param.ordered_decks))
            return;
        
        this.previous_order = [];
        
        param.ordered_decks.forEach(deck => {
            var subject = this.decks.find((d) => d.deck === deck );
            if (!subject) return;
            var move = subject.renderer.container;
            this.container.appendChild(move, last_position)
            last_position = move;
            this.previous_order.push(subject.deck);
        });
    }
}

export default DeckOrderer;