import { css, html, LitElement } from "../../lib/lit.min.js";
import "./partial/navbar.js"

class HomeView extends LitElement {
    static properties = {
        user: { type: Object }
    };

    static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 90%;
      width: 100%;
      color: white;
      font-family: system-ui, sans-serif;
    }

    .subtitle { 
        font-size: 1.1rem; 
        margin-bottom: 2rem; 
    }

    .grid-menu {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 90%;
        max-width: 600px;
    }


    @media (min-width: 768px) {
    .grid-menu {
        grid-template-columns: repeat(3, 1fr);
    }
    }


    .aligner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .menu-card {
      background: #2f3044ff;
      border-radius: 20px;
      padding: 1rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .icon {
      width: 48px;
      height: 48px;
      margin-bottom: 0.5rem;
    }

    .icon img[src$=".svg"] {
      fill: white;
      color: white;
      filter: brightness(0) invert(1);
    }
    
    .label {
        display: block;
        margin-top: 0.5rem;
    }
  `;

    async connectedCallback() {
        super.connectedCallback();
        await this.checkSession();
    }

    // TODO: Pass user object in prop instead of using this function
    async checkSession() {
        try {
        const res = await fetch('/api/me');
        if (res.ok) {
            this.user = await res.json();
        } else {
            window.location.href = '/old/login.html';
        }
        } catch (e) {
            window.location.href = '/old/login.html'; 
        }
    }

    // TODO: Use to='/profile' instead of @click
    render() {
        return html`
    <h1>Cześć, ${this.user?.name || 'Uczniu'}!</h1>

    <div class="subtitle">Co dzisiaj robimy?</div>

    <div class="grid-menu">
        
        <x-link to='learn' class='menu-card'>
            <div class='aligner'>
                <div class='icon'>
                    <img src="icons/learn.svg" width=48>
                </div>
                <span class="label">Nauka</span>
            </div>
        </x-link>


        <x-link to='' @click=${() => window.location.href = 'old/account.html'} class='menu-card'>
          <div class='aligner'>
            <div class='icon'>
                <img src="${this.user?.avatarUrl ? (this.user?.avatarUrl == 'cashed') ? `${window.location.origin}/api/me/cashedAvatar` : this.user?.avatarUrl : "icons/account.svg"}" width=48 style="border-radius:50%">
            </div>
            <span class="label">Profil</span>
        </div>
        </x-link>

        <x-link to='/leaderboard' class='menu-card'>
            <div class='aligner'>
                <div class='icon'>
                    <img src="icons/leaderboard.svg" width=48>
                </div>
                <span class="label">Tabela wyników</span>
            </div>
        </x-link>

    </div>
    <x-navbar></x-navbar>
    `;
    }
}
customElements.define("x-home-view", HomeView);