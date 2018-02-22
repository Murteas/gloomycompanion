'use strict';

import MACROS from '/app/data/macros.js';

class AbilityParser {

    constructor(stats){
        this.stats = stats;
        this.is_boss = this.stats.attack !== undefined;
    }

    parse(content, card){
        var current_depth = 0;
        var current_parent = card;

        var lines = content.content.filter((a, i) => i != 0 && a);

        let range = this.is_boss ? [this.stats.range] : [this.stats.normal.range, this.stats.elite.range];
        let attack = this.is_boss ? [this.stats.attack] : [this.stats.normal.attack, this.stats.elite.attack];
        let move = this.is_boss ? [this.stats.move] : [this.stats.normal.move, this.stats.elite.move];
        let attributes = this.is_boss ? [this.stats.attributes] : [this.stats.normal.attributes, this.stats.elite.attributes];

        if (this.is_boss){

            let specials = lines.map(function (line) {
                return this.special_to_lines(line, this.stats.special1, this.stats.special2);
            }, this);

            lines = [].concat(...specials)

            if (this.stats.immunities)
                this.immunities_to_lines(this.stats.immunities).forEach((a) => lines.push(a));
            if (this.stats.notes)
                this.notes_to_lines(this.stats.notes).forEach((a) => lines.push(a));
        }
        else {
            if (attributes)
                this.attributes_to_lines(attributes).forEach((a) => lines.push(a));
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            var new_depth = 0;
            while (line.indexOf("*") >= 0) {
                new_depth += 1;
                line = line.substr(1);
            }
            var diff = new_depth - current_depth;

            while (current_depth != new_depth) {
                if (diff > 0) {
                    // Need one level lower, create <ul>
                    var list = document.createElement("ul");
                    // Dynamically adapt the size to the line length. I found this the sweet spot to read all the cards
                    if (lines.length > 5) {
                        list.style.fontSize = (100 - (lines.length * 2.5)) + "%";
                    }
                    current_parent.appendChild(list);
                    current_parent = list;

                    // Create <li>
                    var list_item = document.createElement("li");
                    current_parent.appendChild(list_item);
                    current_parent = list_item;

                    current_depth += 1;
                }
                else {
                    // Need to go up in the list, pop <li>
                    current_parent = current_parent.parentElement;

                    // pop <ul>
                    current_parent = current_parent.parentElement;

                    current_depth -= 1;
                }
            }

            if ((current_depth > 0) && (diff <= 0)) {
                // Same level, pop the previous <li>
                current_parent = current_parent.parentElement;

                // create sibling <li>
                var list_item = document.createElement("li");
                current_parent.appendChild(list_item);
                current_parent = list_item;
            }

            var text = this.expand_string(line.trim(), attack, move, range);
            current_parent.insertAdjacentHTML("beforeend", text);
        }        
    }

    expand_macro(macro)
    {
        var key = macro.toLowerCase();
        if (key in MACROS)
        {
            return MACROS[key];
        }
        else
        {
            return macro;
        }
    }

    expand_stat(s, stat, value)
    {
        var re = new RegExp("%" + stat + "% (\\+|-)(\\d*)", "g");
        var line_parsed = re.exec(s);
        
        var has_elite_value = (value.length == 2);
        var normal_attack = value[0];
        //Check in case of bosses with text in the attack (C+1)
        re = new RegExp("(\\d*)(\\+|-)?([a-zA-Z]+)", "i");
        var extra_text_for_particular_bosses = "";
        var value_parsed = re.exec(String(normal_attack));
        if (value_parsed && value_parsed[3])
        {
            var symbol = (value_parsed[2] == "-") ? "-" : "+";
            extra_text_for_particular_bosses = value_parsed[3] + symbol;
            normal_attack = (value_parsed[1] !== "") ? parseInt(value_parsed[1]) : 0;
        }

        if (line_parsed) {
            if (line_parsed[1] === "+")
            {
                var value_normal = normal_attack + parseInt(line_parsed[2]);
                if (has_elite_value)
                {
                    var value_elite = value[1] + parseInt(line_parsed[2]);
                    return ("%" + stat + "% " + value_normal + " / <span class='elite-color'>" + value_elite + "</span>");
                } else
                {
                     return ("%" + stat + "% " + extra_text_for_particular_bosses + value_normal);
                }
            } else if (line_parsed[1] === "-")
            {
                var value_normal = normal_attack - parseInt(line_parsed[2]);
                if (has_elite_value)
                {
                    var value_elite = value[1] - parseInt(line_parsed[2]);
                    return ("%" + stat + "% " + value_normal + " / <span class='elite-color'>" + value_elite + "</span>");
                } else
                {
                     return ("%" + stat + "% " + extra_text_for_particular_bosses + value_normal);
                }
            }
        }

        return s;
    }

    attributes_to_lines(attributes)
    {
        if (!attributes || (attributes[0].length == 0 && attributes[1].length == 0))
        {
            return [];
        } else
        {
            // To make it more readable, group 3 elements in the same row abd naje them small
            var attributes_lines = ["* Attributes"];

            // Write common attributes in white
            var normal_attributes_lines = [];
            var line = 0;
            for (var i=0; i<attributes[0].length; i++)
            {
                normal_attributes_lines[line] = normal_attributes_lines[line] ? normal_attributes_lines[line] + attributes[0][i] + ", " : attributes[0][i] + ", ";
                if ((i+1) % 3 == 0 )
                {
                    line++;
                }
            }
            attributes_lines = attributes_lines.concat(normal_attributes_lines.map(function(line) { return line ? "**" + line.replace(/(,\s$)/g, "") : "";}));

            // Write elite attributes in Gold
            var elite_attributes_lines = [];
            // TODO
            // In case we want to show Common and Elite only attributes
            // var elite_attributes = attributes[1].map(function(elite_attribute){
            //     return ((attributes[0].indexOf(elite_attribute) == -1) ? elite_attribute: "")
            // });
            line = 0;
            for (var i=0; i<attributes[1].length; i++)
            {
                elite_attributes_lines[line] = elite_attributes_lines[line] ? elite_attributes_lines[line] + attributes[1][i] + ", " : attributes[1][i] + ", ";
                if ((i+1) % 3 == 0 )
                {
                    line++;
                }
            }
            
            return attributes_lines.concat(elite_attributes_lines.map(function(line) { return line ? "** <span class='elite-color'>" + line.replace(/(,\s$)/g, "") + "</span>" : "";}));
        }
    }

    immunities_to_lines(immunities)
    {
        if (!immunities)
        {
            return [];
        } else
        {
            // To make it more readable, group 3 elements in the same row abd naje them small
            var immunities_lines = [];
            var line = 0;
            for (var i=0; i<immunities.length; i++)
            {
                immunities_lines[line] = immunities_lines[line] ? immunities_lines[line] + immunities[i] + ", " : immunities[i] + ", ";
                if ((i+1) % 3 == 0 )
                {
                    line++;
                }
            }
            return ["* Immunities"].concat(immunities_lines.map(function(line) { return "** <span class='small'>" + line.replace(/(,\s$)/g, "") + "</span>"}));
        }
    }

    notes_to_lines(notes)
    {
        return ["* <span class='small'> Notes: " + notes + "</span>"];
    }

    expand_special(s, special_value)
    {
        var value = "";

        return special_value.map(function(line){
            return ("* " + line);
        });
    }

    special_to_lines(s, special1, special2)
    {
        if (special1 && s.indexOf("Special 1") !== -1)
        {
            s = this.expand_special(s, special1);
        }
        if (special1 && s.indexOf("Special 2") !== -1)
        {
            s = this.expand_special(s, special2);
        }

        return s;
    }

    expand_string(s, attack, move, range)
    {
        var re = new RegExp("%(attack|move|range)% (\\+|-)(\\d*)", "g");
        var found;
        while (found = re.exec(s))
        {
            if (found[1] === "attack")
            {
                s = s.replace(found[0], this.expand_stat(found[0], "attack", attack));
            } else if  (found[1] === "move")
            {
                s = s.replace(found[0], this.expand_stat(found[0], "move", move));
            } else if (found[1] === "range")
            {
                s = s.replace(found[0], this.expand_stat(found[0], "range", range));
            }
        }

        return s.replace(/%[^%]*%/gi, this.expand_macro);
    }

}

export default AbilityParser;