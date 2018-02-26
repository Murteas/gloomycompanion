'use strict';

import eventbus from '/app/tinycentraldispatch.js';

class DetectUnusedDecks{

    constructor(){
        this.decks_drawn = [];
        this.available_decks = [];
        eventbus.listen("new_turn", undefined, (turn) => this.detect_unused(turn));
        eventbus.listen("cards_drawn", (deck) => !!deck.stats , (e) => this.save_deck(e));
        eventbus.listen("deck_loaded", (deck) => !!deck.stats , (e) => this.available_decks.push(e.deck));
    }

    detect_unused(turn){

        if (turn.turn == 0)
            return;

        this.available_decks.forEach((deck) => deck.is_active = false);
        this.decks_drawn.forEach((deck) => deck.is_active = true);

        this.decks_drawn = [];

        this.available_decks = this.available_decks.sort((a,b) => {
            if (a.is_active===b.is_active) return 0;
            if (a.is_active) return -1;
            return 1;
        });

        eventbus.dispatch("decks_usage", undefined, {decks: this.available_decks});
        eventbus.dispatch("order_decks", undefined, {ordered_decks: this.available_decks});
    }

    save_deck(e){
        if (!e.deck.is_active){
            e.deck.is_active = true;
            eventbus.dispatch("decks_usage", undefined, {decks: [e.deck]});
        }
        this.decks_drawn.push(e.deck);
    }
}

let detect = new DetectUnusedDecks();
export default detect;