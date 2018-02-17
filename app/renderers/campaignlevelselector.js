'use strict';

export class CampaignLevelSelector {

    constructor(name, scenarios, container, callback){
        this.name = name;
        this.scenarios = scenarios;
        this.container = container;
        this.selected_scenario;
        this.selected_callback = callback;

        this.shoud_display_scenario_box = scenarios[0].name.match(/^\#?\d/);
    } 

    render(){
        let header = document.createElement("li");
        header.classList.add("head")
        header.textContent = this.name;

        this.container.appendChild(header);
        this.selectbox = this.create_selectbox(this.container);
        this.scenario_number = this.create_scenario_number(this.container);
        this.button = this.create_button(this.container);

        this.selectbox.addEventListener("change", () => this.read_settings());
        this.scenario_number.addEventListener("change", () => this.read_box_settings());
        this.scenario_number.addEventListener("keyup", () => this.delay(() => this.read_box_settings()));
    }

    create_selectbox(container){

        let scenario_listitem = document.createElement("li");
        let selectbox = document.createElement("select");
        let option = document.createElement("option");
        option.value = -1;
        option.text = "- pick scenario (name-spoilers) -";
        selectbox.add(option);  

        this.scenarios.forEach((scen, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.text = scen.name;
            selectbox.add(option);            
        });
        scenario_listitem.appendChild(selectbox);
        container.appendChild(scenario_listitem);
        return selectbox;      
    }

    create_scenario_number(container){
        if (!this.shoud_display_scenario_box)
            return document.createElement("span");

        let scenario_listitem = document.createElement("li");

        let span = document.createElement("span");
        span.textContent = "or enter scenario number";

        let number = document.createElement("input"); 
        number.setAttribute("type", "number");
        number.setAttribute("min", 0);
        number.setAttribute("max", this.scenarios.length+1);
        number.value = 0;

        scenario_listitem.appendChild(span);
        scenario_listitem.appendChild(number);
        container.appendChild(scenario_listitem);
        return number;
    }

    create_button(container){
        let button_listitem = document.createElement("li");

        let button = document.createElement("button");
        button.textContent = "load scenario";

        button.addEventListener("click", () => this.selected_callback(this.selected_scenario, this.name));

        button_listitem.appendChild(button);
        container.appendChild(button_listitem);
    }

    read_settings(){
        let value = parseInt(this.selectbox.value);
        this.selected_scenario = this.scenarios[value];
        this.scenario_number.value = value+1;
    }

    read_box_settings(){
        let value = parseInt(this.scenario_number.value);
        if (isNaN(value))
            this.scenario_number.value = value = 0;
        this.selectbox.value = value-1;
        this.read_settings();
    }

    delay(callback, timeout){
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(callback, timeout || 1500);
    }
}

export default CampaignLevelSelector;
