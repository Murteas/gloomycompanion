'use strict';

import eventbus from '/app/tinycentraldispatch.js';
import { toggle_class, setup_textbox } from '/app/utils.js';

export class LevelSelector {

    constructor(container){
        this.container = container;
        this.characters = 2;
        this.level_sum = 2;
        this.level = 1;
        this.character_selection = [];

        this.form = {
            level: undefined,
            level_sum: undefined
        };
    } 

    render(){
        let header = document.createElement("li");
        header.classList.add("head")
        header.textContent = "Scenario Level";

        let levelbox = this.create_level_box();
        let characterbox = this.create_character_box();
        this.character_selector();

        this.container.appendChild(header);
        
        this.container.appendChild(characterbox);
        this.container.appendChild(document.createElement("hr"));
        this.container.appendChild(levelbox);
    }

    create_level_box(){
        let levelbox = document.createElement("li");

        let label = document.createElement("span");
        label.textContent = "Level";

        this.form.level = document.createElement("input");

        let param = { min: 7, min: 0, type: "number",
                      callback: () => {
                        var level = parseInt(this.form.level.value);
                        if (isNaN(level))
                            level = 1;
                        this.level = Math.max(Math.min(level, 7),0);;
                        this.update();
        } };
        setup_textbox(this.form.level, param);

        levelbox.appendChild(label);
        levelbox.appendChild(this.form.level);
        return levelbox;
    }

    create_character_box(){
        let levelbox = document.createElement("li");

        let label = document.createElement("span");
        label.textContent = "Level sum: ";

        this.form.level_sum = document.createElement("input");

        let param = { min: 7*6, min: 1, type: "number",
                      callback: () => {
                        this.level_sum = parseInt(this.form.level_sum.value);
                        this.calculate_level();
        } };
        setup_textbox(this.form.level_sum, param);

        levelbox.appendChild(label);
        levelbox.appendChild(this.form.level_sum);

        let chars = document.createElement("span");
        chars.textContent = "Character count: ";
        levelbox.appendChild(chars); 

        for (let i = 1; i <= 4; i++) {
            let image = document.createElement("img");
            image.src = "images/player.svg";
            image.dataset.characters = i;

            image.addEventListener("click", () => { this.characters = image.dataset.characters; this.character_selector(); });
            this.character_selection.push(image);
            levelbox.appendChild(image);
        }
        return levelbox;
    }

    character_selector(){
        this.character_selection.forEach((img, i) => {
            toggle_class(img, "selected", i < this.characters);
        });
        this.calculate_level();
    }

    calculate_level(){
        if (isNaN(this.level_sum))
            this.level_sum = 2;
        let level = Math.ceil(this.level_sum / this.characters / 2);
        this.level = Math.max(Math.min(level, 7),0);
        this.update();
    }

    update(){
        this.form.level_sum.value = this.level_sum;
        this.form.level.value = this.level;
        eventbus.dispatch("menu_level", this, {level: this.level});
    }
}

export default LevelSelector;
