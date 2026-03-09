import { html, css, LitElement } from "../../lib/lit.min.js";


class Router extends LitElement {
    static properties = {
        routes: { state: true },
        currentPath: { state: true },
    };

    constructor() {
        super();
        this.routes = [];
        this.currentPath = this._getHashPath();
        this._currentData = null; // stores ephemeral navigation data
    }

    connectedCallback() {
        super.connectedCallback();

        // Listen for navigate events from x-link
        this._onNavigate = (e) => {
            const { path, data } = e.detail;
            this.go(path, data);
        };
        this.addEventListener("navigate", this._onNavigate);

        // Listen to hash changes (browser back/forward)
        this._onHashChange = () => {
            this.currentPath = this._getHashPath();
            this._currentData = null; // reset ephemeral data on manual hash change
            this._updateRouteStates();
        };
        window.addEventListener("hashchange", this._onHashChange);
    }

    disconnectedCallback() {
        this.removeEventListener("navigate", this._onNavigate);
        window.removeEventListener("hashchange", this._onHashChange);
        super.disconnectedCallback();
    }

    render() {
        return html`<slot @slotchange=${this._collectRoutes}></slot>`;
    }

    _getHashPath() {
        const hash = window.location.hash.substring(1);
        const path = hash.startsWith("/") ? hash : "/" + hash;
        return path.replace(/\/+$/, "") || "/";
    }

    _collectRoutes = () => {
        const slot = this.shadowRoot.querySelector("slot");
        if (!slot) return;

        const routeElements = slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName === "X-ROUTE");

        this.routes = routeElements.map(routeEl => ({
            element: routeEl,
            path: routeEl.getAttribute("path") || "/",
            active: false
        }));

        this._updateRouteStates();
    };

    go(path, data = null) {
        if (this._normalizePath(path) === this.currentPath) return;

        this.currentPath = this._normalizePath(path);
        this._currentData = data;

        const hashPath = this.currentPath === "/" ? "" : this.currentPath.substring(1);
        window.location.hash = hashPath;

        this._updateRouteStates();
    }

    _updateRouteStates() {
        this.routes = this.routes.map(route => {
            const active = this._matchPath(route.path, this.currentPath);
            route.element.active = active;
            return { ...route, active };
        });

        this.dispatchEvent(
            new CustomEvent("route-change", {
                detail: {
                    currentPath: this.currentPath,
                    route: this.getActiveRoute(),
                    data: this._currentData
                },
                bubbles: true,
                composed: true
            })
        );
    }

    _matchPath(routePath, currentPath) {
        return this._normalizePath(routePath) === this._normalizePath(currentPath);
    }

    _normalizePath(path) {
        if (!path) return "/";
        return path.startsWith("/") ? path.replace(/\/+$/, "") || "/" : "/" + path.replace(/\/+$/, "");
    }

    getActiveRoute() {
        return this.routes.find(r => r.active) ?? null;
    }

    getNavigationData() {
        return this._currentData ?? null;
    }
}

class Route extends LitElement {
    static properties = {
        path: { type: String },
        title: { type: String },
        active: { type: Boolean }
    };

    static styles = css`
        :host { display: block; width: 100%; }
    `;

    render() {
        if (this.active && this.title) {
            document.title = this.title;
        }
        return this.active ? html`<slot></slot>` : null;
    }
}

class Link extends LitElement {
    static properties = {
        to: { type: String },
        data: { type: Object },
    };

    static styles = css`
        :host {
            display: block;
        }

        a {
            display: block;
            width: 100%;
            height: 100%;
            color: inherit;
            text-decoration: inherit;
            cursor: pointer;
        }

        

        a:hover { text-decoration: inherit }
    `;

    render() {
        const hashPath = this.to === "/" ? "" : this.to.startsWith("/") ? this.to.substring(1) : this.to;
        const href = `#${hashPath}`;
        return html`<a href="${href}" @click=${this._onClick}><slot></slot></a>`;
    }

    _onClick(e) {
        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
        ) return;

        e.preventDefault();

        this.dispatchEvent(
            new CustomEvent("navigate", {
                detail: {
                    path: this.to.startsWith("/") ? this.to : "/" + this.to,
                    data: this.data
                },
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define("x-router", Router);
customElements.define("x-route", Route);
customElements.define("x-link", Link);
