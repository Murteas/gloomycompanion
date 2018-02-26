'use strict';

import { document_load } from '/app/utils.js';
import eventbus from '/app/tinycentraldispatch.js';
import Progress from '/app/progress.js';

class TurnDetect{

    constructor(){
        this.progressbar = document.getElementById("progress");
        this.progress = new Progress((percent, done) => this.show_bar(percent, done), 4000);
        this.turn = 0;

        eventbus.listen("cards_drawn", (a) => !!a.stats && a.is_active , ()=> this.progress.start());
        eventbus.listen("deck_shuffled", (a) => !!a.stats , ()=> this.progress.restart());
        eventbus.listen("scenario_loaded", undefined, () => this.reset());
    }

    decide_progress(){

    }

    reset(){
        this.turn = 0;
        eventbus.dispatch("new_turn", this, {turn: this.turn});
    }

    show_bar(percent, done){
        this.progressbar.style.width = (Math.floor(percent*100000)/1000)+"%";

        if (done){
            this.turn++;
            this.progressbar.style.width = "0%";
            eventbus.dispatch("new_turn", this, {turn: this.turn});
        }
    }
}

let detect;

document_load(() => detect = new TurnDetect() );

export default detect;