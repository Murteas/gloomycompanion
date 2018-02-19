'use strict';

import { document_load } from '/app/utils.js';

import eventbus from '/app/tinycentraldispatch.js';

import { ModifierDeck } from '/app/decks/modifierdeck.js';
import { AbilityDeck } from '/app/decks/abilitydeck.js';
import { ModifierDeckRenderer } from '/app/renderers/modifierdeck.js';
import { AbilityDeckRenderer } from '/app/renderers/abilitydeck.js';
import { DeckOrderer } from '/app/renderers/deckorderer.js';

class Tableau {
	constructor(container){
		this.modifier_deck_renderer;

		this.container = container;

		this.ability_decks = [];
		this.modifier_deck = undefined;

		eventbus.listen("load_scenario", undefined, (p) => this.load_scenario(p));
		eventbus.listen("load_scenario", undefined, (p) => this.set_scenario_name(p));
		
		eventbus.listen("load_deck", undefined, (p) => this.load_deck(p));
		eventbus.listen("deck_remove", undefined, (p) => this.remove_deck(p.deck))

		this.deckorderer = new DeckOrderer(this.ability_decks, this.container );
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

	 	decks.forEach((deck) => {
	 		let ability = new AbilityDeck(deck, level);
	 		ability.shuffle();
	 		this.ability_decks.push({deck: ability, renderer: null});
	 	});
	}

	render_ability_decks(){
	 	this.ability_decks.filter((tuple) => !tuple.renderer)
	 	                  .forEach((tuple) => {
		 	let container = this.create_deck_container();
			tuple.renderer = new AbilityDeckRenderer(tuple.deck, container);
	 		tuple.renderer.render();
	 		eventbus.dispatch("deck_loaded", tuple.deck, {deck: tuple.deck});
	 	});
	}

	remove_deck(removed_deck){

		let deck = this.ability_decks.find(a => a.deck === removed_deck);

		if (!deck)
			return;
		deck.renderer.remove();
		this.ability_decks = this.ability_decks.filter(a => a.deck !== removed_deck);
		eventbus.dispatch("deck_removed", removed_deck, {deck: removed_deck});
	}

	clear_container(){

		this.modifier_deck = undefined;
		this.ability_decks.forEach((deck) => this.remove_deck(deck.deck));

		while (this.container.firstChild) {
   			this.container.removeChild(this.container.firstChild);
		}
	}

	load_scenario(load){
		this.clear_container();
		this.create_modifier_deck();
		this.create_ability_decks(load.scenario.decks, load.level);
		this.render_ability_decks();
		eventbus.dispatch("scenario_loaded", this, load);
	}

	load_deck(deck){
		if (!this.modifier_deck)
			this.create_modifier_deck();
		this.create_ability_decks([deck.deck], deck.level)
		this.render_ability_decks();
	}

	set_scenario_name(load){
		let namebox = document.getElementById("scenarioname");
		namebox.textContent = (load.scenario || {name: ""}).name;
	}
}

document_load(new Tableau(document.getElementById("tableau")).activate_verbose());
