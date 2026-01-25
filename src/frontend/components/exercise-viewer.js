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
    this._currentProgress = 0;
    this._progressStep = 0;
    this._progressUpdatedThisCycle = false;

    this._nextDispatched = false; 
    this._nextLoaded = false;     
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      gap: 1rem;
      background-color: #373a68;
      color: white;
      flex: 0 0 auto;
    }

    #progress {
      flex: 1 1 auto;
      height: 24px;
      background: #2d2d46;
      border-radius: 999px;
      overflow: hidden;
      margin: 0 1rem;
    }
    #bar {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg,#5b63ff,#3db2ff);
      border-radius: 999px;
      transition: width 420ms cubic-bezier(.2,.9,.2,1);
    }

    #score {
      min-width: 3.2rem;
      text-align: center;
      font-weight: 700;
      color: white;
      background: transparent;
      font-size: 1.5rem;
    }

    .timer-header {
      position: absolute;
      top: 9%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      color: #9ba0d6;
    }

    .content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #252746;
      padding: 1rem 0;
      overflow: auto;
    }

    #exercise-wrap {
      width: 85%;
      max-width: 900px;
      transition: opacity 320ms ease, transform 320ms ease;
      will-change: opacity, transform;
      opacity: 1;
      transform: translateY(0);
    }

    #exercise-wrap.exiting {
      opacity: 0;
      transform: translateY(-10px) scale(0.995);
      pointer-events: none;
    }

    #exercise-wrap.entering {
      opacity: 0;
      transform: translateY(8px);
    }

    #exercise-wrap.entered {
      opacity: 1;
      transform: translateY(0);
    }

    #close {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      background-color: rgba(255, 255, 255, 0.15);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
    }

    #close:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }

    #check-button {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 0;
      background: transparent;
    }

    .button {
      width: 85%;
      max-width: 420px;
      height: 48px;
      border-radius: 10px;
      font-size: 1rem;
      background-color: #50518d;
      color: white;
      border: none;
      cursor: pointer;
    }

    @media (max-width: 640px) {
      #exercise-wrap { width: 95%; }
      .header { padding-left: 0.6rem; padding-right: 0.6rem; }
    }
  `;

  startTimer() {
    if (this._timerInterval) return;
    const startTime = Date.now();
    this._timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const minutes = Math.floor(elapsedTime / 1000 / 60);
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      this.timer = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

      const wrap = this.renderRoot.getElementById('exercise-wrap');
      if (!wrap) return;
      wrap.classList.remove('exiting', 'entered');
      wrap.classList.add('entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrap.classList.remove('entering');
          wrap.classList.add('entered');
        });
      });

      if (this._slottedComponent && typeof this._slottedComponent.focus === 'function') {
        try { this._slottedComponent.focus(); } catch (e) {}
      }
    });

    this.addEventListener('exercise-loaded', () => {
      this._nextLoaded = true;
    });

    this.addEventListener('answer-complete', (ev) => {
      this._onAnswerFinalized(ev);
    });

    this.addEventListener('success-complete', (ev) => {
      this._onAnswerFinalized(ev);
    });

    this.addEventListener('answer-animated', () => {
      this._onAnswerFinalized({ detail: { correct: undefined } });
    });

    const barEl = this.renderRoot.getElementById('bar');
    if (barEl) barEl.style.width = `${this._currentProgress}%`;
  }

  _handleProgressOnce(correct) {
    if (this._progressUpdatedThisCycle) return;
    if (typeof this._progressStep === 'number' && !Number.isNaN(this._progressStep)) {
      this._currentProgress = (this._currentProgress || 0) + this._progressStep;
      if (this._currentProgress > 99.999) this._currentProgress = 100;
      const bar = this.renderRoot.getElementById('bar');
      if (bar) bar.style.width = `${Math.min(100, Number(this._currentProgress.toFixed(4)))}%`;
    }
    this._progressUpdatedThisCycle = true;
  }

  _onAnswerFinalized(ev) {
    if (this._nextDispatched) return;

    const correct = ev?.detail?.correct;
    this._handleProgressOnce(correct);

    this._nextDispatched = true;
    this.dispatchEvent(new CustomEvent('next-exercise', { bubbles: true, composed: true }));

    this._startExitThenEntry();
  }

  _startExitThenEntry() {
    const wrap = this.renderRoot.getElementById("exercise-wrap");
    if (!wrap) {
      this._resetCycleState();
      return;
    }

    wrap.classList.remove("entering", "entered");
    wrap.classList.add("exiting");

    const EXIT_DURATION = 340;
    setTimeout(() => {

      if (!this._nextDispatched) {
        this._nextDispatched = true;
        this.dispatchEvent(new CustomEvent("next-exercise", { bubbles: true, composed: true }));
      }

      this._waitForLoadAndEnter();
    }, EXIT_DURATION);
  }

  _waitForLoadAndEnter() {
  const wrap = this.renderRoot.getElementById("exercise-wrap");

  const showEntry = () => {
    if (!wrap) {
      this._resetCycleState();
      return;
    }

    wrap.classList.remove("exiting");
    wrap.classList.add("entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrap.classList.remove("entering");
        wrap.classList.add("entered");
      });
    });

    this._resetCycleState();
  };

  // jesli zaladowano kolejne zadanie:
  if (this._nextLoaded) {
    showEntry();
    this._nextLoaded = false;
    return;
  }

  let loadedTimeout;
  const safeTimeoutMS = 3000;

  const onExerciseLoaded = () => {
    clearTimeout(loadedTimeout);
    this.removeEventListener("exercise-loaded", onExerciseLoaded);
    showEntry();
  };

  loadedTimeout = setTimeout(() => {
    this.removeEventListener("exercise-loaded", onExerciseLoaded);
    showEntry();
  }, safeTimeoutMS);

  this.addEventListener("exercise-loaded", onExerciseLoaded, { once: true });
}

  _resetCycleState() {
    this._animationInProgress = false;
    this._pendingNext = false;
    this._progressUpdatedThisCycle = false;
    this._nextDispatched = false;
    if (this._nextTimeout) { clearTimeout(this._nextTimeout); this._nextTimeout = null; }
  }

  updated(changedProps) {
    if (changedProps.has('progressStep')) {
      this._progressStep = Number(this.progressStep) || 0;
      const bar = this.renderRoot?.getElementById('bar');
      if (bar) bar.style.width = `${this._currentProgress}%`;
    }
  }

  _handleCheck() {
    if (this._animationInProgress) return;

    this._animationInProgress = true;
    this._pendingNext = true;

    if (this._slottedComponent?.check) {
      this._progressUpdatedThisCycle = false;

      this._slottedComponent.check();

      const SAFE_TIMEOUT = 5000;
      this._nextTimeout = setTimeout(() => {
        this._nextTimeout = null;
        this._onAnswerFinalized({ detail: { correct: undefined } });
      }, SAFE_TIMEOUT);
    } else {
      console.warn("Slotted component has no check() method");
    }
  }

  tryExit() {
    window.location.href = 'http://localhost:3000/';
    // this.dispatchEvent(new CustomEvent('exit-lesson', {
    //   bubbles: true,
    //   composed: true
    // }));
  }

  render() {
    return html`
      <div class="header">
        <div id="close" @click=${() => this.tryExit()} style="cursor: pointer;">X</div>
        <div id="progress"><div id="bar"></div></div>
        <div id="score">7</div>
      </div>

      <div class="timer-header">${this.timer}</div>

      <div class="content">
        <div id="exercise-wrap" class="entered">
          <slot></slot>
        </div>
      </div>

      <div id="check-button">
        <button class="button" @click=${this._handleCheck}>check</button>
      </div>
    `;
  }
}

customElements.define("x-exercise-view", ExerciseView);