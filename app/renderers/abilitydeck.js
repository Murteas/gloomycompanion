'use strict';

import AbilityParser from '/app/renderers/abilityparser.js';
import { UIAbilityCard } from '/app/renderers/abilitycard.js';
import { DeckRenderer } from '/app/renderers/deck.js';
import { toggle_class } from '/app/utils.js';

export class AbilityDeckRenderer extends DeckRenderer {
    constructor(deck, container){
        super(deck, container)

        this.parser = new AbilityParser(deck.stats);
        eventbus.listen('decks_usage', undefined, () => this.onunused());
    }

    onunused(){
        window.setTimeout(() => {
            if (this.deck.is_active === false) 
                this.remove_drawn();
            toggle_class(this.deck_space, 'unused', !(this.deck.is_active !== false) );
        }, 100);
    }

    render(){

        let deckname = this.deck.name + " • " + this.deck.level;

        this.uiCards = this.deck.cards.map((c) => new UIAbilityCard(c, deckname, this.parser).init());

        return super.render()
    }
}

export default AbilityDeckRenderer; 
