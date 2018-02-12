'use strict';

import { Deck, Card } from '/app/decks/deck.js';
import { DECK_TYPES, EVENT_NAMES } from '/app/constants.js';
import { listen } from '/app/utils.js';
import { MODIFIER_DECK, MODIFIER_CARDS, CARD_TYPES_MODIFIER } from '/app/data/modifiercards.js';

export class ModifierDeck extends Deck {
    constructor() {
    	super(DECK_TYPES.MODIFIER, "Monster modifier deck");

    	this.advantage_to_clean = false;

    	this.cards = [];
		MODIFIER_DECK.forEach((card) => {
    		var c = new Card(card.type, card.shuffle, {image: card.image});
    		this.cards.push(c);
    	});
    }

    count(card_type){
    	var c = 0;
    	this.cards.forEach((card) => {
    		if (card.type == card_type) c++;
    	});
    	return c;
    }

    add(card_type){
    	let c;
    	if (card_type === CARD_TYPES_MODIFIER.BLESS)
    		c = new Card(MODIFIER_CARDS.BLESS.type, MODIFIER_CARDS.BLESS.shuffle, {image: MODIFIER_CARDS.BLESS.image});
    	else if (card_type === CARD_TYPES_MODIFIER.CURSE)
    		c = new Card(MODIFIER_CARDS.CURSE.type, MODIFIER_CARDS.CURSE.shuffle, {image: MODIFIER_CARDS.CURSE.image});
    	else 
    		return false;

    	if (this.count(c.type) >= 10)
    		return 10;

    	this.cards.push(c);
        this._onadd(c);
    	this.shuffle();
		return this.count(c.type);
    }

    remove(card_type){	
        var removed_card;

    	this.cards = this.cards.filter((c) => {
    		if (removed_card) return true;	
    		if (c.type === card_type){
                removed_card = c;
    			return false;
    		}
    	});

        if (removed_card)
            this._onremove(removed_card);
    	this.shuffle();
		return this.count(card_type);
    }
    
    reset_deck(){
        const special = [CARD_TYPES_MODIFIER.BLESS, CARD_TYPES_MODIFIER.CURSE];
        
        let removed = this.discard.filter((card) => special.includes(card.type));
    	this.discard = this.discard.filter((card) => !special.includes(card.type));

        removed.forEach(this._onremove);

    	return super.reset_deck();
    }
}