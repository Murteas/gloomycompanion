'use strict';

import eventbus from '/app/tinycentraldispatch.js';

export class Deck {
    constructor(type, name) {

        this.name = name;
        this.type = type;
        this.shuffle_required = false;
        this.is_active = true;
        
        this.cards = [];
        this.discard = [];

        eventbus.listen("draw_cards", this, (p) => this.draw(p.cards));
        eventbus.listen("deck_shuffle", this, () => { this.shuffle_required = true; this.reset_deck().shuffle();});
    }
    shuffle(){
        var array = this.cards;
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        
        this.cards = array;
        eventbus.dispatch("deck_shuffled", this, {deck: this});
        this.shuffle_required = false;
        return this;
    }
    draw(draw_count, already_drawn){
        draw_count = draw_count || 1;
        let drawn = already_drawn || [];

        do {
            if (this.cards.length === 0)
                return this.reset_deck().shuffle().draw(draw_count, drawn);

            let card = this.cards.shift();
            drawn.push(card);
            
            this.shuffle_required = card.shuffle_next_round || this.shuffle_required;
            if (card.shuffle_next_round)
                eventbus.dispatch("shuffle_required", this, {deck: this});
        } while (draw_count-- > 1);

        drawn.forEach((c) => this.discard.push(c));
        eventbus.dispatch("cards_drawn", this, {cards: drawn, deck: this});
        return drawn;
    }
    reset_deck(){
        if (!this.shuffle_required)
            return {shuffle: ()=>{}};

        while (this.discard.length > 0){
            var c = this.discard.pop();
            if (c)
                this.cards.push(c);
        }
        return this;
    }
    render(){
        return false;
    }
}

export default Deck;