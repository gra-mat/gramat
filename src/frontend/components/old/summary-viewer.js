import { css, html, LitElement } from "../../lib/lit.min.js";

class SummaryViewer extends LitElement {
  static properties = {
    time: { type: String, reflect: true },
    accuracy: { type: String, reflect: true },
    xp: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.time = "0m 0s";
    this.accuracy = "0%";
    this.xp = "+0 XP";
    this._seqTimers = [];
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
    :host(.hidden) { display: none !important; }

    .summary-card {
      width: 100%;
      max-width: 420px;
      background: #3b3f6b;
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      overflow: hidden;
    }

    .summary-title { margin: 0 0 16px 0; color: #e6e8ff; font-weight: 700; }

    .summary-section {
      display: flex;
      gap: 12px;
      align-items: center;
      background: rgba(255,255,255,0.03);
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 320ms ease, transform 320ms ease;
    }
    .summary-section.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .summary-icon { width: 36px; height: 36px; flex: 0 0 36px; }
    .summary-content p { margin: 0; font-size: 1rem; color: #f6f7ff; }

    .button-group { display:flex; gap:8px; margin-top: 8px; }
    .btn {
      flex: 1 1 50%;
      padding: 12px 0;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 700;
    }
    .btn.repeat { background: #ffd84d; color: #111; }
    .btn.next { background: #66bb6a; color: #111; }
  `;

  updated(changedProperties) {

    if (changedProperties.has('time')) {

      if (!this.classList.contains('hidden')) {
        this._animateSections();
      }
    }
  }

  _clearSeqTimers() {
    this._seqTimers.forEach(t => clearTimeout(t));
    this._seqTimers = [];
  }

  _animateSections() {
    this._clearSeqTimers();
    const sections = Array.from(this.shadowRoot.querySelectorAll('.summary-section'));
    sections.forEach(s => s.classList.remove('visible'));

    sections.forEach((sec, i) => {
      const t = setTimeout(() => sec.classList.add('visible'), i * 500 + 80);
      this._seqTimers.push(t);
    });
  }

  render() {
    return html`
      <div class="summary-card" role="dialog" aria-label="Podsumowanie lekcji">
        <h2 class="summary-title">Podsumowanie lekcji</h2>

        <div class="summary-section">
          <img class="summary-icon" src="icons/timer.svg" alt="Timer" />
          <div class="summary-content"><p>Czas: ${this.time}</p></div>
        </div>

        <div class="summary-section">
          <img class="summary-icon" src="icons/accuracy.svg" alt="Accuracy" />
          <div class="summary-content"><p>Dokładność: ${this.accuracy}</p></div>
        </div>

        <div class="summary-section">
          <img class="summary-icon" src="icons/xp.svg" alt="XP" />
          <div class="summary-content"><p>${this.xp}</p></div>
        </div>

        <div class="button-group">
          <button class="btn repeat" @click=${() => this._repeatLesson()}>Powtórz</button>
          <button class="btn next" @click=${() => this._proceed()}>Dalej</button>
        </div>
      </div>
    `;
  }

  _repeatLesson() {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');
    if (lessonId) window.location.href = `lesson.html?lessonId=${encodeURIComponent(lessonId)}`;
    else window.location.reload();
  }

  _proceed() {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');
    this.dispatchEvent(new CustomEvent('lesson-proceed', {
      detail: { lessonId },
      bubbles: true,
      composed: true
    }));
    window.location.href = 'index.html';
  }
}

customElements.define("summary-viewer", SummaryViewer);