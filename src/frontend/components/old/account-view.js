import { css, html, LitElement } from "../../lib/lit.min.js";

class AccountView extends LitElement {
  static properties = {
    //userId: { type: Number, attribute: 'user-id' },
    userData: { type: Object },
    achievementsData: { type: Object },
    unlockedAchievementsData: { type: Object },
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
    this.achievementsData = null;
    this.unlockedAchievementsData = null;
    this.isSettingsOpen = false;
    this.isMistakesOpen = false;
    this.isWeaknessesOpen = false;
    this.userMistakes = []; // (tymczasowe przykladowe dane)
    this.userWeaknesses = []; // (tymczasowe przykladowe dane)
    this.fetchAccountData();
  }

  static styles = css`
    :host {
      display: block;
      background: #373a68ff;
      font-family: system-ui, sans-serif;
      color: white;
      box-sizing: border-box;
      padding: 18px 12px;
      width: 100%;
      height: 100%;
      max-width: 100vw;
      min-height: 100dvh;
      overflow-x: hidden;
    }

    .container {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .header {
        display: none;
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

    .profile-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.6rem 0;
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
        font-size: 36px;
        font-weight: 700;
        color: #2b2b2b;
        flex: 0 0 auto;
    }

    .profile-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      justify-content: center;
    }

    .profile-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
    }

    .profile-level {
      font-size: 0.95rem;
      color: #b8b8e5;
      font-weight: 600;
    }

    .profile-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-top: 0.6rem;
    }
    .small-badge {
      background: rgba(255,255,255,0.04);
      color: #dfe3ff;
      padding: 6px 10px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .achievements-wrapper {
      margin-bottom: 1rem;
    }
      
    .achievement-grid {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(auto-fill, 128px);
      gap: 12px;
      justify-content: start;
      width: 100%;
      min-height: 0;
      box-sizing: border-box;
      padding: 8px 0;
    }

    .achievement {
      width: 128px;
      height: 128px;
      background: #4f5175f0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      overflow: hidden;
      transition: transform .18s ease, box-shadow .18s ease;
    }

    .achievement img {
      width: 80%;
      height: 80%;
      object-fit: contain;
      pointer-events: none;
    }

    .achievement.locked {
      filter: grayscale(100%) brightness(.6);
      opacity: 0.85;
    }

    .achievement:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 22px rgba(0,0,0,0.28);
    }

    .lessons-wrapper {
      margin-top: 0.6rem;
    }

    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.8rem;
    }

    .two-col {
      display: block;
      gap: 1rem;
    }

    @media (min-width: 960px) {
      .two-col {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
        align-items: start;
      }
    }

    .lesson-tile {
      border: none;
      background: rgba(255,255,255,0.02);
      text-align: left;
    }

    .lesson-tile.locked { opacity: 0.55; filter: grayscale(50%); }
    .lesson-tile.done { background: linear-gradient(90deg,#3f7f5fff,#2e8f6b22); }

    .lesson-tile { display:flex; align-items:center; padding:10px; border-radius:12px; cursor: pointer; }
    .lesson-tile .lesson-thumb { width:56px; height:56px; border-radius:10px; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .lesson-tile .lesson-thumb img { width:72%; height:72%; object-fit:contain; }

    .lesson-tile {
      display: flex;
      gap: 10px;
      align-items: center;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      padding: 10px;
      cursor: default;
      user-select: none;
      transition: transform .16s ease, box-shadow .16s ease, background .12s ease;
      box-shadow: inset 0 -3px 0 rgba(0,0,0,0.08);
    }
    .lesson-tile:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.18);
      background: rgba(255,255,255,0.04);
    }

    .lesson-thumb {
      width: 56px;
      height: 56px;
      border-radius: 10px;
      background: #3f4173;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }

    .lesson-thumb img { width: 70%; height: 70%; object-fit: contain; }
    .lesson-title { font-weight: 600; color: #dfe3ff; font-size: 0.95rem; }

    .button-row {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    .btn {
      flex: 1;
      padding: 10px 12px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(90deg,#6166ac,#7b75b1);
      color: #fff;
      cursor: pointer;
      font-weight: 700;
      box-shadow: 0 6px 0 rgba(0,0,0,0.15);
      transition: transform .14s ease, box-shadow .14s ease, opacity .12s;
    }
    .btn:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(0,0,0,0.12); }
    .btn.negative { background: linear-gradient(90deg,#f06b6b,#d15b5b); }

    .settings-btn {
        margin-top: 12px;
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(90deg,#6b6b99,#8a86c9);
        color: white;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
    }

    .modal {
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,0.5);
      z-index: 50;
      visibility: hidden;
      opacity: 0;
      transition: opacity .18s ease, visibility .18s;
    }

    .modal.open { visibility: visible; opacity: 1; }
    .modal-content {
      width: 92%;
      max-width: 520px;
      background: #2f3044;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 18px 60px rgba(0,0,0,0.5);
    }

    .modal-header { font-size: 1.2rem; margin-bottom: 12px; font-weight: 700; color: #e8e9ff; }
    .modal-row { display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); color: #dfe3ff; }
    .modal-actions { margin-top: 12px; display:flex; gap:8px; justify-content:flex-end; }

    @media (max-width: 900px) {
      .container { max-width: 720px; }
      .avatar { width: 80px; height: 80px; font-size: 30px; }
    }

    @media (max-width: 600px) {
      .achievement-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .achievement { width: auto; height: 92px; }
      .lesson-tile { padding: 8px; }
      .button-row { flex-direction: column; }
      .settings-btn { padding: 10px; }
    }
  `;

  async fetchAccountData() {
    try {
      const res = await fetch('/api/me');
      
      if (res.status === 401) {
        this.loggedIn = false;
        window.location.href = '/login.html'; 
        return;
      }
      
      if (res.status !== 200) throw new Error("Error fetching user data");
      
      this.userData = await res.json();

      if (!this.userData.completedLessons) {
        this.userData.completedLessons = [
          { id: '1', name: 'Dodawanie do 10', image: '../icons/lesson1.svg', done: true },
          { id: '2', name: 'Dodawanie do 100', image: '../icons/lesson2.svg', done: true },
          { id: '3', name: 'Odejmowanie do 10', image: '../icons/lesson3.svg', done: false },
          { id: '4', name: 'Odejmowanie do 100', image: '../icons/lesson4.svg', done: false },
        ];
      }

      this.userMistakes = [
        'Zadanie 1: 2+2=6',
        'Zadanie 4: 10-3=8',
        'Zadanie 7: 7*2=15',
      ];
      this.userWeaknesses = ['Dodawanie do 10', 'Mnożenie liczb jednocyfrowych'];

      const achRes = await fetch('/api/achievement/');
      if (achRes.status !== 200) throw new Error("Error fetching achievements data");      
      this.achievementsData = await achRes.json();

      const unlAchRes = await fetch('/api/me/unlockedAchievements');
      if (unlAchRes.status !== 200) throw new Error("Error fetching unlocked achievements data");
      this.unlockedAchievementsData = await unlAchRes.json();

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
    if (!this.userData || !this.achievementsData || !this.unlockedAchievementsData) {
      return html`<div class="container"><div class="card">Ładowanie danych konta...</div></div>`;
    }

    const lvl = this.userData.level ?? (this.userData.points ? Math.max(1, Math.floor(this.userData.points / 100)) : 1);

    return html`
    <div class="container">
      <div class="card">
        <div class="profile-row">
          ${this.userData.avatarUrl
            ? html`<div class="avatar"><img src="${this.userData.avatarUrl}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" /></div>`
            : html`<div class="avatar">${(this.userData.name || 'U')[0]}</div>`}
          <div class="profile-meta">
            <div class="profile-name">${this.userData.name}</div>
            <div class="profile-level">Lvl ${lvl} • ${this.userData.points ?? 0} XP</div>
            <div class="profile-actions">
              <div class="small-badge">Rank: Beginner</div>
              <div style="width:8px"></div>
              <div class="small-badge">${this.userData.completedLessonsCount ?? 0} lessons</div>
            </div>
            <button class="settings-btn" @click=${this.toggleSettings}>Ustawienia konta</button>
          </div>
        </div>

        <div class="button-row" style="margin-top:10px">
          <button class="btn" @click=${this.toggleMistakes}>Pomyłki</button>
          <button class="btn" @click=${this.toggleWeaknesses}>Słabe strony</button>
          <button class="btn negative" @click=${() => window.location.href = '/logout'}>Wyloguj się</button>
        </div>
      </div>

      <div class="two-col">
        <div class="card achievements-wrapper">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div class="section-title">Osiągnięcia</div>
            <div style="color:#cfcff6;font-weight:600">${this.unlockedAchievementsData.length ?? 0}/${this.achievementsData.length ?? 0}</div>
          </div>

          <div class="achievement-grid">
            ${this.achievementsData.map(ach => {
              const isUnlocked = (this.unlockedAchievementsData || []).some(u => u.achievementId === ach.id);
              return html`
                <div class="achievement ${isUnlocked ? '' : 'locked'}" title="${ach.name}">
                  <img src="${ach.imageUrl}" alt="${ach.name}" />
                </div>
              `;
            })}
          </div>
        </div>

        <div class="card lessons-wrapper">
          <div class="section-title" style="margin-bottom:10px">Ukończone lekcje</div>
          <div class="lessons-grid">
            ${this.userData.completedLessons.map(lesson => html`
              <button class="lesson-tile ${lesson.done ? 'done' : 'locked'}" title="${lesson.name}">
                <div class="lesson-thumb">${lesson.image ? html`<img src="${lesson.image}" alt=""/>` : html`<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#5a5e9a"></rect></svg>`}</div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start">
                  <div class="lesson-title">${lesson.name}</div>
                  ${lesson.done ? html`<div style="color:#bfeabf;font-weight:700;font-size:12px;margin-top:6px">✓ Ukończone</div>` : html`<div style="color:#bdbdd4;font-size:12px;margin-top:6px">Nierozpoczęte</div>`}
                </div>
              </button>
            `)}
          </div>
        </div>
      </div>

    <div class="modal ${this.isSettingsOpen ? 'open' : ''}" @click="${(e)=> { if(e.target.classList.contains('modal')) this.toggleSettings(); }}">
      <div class="modal-content" @click="${e => e.stopPropagation()}">
        <div class="modal-header">Ustawienia konta</div>

        <div class="modal-row"><div>ID</div><div>${this.userData.id ?? '-'}</div></div>
        <div class="modal-row"><div>Email</div><div>${this.userData.email ?? '-'}</div></div>
        <div class="modal-row"><div>Uprawnienia</div><div>${this.userData.permissions ?? '-'}</div></div>
        <div class="modal-row"><div>Punkty</div><div>${this.userData.points ?? 0} XP</div></div>

        <div style="margin-top:12px">
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" @change="${this.updateVisibility}"/> Profil publiczny</label>
        </div>

        <div class="modal-actions">
          <button class="btn" @click=${this.resetPoints}>Resetuj punkty</button>
          <button class="btn" @click=${this.toggleSettings}>Zamknij</button>
        </div>
      </div>
    </div>

    <!-- MISTAKES modal -->

    <div class="modal ${this.isMistakesOpen ? 'open' : ''}" @click="${(e)=> { if(e.target.classList.contains('modal')) this.toggleMistakes(); }}">
      <div class="modal-content" @click="${e => e.stopPropagation()}">
        <div class="modal-header">Pomyłki</div>
        <div class="modal-list" style="display:flex;flex-direction:column;gap:8px">
          ${this.userMistakes.map((mistake) => html`
            <button class="btn" @click=${() => this._repeatMistake(mistake)} style="justify-content:flex-start;padding:10px 12px">
              <strong style="margin-right:8px">↻</strong> ${mistake}
            </button>
          `)}
        </div>
        <div class="modal-actions"><button class="btn" @click=${this.toggleMistakes}>Zamknij</button></div>
      </div>
    </div>

    <!-- WEAKNESSES modal -->

    <div class="modal ${this.isWeaknessesOpen ? 'open' : ''}" @click="${(e)=> { if(e.target.classList.contains('modal')) this.toggleWeaknesses(); }}">
      <div class="modal-content" @click="${e => e.stopPropagation()}">
        <div class="modal-header">Słabe strony</div>
        <ul class="modal-list">
          ${this.userWeaknesses.map(w => html`<li>${w}</li>`)}
        </ul>
        <div class="modal-actions"><button class="btn" @click=${this.toggleWeaknesses}>Zamknij</button></div>
      </div>
    </div>
    `;
  }
}

customElements.define("x-account-view", AccountView);