'use strict';

import { UICard } from '/app/renderers/card.js';
import AbilityParser from '/app/renderers/abilityparser.js';

export class UIAbilityCard extends UICard {

    constructor(card, name, parser){
        super(card, name);
        this.parser = parser;
    }

    _create_card_back(content) {
        var card = document.createElement("div");
        card.className = "card ability back draw";

        var name_span = document.createElement("span");
        name_span.className = "name";
        name_span.innerText = this.name;
        card.appendChild(name_span);

        return card;
    }

    _create_card_front(content) {
        var card = document.createElement("div");
        card.className = "card ability front draw";

        var name_span = document.createElement("span");
        name_span.className = "name";
        name_span.innerText = this.name;
        card.appendChild(name_span);

        var initiative_span = document.createElement("span");
        initiative_span.className = "initiative";
        initiative_span.innerText = content.content[0];
        card.appendChild(initiative_span);        

        if (this.shuffle_next_round) {
            var shuffle_img = document.createElement("img");
            shuffle_img.src = "images/shuffle.svg";
            card.appendChild(shuffle_img);
        }

        this.parser.parse(content, card);

        return card;
    } 

}

export default UIAbilityCard;