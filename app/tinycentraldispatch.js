
class TinyCentralDispatch {

    constructor(disable_default_listener){
        this.subscribers = {};

        if (disable_default_listener)
            return;

        // adding a default listener
        this.listen("default", undefined, console.log);
    }

    listen(event, predicate_or_source, callback){
        this.subscribers[event] = this.subscribers[event] || [];

        let event_settings = { callback: callback };

        if (typeof predicate_or_source === 'function')
            event_settings.predicate = predicate_or_source;
        else
            event_settings.source = predicate_or_source;

        this.subscribers[event].push(event_settings);
    }

    dispatch(events, invoked_by, parameters){
        parameters = parameters || {};
        events = [].concat(...[events]);

        events.forEach((event) => {

            if (!this.subscribers[event]){
                parameters["_event"] = event;
                return this.dispatch("default", invoked_by, parameters);
            }

            this.subscribers[event].filter((subscriber) => {
                if (subscriber.predicate) return subscriber.predicate(invoked_by, parameters);
                if (!subscriber.source) return true;
                if (invoked_by === subscriber.source) return true;
                return false;

            }).forEach((subscriber) => subscriber.callback(parameters));

            if (this.subscribers["*"])
                this.subscribers["*"].forEach((subscriber) => subscriber.callback(parameters));
        });
    }

    onclick(dom_element, event, invoked_by, parameters){
        if (!event) return;

        dom_element.addEventListener('click', () => {
            this.dispatch(event, invoked_by, parameters);
        });
    }

}

let eventbus = new TinyCentralDispatch();
export default eventbus;