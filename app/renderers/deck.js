'use strict';

import eventbus from '/app/tinycentraldispatch.js'
import { UICard } from '/app/renderers/card.js';

export class DeckRenderer{
    constructor(deck, container){
        this.deck = deck;
        this.container = container;
        this.uiCards = [];
        this.deck_space = container;
    }

    render(){

        this.uiCards.forEach((c, i) => {
            c.set_depth((i * -1)-1);
            c.attach(this.deck_space);
        });

        eventbus.onclick(this.deck_space, 'draw_cards', this.deck, {cards: 1});
        eventbus.listen('cards_drawn', this.deck, (p) => this.ondrawn(p.cards) );
        eventbus.listen('deck_shuffled', this.deck, (p) => this.onshuffled(p.deck) );

        return this.uiCards;
    }

    remove(){
        this.deck_space.remove();
    }

    remove_drawn(){
        this.uiCards.forEach((card, i) => {
            card.discard();
            card.set_depth((i * -1)-1);
            card.split(0);
        });
    }

    ondrawn(cards) {
        this.uiCards.forEach((c, i) => {
            c.push_down();
            c.removeClass("pull");
        });

        cards.forEach((card, i) => {
            let uiCard = this.uiCards.find((uc) => uc.card === card);
            this.move_to_top(uiCard);

            uiCard.split(i, cards.length);
            uiCard.draw();
        }); 
    }

    onshuffled(deck){

        this.remove_drawn();
        
        let uiCards = this.get_uicards_from_pile(deck);

        window.setTimeout(()=>{
            let topCard = uiCards[0];
            this.move_to_top(topCard);
            topCard.shuffle();
        },500);
    }

    get_uicards_from_pile(deck){
        return this.uiCards.filter(uicard => {
            return deck.cards.includes(uicard.card);
        });
    }

    move_to_top(uiCard){
        let topCard = this.deck_space.children[0];
        this.deck_space.insertBefore(uiCard.front,topCard);
        this.deck_space.insertBefore(uiCard.back,topCard);
    }
}

export default DeckRenderer; 
