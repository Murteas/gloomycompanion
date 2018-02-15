
'use strict';

import { document_load } from '/app/utils.js';

import eventbus from '/app/tinycentraldispatch.js';

import { ModifierDeck } from '/app/decks/modifierdeck.js';
import { AbilityDeck } from '/app/decks/abilitydeck.js';
import { ModifierDeckRenderer } from '/app/renderers/modifierdeck.js';
import { AbilityDeckRenderer } from '/app/renderers/abilitydeck.js';

class Tableau {
	constructor(container){
		this.container = container;

		this.ability_decks = [];
		this.modifier_deck = undefined;

		eventbus.listen("load_scenario", undefined, (p) => this.load_scenario(p));
		eventbus.listen("load_deck", undefined, (p) => this.load_deck(p));
	}

	activate_verbose(){
		eventbus.listen("cards_drawn", undefined, (c) => console.log(c.deck.name + ' - cards left:',  c.deck.cards.length) );
		eventbus.listen("modifier_deck_changed", undefined, console.log );
		eventbus.listen("deck_shuffled", undefined, console.log );

		window.eventbus = eventbus;
		return this;
	}

	create_deck_container(){
    	let modifier_container = document.createElement("div");
    	modifier_container.className = "card-container";
    	this.container.appendChild(modifier_container);
    	return modifier_container;
	}

	create_modifier_deck(){
	 	let modifier_container = this.create_deck_container();
	 	modifier_container.id = "modifier-container";
	 	
	 	this.modifier_deck = new ModifierDeck();
	 	this.modifier_deck.shuffle();

	 	this.modifier_deck_renderer = new ModifierDeckRenderer(this.modifier_deck, modifier_container);
	 	this.modifier_deck_renderer.render();

	 	eventbus.dispatch("deck_loaded", this.modifier_deck, {deck: this.modifier_deck});
	}

	create_ability_decks(decks, level){
	
		this.ability_decks = [];
	 	decks.forEach((deck) => {
	 			console.log(deck)
	 		let ability = new AbilityDeck(deck, level);
	 		this.ability_decks.push(ability.shuffle());
	 	});

	 	this.ability_decks.forEach((ability) => {
		 	let container = this.create_deck_container();
	 		let renderer = new AbilityDeckRenderer(ability, container);
	 		renderer.render();

	 		eventbus.dispatch("deck_loaded", ability, {deck: ability});
	 	});
	}

	clear_container(){

		this.modifier_deck = undefined;

		while (this.container.firstChild) {
   			this.container.removeChild(this.container.firstChild);
		}
	}

	load_scenario(load){
		this.clear_container();
		this.create_modifier_deck();
		this.create_ability_decks(load.scenario.decks, load.level);
		eventbus.dispatch("scenario_loaded", this, load);
	}

	load_deck(deck){
		if (!this.modifier_deck)
			this.create_modifier_deck();
		this.create_ability_decks([deck.deck], deck.level)
	}
}

document_load(new Tableau(document.getElementById("tableau")).activate_verbose());
