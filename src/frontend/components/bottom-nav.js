import { css, html, LitElement } from "../../lib/lit.min.js";

class BottomNav extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgb(40, 43, 76);
      z-index: 1000;
      box-shadow: 0 -4px 12px rgba(18, 18, 78, 0.2);
    }
    :host(.hidden) {
      display: none !important;
    }
    button.nav-btn {
      background: transparent;
      border: none;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 56px;
      height: 56px;
      border-radius: 12px;
    }
    button.nav-btn:active {
      transform: translateY(1px);
    }
    button.nav-btn img {
      width: 28px;
      height: 28px;
      display: block;
      filter: invert(100%) brightness(100%) contrast(100%);
    }
    button.nav-btn[aria-current="true"] img {
      filter: none;
    }
  `;

  constructor() {
    super();
    this._visible = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateVisibility();
    this._applyBodyPadding(true);

    window.addEventListener('popstate', this._onLocationChangeBound = () => this._updateVisibility());
    
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._applyBodyPadding(false);
    window.removeEventListener('popstate', this._onLocationChangeBound);
  }

  _applyBodyPadding(enable) {
    try {
      if (enable) {
        const current = parseInt(getComputedStyle(document.body).paddingBottom || "0", 10) || 0;
        if (current < 80) document.body.style.paddingBottom = "80px";
      } else {
        const current = parseInt(getComputedStyle(document.body).paddingBottom || "0", 10) || 0;
        if (current <= 80) document.body.style.paddingBottom = "";
      }
    } catch (e) {}
  }

  _updateVisibility() {
    const path = window.location.pathname || window.location.href;
    const isLesson = path.endsWith('lesson.html') || path.includes('/lesson.html');
    this._visible = !isLesson;
    if (this._visible) {
      this.classList.remove('hidden');
      this._applyBodyPadding(true);
    } else {
      this.classList.add('hidden');
      this._applyBodyPadding(false);
    }
  }

  navigate(viewName) {
    this.dispatchEvent(new CustomEvent('navigate', { 
      detail: viewName,
      bubbles: true, 
      composed: true 
    }));
  }

  render() {
    return html`
      <button class="nav-btn" @click=${() => this.navigate('home')} aria-label="Home">
        <img src="icons/home.svg" alt="Home">
      </button>
      <button class="nav-btn" @click=${() => this.navigate('learn')} aria-label="Learn">
        <img src="icons/learn.svg" alt="Learn">
      </button>
      <button class="nav-btn" @click=${() => this.navigate('profile')} aria-label="Account">
        <img src="icons/account.svg" alt="Account">
      </button>
      <button class="nav-btn" @click=${() => this.navigate('settings')} aria-label="Settings">
        <img src="icons/settings.svg" alt="Settings">
      </button>
    `;
  }
}

customElements.define('bottom-nav', BottomNav);
