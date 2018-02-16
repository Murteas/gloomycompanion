'use strict';

import eventbus from '/app/tinycentraldispatch.js';
import { DECKS } from '/app/data/cards.js';

export class Decklist {
    constructor(){

        this.deck_add ={
            selection: document.getElementById("additional_deck"),
            level: document.getElementById("additional_deck_level"),
            apply: document.getElementById("applydeck")
        };
        this.active_decks = {
            container: document.getElementById("active_decks"),
            decks: []
        };

        this.additional_deck = {};

        Object.values(DECKS).forEach((value) => {
            if (value.name === "Boss") 
                return;
            let option = document.createElement("option");
            option.value = value.name;
            option.text = value.name;
            this.deck_add.selection.add(option);
        });
        this.deck_add.selection.value = Object.values(DECKS)[0].name;


        this.read_settings(true);

        this.register_events(this.deck_add.level);
        this.register_events(this.deck_add.selection);
        this.deck_add.level.addEventListener("focus", () => this.deck_add.level.select());

        eventbus.onclick(this.deck_add.apply, "load_deck", this, this.additional_deck);
        eventbus.listen("scenario_loaded", undefined, (a) => this.set_level_to_scenario(a));
        eventbus.listen("deck_loaded", (deck) => !!deck.stats, (a) => this.add_active_deck(a));
    }

    register_events(element){
        element.addEventListener("change", () => this.read_settings());
        element.addEventListener("blur", () => this.read_settings());
        element.addEventListener("keyup", () => this.read_settings(true));
    }

    read_settings(reset){

        this.additional_deck.deck = {name: this.deck_add.selection.value};

        var level = parseInt(this.deck_add.level.value);
        if (isNaN(level))
            level = 1;
        level = Math.min(Math.max(1,level), 7);
        this.additional_deck.level = level;

        if (!reset){
            this.deck_add.level.value = level;
        }
    }

    set_level_to_scenario(param){
        this.deck_add.level.value = param.level;
        this.read_settings();
    }

    add_active_deck(a){
        let deck = document.createElement("li");

        let span = document.createElement("span");
        span.textContent = a.deck.name + " - level " + a.deck.level;
        deck.appendChild(span);

        let shuffle = document.createElement("img");
        shuffle.src = "images/shuffle-black.svg";
        deck.appendChild(shuffle);
        eventbus.onclick(shuffle, "deck_shuffle", a.deck, {deck: a.deck});

        let remove = document.createElement("img");
        remove.src = "images/remove.svg";
        deck.appendChild(remove);
        eventbus.onclick(remove, "deck_remove", a.deck, {deck: a.deck});

        this.active_decks.container.appendChild(deck);

        eventbus.listen("deck_removed", a.deck, () => deck.remove());
    }
}

export default Decklist;