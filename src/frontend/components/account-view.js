import { css, html, LitElement } from "../../lib/lit.min.js";

class AccountView extends LitElement {
  static properties = {
    //userId: { type: Number, attribute: 'user-id' },
    userData: { type: Object },
  };

  constructor() {
    super();
    this.loggedIn = false;
    this.userData = null;
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
    }
    .settings-btn:hover {
        background: #7b75b1ff;
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
      // jak bedzie zle ID
      // if (!this.userId || isNaN(Number(this.userId))) {
      //   console.error('userId is not set or invalid');
      //   return;
      // }
      const res = await fetch('/user/logged');
      if (res.status === 401) {
        this.loggedIn = false;
        window.location.href = '/login';
        return;
      }
      if (res.status !== 200) throw new Error("Error fetching user data");
      this.userData = await res.json();
    } catch (err) {
      console.error(err);
    }
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

        <button class="settings-btn">
            <img src="../icons/settings.svg" class="icon" alt="">
            Ustawienia konta
        </button>

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