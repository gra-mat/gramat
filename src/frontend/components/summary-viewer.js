import { css, html, LitElement } from "../../lib/lit.min.js";

class SummaryViewer extends LitElement {
  static properties = {
    time: { type: String, reflect: true }, // Obsługuje zmiany atrybutów DOM
    accuracy: { type: String, reflect: true },
    xp: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.time = "0m 0s";
    this.accuracy = "0%";
    this.xp = "+0 XP";
  }

  static styles = css`

    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      box-sizing: border-box;
      padding: 16px; 
    }

    :host(.hidden) {
      display: none !important;
    }

    .summary-card {
      background: #474777ff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .summary-title {
      font-size: 1.5rem;
      color: #a8a8faff;
      margin-bottom: 40px;
    }
    .summary-section {
      display: flex;
      align-items: center;
      background: #62628aff;
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 20px;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .summary-icon {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .summary-content p {
      margin: 0;
      font-size: 1.2rem;
      color: white;
    }
    
    .button-group .btn {
      width: 49%;
      padding: 20px 0;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 5px 0 rgba(0,0,0,0.15);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .button-group .btn.repeat {
      background: #d6bb4eff;
      box-shadow: 0 5px 0 #b28f00;
      color: black;
    }
    .button-group .btn.repeat:hover {
      background: #ffd84d;
    }
    .button-group .btn.repeat:active {
      transform: translateY(4px);
      box-shadow: 0 3px 0 #b28f00;
    }
    .button-group .btn.next {
      background: #4caf50;
      box-shadow: 0 5px 0 #357a38;
      color: black;
    }
    .button-group .btn.next:hover {
      background: #66bb6a;
    }
    .button-group .btn.next:active {
      transform: translateY(4px);
      box-shadow: 0 3px 0 #357a38;
    }

  `;

  updated(changedProperties) {
    console.log("SummaryViewer - Zmiana właściwości lub atrybutu:", changedProperties);
  }

  render() {
    return html`
      <div class="summary-card">
        <h2 class="summary-title">Podsumowanie lekcji</h2>
        <div class="summary-section">
          <img class="summary-icon" src="icons/timer.svg" alt="Timer Icon" />
          <div class="summary-content"><p>Czas: ${this.time}
          </div>
        </div>
        <div class="summary-section">
          <img class="summary-icon" src="icons/accuracy.svg" alt="Accuracy Icon" />
          <div class="summary-content">
            <p>Dokładność: ${this.accuracy}
          </div>
        </div>
        <div class="summary-section">
          <img class="summary-icon" src="icons/xp.svg" alt="XP Icon" />
          <div class="summary-content"><p>${this.xp}
          </div>
        </div>
        <div class="button-group">
          <button class="btn repeat" @click=${() => this._repeatLesson()}>Powtórz</button>
          <button class="btn next" @click=${() => this._proceed()}>Dalej</button>
        </div>
      </div>
    `;
  }

  _repeatLesson() {
    console.log("Powtórz lekcję");
  }

  _proceed() {
    console.log("Przejdź dalej");
  }
}

customElements.define("summary-viewer", SummaryViewer);