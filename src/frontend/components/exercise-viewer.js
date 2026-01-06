import { css, html, LitElement } from "../../lib/lit.min.js";

class ExerciseView extends LitElement {
  
  static properties = {
    progressStep: { type: Number, attribute: 'progress-step' },
    timer: { type: String },
  };

  constructor() {
    super();
    this.progressStep = 0;
    this.timer = "00:00";


    this._animationInProgress = false;
    this._pendingNext = false;
    this._nextTimeout = null;
  }

  static styles = css`
    :host {
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      display: flex;
      height: 8%;
      align-items: center;
      justify-content: center;
      column-gap: 3%;
      background-color: #373a68ff;
      color: white;
    }

    .timer-header {
      position: absolute;
      padding: 20px 20px;
      font-size: 2rem;
      font-width: 2rem;
      color: #9196d8ff;
    }

    .content {
      display: flex;
      height: 82%;
      justify-content: center;
      align-items: center;
      background-color: #252746ff;
    }

    #progress {
      width: 70%;
      height: 65%;
      background-color: #3f418aff;
      border-radius: 0.6em;
      border: 0.2em solid #7d94fcff;
    }

    #bar {
      width: 20%;
      height: 100%;
      background-color: #4f51ffff;
      border-radius: 0.4em;
    }

    #score {
      height: 65%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      padding-right: 5%;
      font-family: Verdana, sans-serif;
    }

    #close {
      height: 65%;
      aspect-ratio: 1;
      font-size: 1.5em;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #a73636ff;
      border-radius: 0.4em;
    }

    #check-button {
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #373a68ff;
    }

    #exercise {
      width: 85%;
      height: 100%;
    }

    .button {
      width: 85%;
      height: 70%;
      border-radius: 1rem;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      text-transform: uppercase;
      background-color: #6f703aff;
      color: white;
      box-shadow: inset 0 0 0 4px #fcff5bff;
    }

    .hidden {
      display: none;
    }

    #summary {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #2f3044;
      color: white;
      text-align: center;
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    }

    #summary span {
      font-weight: bold;
      color: #ffcc00;
    }
  `;

  startTimer() {
    if (this._timerInterval) return;
    let startTime = Date.now();

    this._timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const minutes = Math.floor(elapsedTime / 1000 / 60);
      const seconds = Math.floor((elapsedTime / 1000) % 60);

      this.timer = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }, 1000);
  }

  connectedCallback() {
    super.connectedCallback();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./lib/pure.min.css";
    this.renderRoot.prepend(link);
    this.startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timerInterval);
    if (this._nextTimeout) {
      clearTimeout(this._nextTimeout);
      this._nextTimeout = null;
    }
  }

  firstUpdated() {
    const slot = this.renderRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => {
      const assigned = slot.assignedElements();
      this._slottedComponent = assigned[0];
    });

    this.addEventListener('answer-animated', () => {
      if (this._pendingNext) {
        if (this._nextTimeout) {
          clearTimeout(this._nextTimeout);
          this._nextTimeout = null;
        }
        this._completeCycle();
      }
    });

    this._currentProgress = 0;
    this._progressStep = (typeof this.progressStep === 'number') ? this.progressStep : 0;
    const barEl = this.renderRoot.getElementById('bar');
    if (barEl) {
      barEl.style.width = `${this._currentProgress}%`;
    }


    this.addEventListener('success-complete', (ev) => {
      const bar = this.renderRoot.getElementById('bar');
      if (bar && typeof this._progressStep === 'number' && !Number.isNaN(this._progressStep)) {

        this._currentProgress = (this._currentProgress || 0) + this._progressStep;

        // zeby sie nie rozjebalo jak bedzie blisko 100, dla 7 pytan powinno byc git ale dla 6, 12 itd. gorzej
        if (this._currentProgress > 99.999) this._currentProgress = 100; 

        bar.style.width = `${Math.min(100, Number(this._currentProgress.toFixed(4)))}%`;
      }

      if (this._pendingNext) {
        if (this._nextTimeout) {
          clearTimeout(this._nextTimeout);
          this._nextTimeout = null;
        }
        this._completeCycle();
      }
    });
  }

  _completeCycle() {
    if (!this._pendingNext) return;
    this._pendingNext = false;
    this._animationInProgress = false;
    if (this._nextTimeout) {
      clearTimeout(this._nextTimeout);
      this._nextTimeout = null;
    }
    this.dispatchEvent(new CustomEvent('next-exercise', { bubbles: true, composed: true }));
  }


updated(changedProps) {
  if (changedProps.has('progressStep')) {
    this._progressStep = Number(this.progressStep) || 0;

    const bar = this.renderRoot?.getElementById('bar');
    if (bar) {
      bar.style.width = `${this._currentProgress}%`;
    }
  }
}

  _handleCheck() {

    if (this._animationInProgress) return;

    if (this._slottedComponent?.check) {
      this._animationInProgress = true;
      this._pendingNext = true;

      this._slottedComponent.check();

      const ANIMATION_TIMEOUT = 2000; 
      this._nextTimeout = setTimeout(() => {
        this._nextTimeout = null;
        this._completeCycle();
      }, ANIMATION_TIMEOUT);

    } else {
      console.warn("Slotted component has no check() method");
    }
  }

  render() {
    return html`
      <div class="header">
        <div id="close">X</div>
        <div id="progress">
          <div id="bar"></div>
        </div>
        <div id="score">7</div>
      </div>
      <div class="timer-header">${this.timer}</div>
      <div class="content">
        <div id="exercise">
          <slot></slot>
        </div>
      </div>
      <div id="check-button">
        <button class="pure-button button" @click=${this._handleCheck}>
          check
        </button>
      </div>
    `;
  }
}

customElements.define("x-exercise-view", ExerciseView);
