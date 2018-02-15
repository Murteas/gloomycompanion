'use strict';

import eventbus from '/app/tinycentraldispatch.js';
import { document_load } from '/app/utils.js';

import Scenarios from '/app/menu/scenarios.js';
//import { init as decklist_init } from '/app/menu/decklist.js';

class Menu {
    constructor(){
        this.menu =      document.getElementById("settingspane");

        this.pages = {
            scenarios: { tab: document.getElementById("scenariotab"), page: document.getElementById("scenariospage") },
            deck: { tab: document.getElementById("deckstab"), page: document.getElementById("deckspage") }
        };

        this.buttons = {
            settings:       document.getElementById("settingsbtn"),
            cancel:         document.getElementById("cancelarea")       
        };

        eventbus.onclick(this.pages.scenarios.tab, "settings_page", this, this.pages.scenarios);
        eventbus.onclick(this.pages.deck.tab, "settings_page", this, this.pages.deck);
        eventbus.onclick(this.buttons.settings, "settings_pane", this, {show: true});
        eventbus.onclick(this.buttons.cancel, "settings_pane", this, {show: false});

        eventbus.listen("settings_page", this, (p) => this.show_tab(p));
        eventbus.listen("settings_pane", this, (p) => this.show_settingspane(p));
        eventbus.listen("scenario_loaded", undefined, () => this.show_settingspane({show: false}));

        new Scenarios();
    }

    show_tab(param){
        Object.keys(this.pages).forEach((key) => {
            let active = this.pages[key] === param;
            this.pages[key].tab.className = (active) ? "" : "inactive";
            this.pages[key].page.className = (active) ? "tabbody" : "inactive tabbody";          
        });
    }

    show_settingspane(p)
    {
        this.menu.className = p.show ? "pane" : "pane inactive";
        this.buttons.cancel.style.display = p.show ? "initial" : "none";
    }

}

let menu;
document_load(() => menu = new Menu());

export default menu;