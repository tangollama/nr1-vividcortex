/**
 * This is code borrowed from @javi here: https://source.datanerd.us/dataviz/dashboards/tree/fa0fae00870c1e9a043fce8c81f950af57f4b9fa/src/lib/MessageBus.
 * We're using it in this context to support the use case of two nerdlets sending messages to one another. The first is the main display screen. The second is the config screen for tht display.
 */
export default class MessageBus {

    constructor() {
        this._listeners = [];
        this._queue = [];
    }

    listen(fn) {
        this._listeners.push(fn);

        if (this._queue.length > 0) {
            this._queue.forEach((message) => {
                this.send(message);
            });

            this._queue = [];
        }
    }

    unlisten(handler) {
        this._listeners = this._listeners.filter((fn) => fn !== handler);
    }

    send(message) {
        if (this._listeners.length === 0) {
            this._queue.push(message);

            return;
        }

        this._listeners.forEach((handler) => {
            handler(message);
        });
    }
}