'use strict';

import { UICard } from '/app/renderers/card.js';
import { DeckRenderer } from '/app/renderers/deck.js';
import eventbus from '/app/tinycentraldispatch.js'

export class ModifierDeckRenderer extends DeckRenderer {
    constructor(deck, container){
        super(deck, container)
    }
    render(){

        this.uiCards = this.deck.cards.map((c) => new UICard(c).init());

        eventbus.listen("modifier_card_added", this.deck, (e) => this.onadd(e.card));
        eventbus.listen("modifier_card_removed", this.deck, (e) => this.onremove(e.card));

        return super.render()
    }

    onadd(card) {
        var uicard = new UICard(card).init();
        uicard.attach(this.container);
        uicard.set_depth(-50);
        this.uiCards.push(uicard);
    }

    onremove(card){
        let uiCard = this.uiCards.find((uc) => uc.card === card);
        if (!uiCard)
            return;
        this.uiCards = this.uiCards.filter((uc) => uc !== uiCard);
        uiCard.detach();
    }
}

export default ModifierDeckRenderer; 
