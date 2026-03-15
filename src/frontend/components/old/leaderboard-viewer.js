import { css, html, LitElement, until } from "../../lib/lit.min.js";
class LeaderboardView extends LitElement {
  static properties = {
    leaderboard: { type: Array }
  }

  constructor(){
    super();
    this.leaderboard = [];
  }

  static styles = css`
    .header {
      display: flex;
      height: 8%;
      align-items: center;
      justify-content: center;
      column-gap: 3%;
      background-color: #373a68ff;
      color: white;
      font-weight: 600;
    }

.content {
  display: flex;
  height: 92%;
  justify-content: center;
  align-items: center;
  background-color: #252746ff;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
  width: 100%;
  max-width: 900px;
}

.user-in-leaderboard {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(145deg, #6166ac, #4d5191);
  color: white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.user-in-leaderboard:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

.user-in-leaderboard img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.user-name {
  flex: 1;
  font-weight: 600;
  font-size: 16px;
}

.user-in-leaderboard-points {
  font-weight: 700;
  font-size: 18px;
  background: rgba(0,0,0,0.25);
  padding: 6px 10px;
  border-radius: 6px;
}

.rank {
  font-weight: 700;
  font-size: 18px;
  color: #ffd166;
}
//   img[src$=".svg"] {
//   filter: invert(1);
// }
  `;

  async firstUpdated() {
    try {
      this.loadingData = true;
      const res = await fetch("/api/user/leaderboard");
      const data = await res.json();
      this.leaderboard = data;
    } catch (err) {
      console.error("Blad pobierania tabeli wyników:", err);
    }
  }

    async getAvatarUrl(user) {
      const res = await fetch(`api/user/${user.id}/avatar`);
        if (res.status === 404) {
          if (user.avatarUrl != null) {
            const res2 = await fetch(`api/user/${user.id}/avatar`);

            return user.avatarUrl;
          } else {
            return '../icons/account.svg';
          }
        }
        return `api/user/${user.id}/avatar`;
    }

    onAvatarError(e) {
      const img = e.target;
      img.onerror = null;
      img.src = '../icons/account.svg';
    }
    
    render() {
      return html`
        <div class="header">
        Tabela wyników
        </div>

        <div class="content">
        <div class="grid">
            ${this.leaderboard.map(
            (user, index) => html`
                <div class="user-in-leaderboard">
                <div class="rank">#${index + 1}</div>

                <img src="${until(this.getAvatarUrl(user), '../icons/account.svg')}" @error='${this.onAvatarError}'>

                <div class="user-name">${user.name}</div>

                <div class="user-in-leaderboard-points">
                    ${user.points}
                </div>
                </div>
            `
            )}
        </div>
        </div>
      `;
    }
}

customElements.define("x-leaderboard-view", LeaderboardView);