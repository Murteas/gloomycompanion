'use strict';

import { Deck } from '/app/decks/deck.js';
import { Card } from '/app/decks/card.js';
import { DECKS, DECK_DEFINITONS } from '/app/data/cards.js'; 
import { MONSTERS } from '/app/data/monsterstats.js' 

export class AbilityDeck extends Deck{
    constructor(deckType, level) {

        let deck = DECKS[(deckType.class || deckType.name)];

        super(deck.class, deckType.name);
        
        this.cards = [];
        this.level = level + (deckType.level || 0);
        this.level = Math.max(Math.min(7, this.level), 0);

        let monster = MONSTERS[this.name];
        this.stats = monster.levels.find((l) => l.level === level);

        var deck_definition = DECK_DEFINITONS[deck.class];

        if (deckType.cards)
            deck_definition.cards = deckType.cards;
        
        deck_definition.cards.forEach((card) => {
            let clone = JSON.parse(JSON.stringify(card));
            let shuffle = clone.shift();
            var c = new Card(deck.name + " " + clone[0], shuffle, {content: clone});
            this.cards.push(c);
        });
    }

    draw(draw_count){
        if (this.shuffle_required){
            this.reset_deck().shuffle();
            return [];
        }
        super.draw(draw_count);
    }
}

export default AbilityDeck;