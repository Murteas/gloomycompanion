'use strict';

const EVENT_NAMES = {
	LOAD_SCENARIO:                  "load_scenario",
    MODIFIER_CARD_DRAWN:            "modifierCardDrawn",
    MODIFIER_DECK_SHUFFLE_REQUIRED: "modfierDeckShuffleRequired"
};

const DECK_TYPES = {
    MODIFIER: "modifier",
    ABILITY: "ability",
    BOSS: "boss"
};

export { EVENT_NAMES, DECK_TYPES };
export default {};