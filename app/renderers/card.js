'use strict';

import { toggle_class } from '/app/utils.js';

export class UICard {

    constructor(card, card_name){
        this.card = card;
        this.name = (card_name || card.type);
        this.shuffle_next_round = card.shuffle_next_round;
    }

    init(){
        this.back = this._create_card_back(this.card.content);
        this.front = this._create_card_front(this.card.content);

        this.flip_up(false);
        return this;
    }

    flip_up(faceup) {
        toggle_class(this.back, "up", !faceup);
        toggle_class(this.back, "down", faceup);

        toggle_class(this.front, "up", faceup);
        toggle_class(this.front, "down", !faceup);
    }

    set_depth(z) {
        this.back.style.zIndex = z;
        this.front.style.zIndex = z;
    }

    push_down() {
        this.back.style.zIndex -= 1;
        this.front.style.zIndex -= 1;
    }

    addClass(class_name) {
        this.front.classList.add(class_name);
        this.back.classList.add(class_name);
    }

    removeClass(class_name) {
        this.front.classList.remove(class_name);
        this.back.classList.remove(class_name);
    }

    containsClass(class_name) {
        return this.front.classList.contains(class_name);
    }

    attach(parent) {
        parent.appendChild(this.back);
        parent.appendChild(this.front);
    }

    detach(){
        this.front.remove();
        this.back.remove();
    }

    split(number, card_count){
        let width = Math.round((100 / (card_count||1)) * 100) / 100;

        this.front.style.width = width + "%";
        this.back.style.width = width + "%";

        this.front.style.marginLeft = ((width * number) + number) + "%";
        this.back.style.marginLeft = ((width * number) + number) + "%";
    }

    draw(){
        this.removeClass('shuffle');
        this.set_depth(0);
        this.addClass('pull')

        this.flip_up(true);
        this.removeClass("draw");
        this.addClass("discard");
        this.addClass("top");

        window.setTimeout(() => this.removeClass('pull'), 800);
    }

    discard(){
        this.removeClass('lift');
        this.removeClass('pull');
        this.flip_up(false);
        this.removeClass('discard');
        this.addClass('draw')
    }

    shuffle(){
        this.set_depth(-1);
        this.addClass('shuffle');
        window.setTimeout(() => this.removeClass('shuffle'), 1000);
    }

    _create_card_back() {
        var card = document.createElement("div");
        card.className = "card modifier back draw";
        return card;
    }

    _create_card_front(content) {
        var card = document.createElement("div");
        card.className = "card modifier front draw";
        card.style.backgroundImage = "url("+content.image+")";
        return card;
    }   
}

export default UICard;