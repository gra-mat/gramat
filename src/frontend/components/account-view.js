import { css, html, LitElement } from "../../lib/lit.min.js";

class AccountView extends LitElement {
  static properties = {
    //userId: { type: Number, attribute: 'user-id' },
    userData: { type: Object },
    isSettingsOpen: { type: Boolean },
    isMistakesOpen: { type: Boolean },
    isWeaknessesOpen: { type: Boolean },
    userMistakes: { type: Array },
    userWeaknesses: { type: Array },
  };

  constructor() {
    super();
    this.loggedIn = false;
    this.userData = null;
    this.isSettingsOpen = false;
    this.isMistakesOpen = false;
    this.isWeaknessesOpen = false;
    this.userMistakes = []; // (tymczasowe przykladowe dane)
    this.userWeaknesses = []; // (tymczasowe przykladowe dane)
    this.fetchAccountData();
  }

  static styles = css`
    :host {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #373a68ff;
        font-family: system-ui, sans-serif;
        color: white;
    }

    .container {
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        font-size: 2.0rem;
        font-weight: 700;
        margin-bottom: 1.7rem;
    }

    .card {
        background: #2f3044ff;
        border-radius: 16px;
        padding: 1.2rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        margin-bottom: 1.3rem;
        box-sizing: border-box;
        overflow: hidden;
    }

    .avatar-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    .button-group .btn {
      flex: 1;
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      transition: background 0.2s;
      
    }
    .button-group .btn.mistakes {
      background: #f45757;
      box-shadow: 0 5px 0 #833636ff;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    .button-group .btn.mistakes:hover {
      background: #ff6b6b;
    }
    .button-group .btn.weaknesses {
      background: #6b6b99;
      box-shadow: 0 5px 0 #4c4c7eff;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    .button-group .btn.weaknesses:hover {
      background: #7b75b1;
    }

    .button-group .btn.mistakes:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #833636ff;
    }

    .button-group .btn.weaknesses:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #4c4c7eff;
    }

    .avatar {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: #e0e0e0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info {
        font-size: 1.05rem;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 0.4rem 0;
        border-bottom: 1px solid #eee;
    }
    .info-item:last-child {
        border-bottom: none;
    }

    .value {
        font-weight: 500;
        word-break: break-all;
        text-align: right;
    }

    .settings-btn {
        position: relative;
        width: 100%;
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 12px;
        border: none;
        background: #6b6b99ff;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
        box-shadow: 0 5px 0 #4c4c7eff;
        transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    .settings-btn:hover {
        background: #7b75b1ff;
    }

    .settings-btn:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #4c4c7eff;
    }
    .settings-btn .icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        pointer-events: none;
    }

     /* Styles for modals */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s, visibility 0.2s;
    }

    .modal.open {
      visibility: visible;
      opacity: 1;
    }

    .modal-content {
      background: #2f3044ff;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      box-sizing: border-box;
    }

    .modal-header {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1.2rem;
      text-align: center;
    }

    .modal-item {
      margin: 1rem 0;
    }

    .modal-item label {
      display: block;
      margin-bottom: 0.4rem;
    }

    .modal-item button {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: none;
      background-color: #6166acff;
      color: white;
      cursor: pointer;
      font-size: 1rem;
    }

    .modal-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .modal-list li {
      background: #3f4173;
      margin: 0.5rem 0;
      padding: 0.75rem;
      border-radius: 8px;
    }

    .modal-close {
      text-align: center;
      margin-top: 1.5rem;
      color: #7b75b1;
      cursor: pointer;
      text-decoration: underline;
    }

    .section-title {
        font-weight: 600;
        margin-bottom: 0.6rem;
    }

    .double-columns {
        display: flex;
        flex-wrap: wrap;
        gap: 1.3rem;
        margin-bottom: 1.3rem;
    }
    .double-columns .card {
        flex: 1 1 320px;
        min-width: 260px;
        margin-bottom: 0;
    }

    .lesson-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .lesson-list li {
        padding: 0.6rem 0;
        border-bottom: 1px solid #eee;
        font-size: 1rem;
    }
    .lesson-list li:last-child {
        border-bottom: none;
    }

    .achievement-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.6rem;
        width: 100%;
        min-height: 0;
        box-sizing: border-box;
    }
    .achievement {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #4f5175ff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
    }
    .achievement img {
        width: 70%;
        height: 70%;
        object-fit: contain;
    }

    @media (max-width: 960px) {
        .container {
        max-width: 100vw;
        padding: 0 1.5rem;
        }
    }

    @media (max-width: 799px) {
        .double-columns {
        flex-direction: column;
        gap: 1rem;
        }
    }

    @media (max-width: 600px) {
        :host {
            align-items: flex-start !important;
            padding-top: 1.5rem;
            min-height: 100vh;
        }
        .container {
            max-width: 100vw;
            padding: 0 0.3rem;
        }
        .card {
            border-radius: 10px;
            padding: 0.7rem;
            margin-bottom: 1rem;
        }
        .header {
            font-size: 1.3rem;
        }
        .section-title {
            font-size: 1rem;
        }
        .avatar {
            width: 70px; height: 70px;
        }
        .achievement-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .achievement {
            aspect-ratio: unset;
            height: 72px;
            min-height: 50px;
        }
        .modal-content {
          width: 95%;
          padding: 1.5rem;
        }
        .modal-header {
          font-size: 1.2rem;
        }
    }
    `;

  // updated(changedProps) {
  //   // jak po raz pierwszy pojawi sie ID lub sie zmieni to
  //   if (changedProps.has('userId') && this.userId) {
  //     this.fetchAccountData();
  //   }
  // }

 async fetchAccountData() {
    try {
      const res = await fetch('/api/me');
      
      if (res.status === 401) {
        this.loggedIn = false;
        window.location.href = '/index.html'; 
        return;
      }
      
      if (res.status !== 200) throw new Error("Error fetching user data");
      
      this.userData = await res.json();

      this.userMistakes = [
        'Zadanie 1: 2+2=6',
        'Zadanie 4: 10-3=8',
        'Zadanie 7: 7*2=15',
      ];
      this.userWeaknesses = ['Dodawanie do 10', 'Mnożenie liczb jednocyfrowych'];

    } catch (err) {
      console.error(err);
    }
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  toggleMistakes() {
    this.isMistakesOpen = !this.isMistakesOpen;
  }

  toggleWeaknesses() {
    this.isWeaknessesOpen = !this.isWeaknessesOpen;
  }

  resetPoints() {
    if (confirm('Czy na pewno chcesz zresetować swoje punkty?')) {
      alert('Punkty zostały zresetowane (symulacja na razie).');
    }
  }

  updateVisibility(event) {
    const visibility = event.target.checked ? 'publiczny' : 'niepubliczny';
    alert(`Profil jest teraz ${visibility} (symulacja na razie).`);
  }

  render() {
    if (!this.userData) {
      return html`<div class="header">Ładowanie danych konta...</div>`;
    }
    return html`
    <div class="container">
      <div class="header">Konto</div>

      <div class="card">
        <div class="avatar-wrapper">
          ${this.userData.avatarUrl
            ? html`<img class="avatar" src="${this.userData.avatarUrl}" alt="Avatar" />`
            : html`
                <div class="avatar">
                  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none">
                    <circle cx="48" cy="48" r="48" fill="#e0e0e0"/>
                    <ellipse cx="48" cy="41" rx="18" ry="18" fill="#bbbbbb"/>
                    <ellipse cx="48" cy="75" rx="27" ry="16" fill="#bbbbbb"/>
                  </svg>
                </div>
              `}
        </div>

        <div class="info">
          <div class="info-item">
            <span class="label">user_id</span>
            <span class="value">${this.userData.id}</span>
          </div>
          <div class="info-item">
            <span class="label">user_name</span>
            <span class="value">${this.userData.name}</span>
          </div>
          <div class="info-item">
            <span class="label">user_email</span>
            <span class="value">${this.userData.email}</span>
          </div>
          <div class="info-item">
            <span class="label">user_permissions</span>
            <span class="value">${this.userData.permissions}</span>
          </div>
          <div class="info-item">
            <span class="label">user_points</span>
            <span class="value">${this.userData.points}</span>
          </div>
        </div>

        <button class="settings-btn" @click=${this.toggleSettings}>
          <img src="../icons/settings.svg" class="icon" alt="">
          Ustawienia konta
        </button>

        <div class="button-group">
          <button class="btn mistakes" @click=${this.toggleMistakes}>Pomyłki</button>
          <button class="btn weaknesses" @click=${this.toggleWeaknesses}>Słabe strony</button>
        </div>

        <!-- Settings Modal -->
        <div class="modal ${this.isSettingsOpen ? 'open' : ''}">
          <div class="modal-content">
            <div class="modal-header">Ustawienia konta</div>

            <div class="modal-item">
              <label>
                <input type="checkbox" @change=${this.updateVisibility} />
                Profil widoczny dla innych użytkowników
              </label>
            </div>

            <div class="modal-item">
              <button @click=${this.resetPoints}>Resetuj punkty</button>
            </div>

            <div class="modal-close" @click=${this.toggleSettings}>Zamknij ustawienia</div>
          </div>
        </div>

        <!-- Mistakes Modal -->
      <div class="modal ${this.isMistakesOpen ? 'open' : ''}">
        <div class="modal-content">
          <div class="modal-header">Pomyłki</div>
          <ul class="modal-list">
            ${this.userMistakes.map((mistake) => html`<li>${mistake}</li>`)}
          </ul>
          <div class="modal-close" @click=${this.toggleMistakes}>Zamknij</div>
        </div>
      </div>

      <!-- Weaknesses Modal -->
      <div class="modal ${this.isWeaknessesOpen ? 'open' : ''}">
        <div class="modal-content">
          <div class="modal-header">Słabe strony</div>
          <ul class="modal-list">
            ${this.userWeaknesses.map((weakness) => html`<li>${weakness}</li>`)}
          </ul>
          <div class="modal-close" @click=${this.toggleWeaknesses}>Zamknij</div>
        </div>
      </div>
        
        <button class="settings-btn" @click=${() => window.location.href = '/logout'}>
            Wyloguj się
        </button>
      </div>

      <div class="double-columns">
        <div class="card">
          <div class="section-title">Ukończone lekcje</div>
          <ul class="lesson-list">
            <li>Lekcja 1 - Dodawanie do 10</li>
            <li>Lekcja 2</li>
            <li>Lekcja 3</li>
            <li>Lekcja 4</li>
            <li>Lekcja 5</li>
            <li>Lekcja 6</li>
            <li>Lekcja 7</li>
            <li>Lekcja 8</li>
          </ul>
        </div>
        <div class="card">
          <div class="section-title">Osiągnięcia</div>
          <div class="achievement-grid">
            <div class="achievement">obrazek here</div>
            <div class="achievement">obrazek here</div>
            <div class="achievement">obrazek here</div>
            <div class="achievement">obrazek here</div>
          </div>
        </div>
      </div>
    </div>`;
  }
}

customElements.define("x-account-view", AccountView);