class Store {
    constructor() {
        this._state = new Map();
        this._listeners = new Map();
    }

    set(key, value) {
        const oldValue = this._state.get(key);

        if (oldValue === value) {
            return;
        }

        this._state.set(key, value);

        if (this._listeners.has(key)) {
            this._listeners.get(key).forEach(callback => callback(value, oldValue));
        }

    }

    get(key) {
        return this._state.get(key);
    }

    subscribe(key, callback) {
        if (!this._listeners.has(key)) {
            this._listeners.set(key, new Set());
        }
        this._listeners.get(key).add(callback);

        return () => this._listeners.get(key)?.delete(callback);
    }
}

export const store = new Store();