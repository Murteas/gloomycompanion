'use strict';

import AbilityParser from '/app/renderers/abilityparser.js';
import { UIAbilityCard } from '/app/renderers/abilitycard.js';
import { DeckRenderer } from '/app/renderers/deck.js';
import { toggle_class } from '/app/utils.js';

export class AbilityDeckRenderer extends DeckRenderer {
    constructor(deck, container){
        super(deck, container)

        this.parser = new AbilityParser(deck.stats);
        this.clean_required = false;
        eventbus.listen('decks_usage', undefined, () => this.onunused());
        eventbus.listen('new_turn', undefined, (turn) => this.clean_up(turn));
    }

    onunused(){
        if (this.deck.is_active)
            this.clean_required = false;

        window.setTimeout(() => {
            toggle_class(this.container, 'unused', !(this.deck.is_active !== false) );
        }, 100);
    }

    clean_up(turn){

        if (this.deck.is_active) return;

        if (this.clean_required){
            this.remove_drawn();
            this.deck.reset_deck().shuffle();
        }
        this.clean_required = true;
    }

    render(){

        let deckname = this.deck.name + " • " + this.deck.level;

        this.uiCards = this.deck.cards.map((c) => new UIAbilityCard(c, deckname, this.parser).init());

        return super.render()
    }
}

export default AbilityDeckRenderer; 
