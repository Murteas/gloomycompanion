'use strict';

import eventbus from '/app/tinycentraldispatch.js';
import { SCENARIO_DEFINITIONS } from '/app/data/scenarios.js';

export class Scenarios {
	constructor(){
		this.selected_scenario = {};

		this.form = {
			level: document.getElementById('scenario_level'),
			number: document.getElementById('scenario_number'),
			load: document.getElementById('applyscenario')
		};

		this.form.number.max = SCENARIO_DEFINITIONS.length;

		this.read_settings();
		eventbus.onclick(this.form.load, "load_scenario", this, this.selected_scenario);

		this.register_events(this.form.number);
		this.register_events(this.form.level);
	}

	register_events(element){
		element.addEventListener("change", () => this.read_settings());
		element.addEventListener("blur", () => this.read_settings());
		element.addEventListener("keyup", () => this.read_settings(true));
		element.addEventListener("focus", () => element.select());
	}

	read_settings(reset){
		
		var scenario = parseInt(this.form.number.value);
		if (isNaN(scenario))
			scenario = 1;
		scenario = Math.min(Math.max(1,scenario), SCENARIO_DEFINITIONS.length);
		this.selected_scenario.scenario = SCENARIO_DEFINITIONS[scenario-1];

		var level = parseInt(this.form.level.value);
		if (isNaN(level))
			level = 1;
		level = Math.min(Math.max(1,level), 7);
		this.selected_scenario.level = level;

		if (!reset){
			this.form.number.value = scenario;
			this.form.level.value = level;
		}
	}
}

export default Scenarios;