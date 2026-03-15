import { css, html, LitElement } from "../../lib/lit.min.js";

export class HomeView extends LitElement {
  static properties = {
    user: { type: Object }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      color: white;
      font-family: system-ui, sans-serif;
    }

    h1 { margin-bottom: 2rem; font-size: 2rem; text-align: center;}
    .subtitle { color: #a29bfe; font-size: 1.1rem; margin-bottom: 3rem; }

    .grid-menu {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1.5rem;
      width: 90%;
      max-width: 600px;
    }

    .menu-card {
      background: #2f3044ff;
      border-radius: 20px;
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .menu-card:hover {
      transform: translateY(-5px);
      background: #3f4173;
      border-color: #6c5ce7;
      box-shadow: 0 8px 25px rgba(108, 92, 231, 0.3);
    }

    .menu-card:active {
      transform: scale(0.98);
    }

    .icon {
      width: 48px;
      height: 48px;
      fill: white;
      margin-bottom: 0.5rem;
    }

    .label {
      font-size: 1.2rem;
      font-weight: bold;
    }
  `;

  navigate(viewName) {
    this.dispatchEvent(new CustomEvent('navigate', { 
      detail: viewName,
      bubbles: true, 
      composed: true 
    }));
  }

  render() {
    return html`
      <h1>Cześć, ${this.user?.name || 'Uczniu'}!</h1>
      <div class="subtitle">Co dzisiaj robimy?</div>

      <div class="grid-menu">
        <div class="menu-card" @click=${() => this.navigate('learn')}>
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
          <span class="label">Nauka</span>
        </div>

        <div class="menu-card" @click=${() => this.navigate('profile')}>
          ${this.user?.avatarUrl 
            ? html`<img src="${this.user.avatarUrl}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;">`
            : html`<svg class="icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
          }
          <span class="label">Profil</span>
        </div>

        <div class="menu-card" @click=${() => this.navigate('leaderboard')}>
          <img src="../icons/leaderboard.svg" style="filter: invert(100%) brightness(100%) contrast(100%); width: 48px; height: 48px;">
          <span class="label">Tabela wyników</span>
        </div>
      </div>
    `;
  }
}
customElements.define("x-home-view", HomeView);