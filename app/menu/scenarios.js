'use strict';

import eventbus from '/app/tinycentraldispatch.js';
import { CAMPAIGNS } from '/app/data/scenarios.js';
import CampaignLevelSelector from '/app/renderers/campaignlevelselector.js'

export class Scenarios {
	constructor(){
		this.selected_scenario = {};

		this.form = {
			level: document.getElementById('scenario_level'),
			load: document.getElementById('applyscenario'),
			campaigns: document.getElementById('campaigns')
		};

		Object.keys(CAMPAIGNS).forEach((key) => {
			let selector = new CampaignLevelSelector(key, CAMPAIGNS[key], this.form.campaigns, (scen, campaign) => this.load_scenario(scen, campaign) );
			selector.render();
		});

		this.register_events(this.form.level);
		this.read_settings(true);
	}

	load_scenario(scenario, campaign){
		this.selected_scenario.scenario = scenario; 
		this.selected_scenario.campaign = campaign;
		
		eventbus.dispatch("load_scenario", this, this.selected_scenario); 
	}

	register_events(element){
		element.addEventListener("change", () => this.read_settings());
		element.addEventListener("blur", () => this.read_settings());
		element.addEventListener("keyup", () => this.read_settings(true));
		element.addEventListener("focus", () => element.select());
	}

	read_settings(reset){

		var level = parseInt(this.form.level.value);
		if (isNaN(level))
			level = 1;
		level = Math.min(Math.max(1,level), 7);
		this.selected_scenario.level = level;

		if (!reset){
			this.form.level.value = level;
		}
	}
}

export default Scenarios;