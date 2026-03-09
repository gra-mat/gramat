import { css, html, LitElement } from "../../lib/lit.min.js";
import { store } from "../../store.js";
import "./partial/navbar.js"
class AccountView extends LitElement {
    static properties = {
        profile: { type: Object, attribute: false },
        stats: { type: Object, attribute: false },
        points: { type: Number, attribute: false },
        achivements: { type: Array, attribute: false },
        // completed_lessons: {},
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

  .icon {
    width: 48px;
    height: 48px;
    fill: white;
    color: white;
    margin-bottom: 0.5rem;
  }

  .icon img {
    filter: brightness(0) invert(1);
  }

  .card {
    width: 65%;
    max-width: 900px;
    min-width: 320px;

    background: #2f3044;
    border-radius: 14px;
    padding: 1.1rem 1.3rem;
    margin-bottom: 0.9rem;

    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);

    display: flex;
    flex-direction:column;

  }

@media (max-width: 640px) {
  .card {
    width: 45%;
    max-width: none;
    padding: 0.85rem 1rem;
    border-radius: 12px;
  }
}

    .profile {
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

  .card:last-of-type {
    margin-bottom: 0;
  }
`;

    constructor() {
        super();
        // 
        this.profile = store.get('profile');
        store.subscribe('profile', (new_val, _old) => this.profile = new_val);
        // 
        this.stats = store.get('stats');
        store.subscribe('stats', (new_val, _old) => this.stats = new_val);
        // 
        this.points = store.get('points');
        store.subscribe('points', (new_val, _old) => this.points = new_val);
        // 

    }

    render() {
        return html`
    <div class='card'>
        <div class='profile'>
            <div class='icon'>
                <img src="${this.user?.avatarUrl ?
                this.user?.avatarUrl :
                "icons/account.svg"}" 
                    width=48 style="border-radius:50%">
            </div>
            <div class='name'> ${this.profile.name} </div>
            <div class='score'> ${(Math.max(Math.floor(this.points.points / 100)) || 1, 1)} Lvl </div>
            <div class='score'> ${(this.points.points % 100) || 0} / 100 XP </div>
        </div>
    </div>

    <div class='card'>
    <span>silne strony:</span>
    <ul>
        ${this.stats.strengths.slice(0, 3).map(strength => html`<li>${strength}</li>`)
            }
    </ul>
    <span>słabe strony:</span>
        <ul>
        ${this.stats.weaknesses.slice(0, 3).map(weakness => html`<li>${weakness}</li>`)
            }
    </ul>

    <span>sugerowane zadania:</span>
    <ul>
        ${this.stats.suggestedExercises.slice(0, 3).map(exercise => html`<li>${exercise}</li>`)
            }
    </ul>
    
    </div>

    <div class='card'>
        <span>osiągnięcia:</span>
        <ul>
        ${this.stats.suggestedExercises.slice(0, 3).map(exercise => html`<li>${exercise}</li>`)}
        </ul>
    </div>

    <x-navbar></x-navbar>
    `;
    }
}

customElements.define("x-account-view", AccountView);
