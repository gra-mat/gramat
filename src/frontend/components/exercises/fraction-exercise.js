import { css, html, LitElement } from "../../lib/lit.min.js";
import "../exercises/partial/fraction-field.js";
import "../exercises/partial/fraction-selector.js";
import "../exercises/partial/fraction-keypad.js";
import "../exercises/partial/success-mark.js";
import "../exercises/partial/fraction-mc.js";
import "../exercises/partial/fraction-matching.js";

class FractionExercise extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: Object },
    given: { attribute: false, type: Object },
    config: { type: Object },
    statuses: { attribute: false, type: Array },
    options: { type: Array }
  };

  static styles = css`
    :host { display:block; width:100%; height:100%; }
    .container { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; color:white; font-family:sans-serif; height:100%; padding:20px; }
    .question { font-size:2.4rem; font-weight:700; text-align:center; color:#edf0ff; }
    .fields-group { display:flex; gap:12px; align-items:center; justify-content:center; }
    .x-success-mark, #mark { z-index:9999; position:absolute; pointer-events:none; left:0; top:0; }
  `;

  constructor() {
    super();
    this.exerciseId = null;
    this.exercise = "Ładowanie...";
    this.solution = { numerator: "", denominator: "" };
    this.given = { numerator: "", denominator: "" };
    this.config = {};
    this.statuses = ["",""];
    this.options = [];
    this._currentInput = "numerator";
    this._checkInProgress = false;
    this._loadingId = null;
    this.isCorrect = false;
    this._matchingAnswers = null;
    this._mcSelectedIndices = [];
    this._mcSelectedOptions = [];
    this._expectedAnswers = null;
    this._wrongIndices = [];
    this._correctIndices = [];
  }

  connectedCallback() {
    super.connectedCallback();
    const id = this.exerciseId || Number(this.getAttribute("exercise-id")) || 1;

    if (!this.exercise || this.exercise === 'Ładowanie...') {
      this._loadExercise(id);
    }

    this.addEventListener("fraction-selected", (e) => {
      const idx = e.detail;
      if (Array.isArray(this.options) && this.options[idx]) {
        this.given = { ...this.options[idx] };
        this.statuses = ["", ""];
        this.requestUpdate();
      }
    });

    this.addEventListener("mc-selected", (e) => {
      const detail = e.detail || {};
      this._mcSelectedIndices = Array.isArray(detail.selectedIndices) ? detail.selectedIndices.slice() : [];
      this._mcSelectedOptions = Array.isArray(detail.selectedOptions) ? detail.selectedOptions.slice() : [];

      this._wrongIndices = [];
      this._correctIndices = [];

      this.statuses = ["", ""];
      this.requestUpdate();
    });

    this.addEventListener("matching-complete", (e) => {
      this._matchingAnswers = Array.isArray(e.detail) ? e.detail.slice() : null;
    });
  }

  _previewSingleOptionStatus(opt) {
    const numOK = opt && String(opt.numerator) === String(this.solution?.numerator || "");
    const denomOK = opt && String(opt.denominator) === String(this.solution?.denominator || "");
    this.statuses = [ numOK ? "correct" : "wrong", denomOK ? "correct" : "wrong" ];
  }

  handleInput(e) {
    const val = e.detail;
    if (this.config.answer_type === "selector") return;
    if (this.config.answer_type === "keypad" || !this.config.answer_type) {
      if (val === "<") {
        if (this._currentInput === "numerator") this.given.numerator = this.given.numerator.slice(0, -1);
        else this.given.denominator = this.given.denominator.slice(0, -1);
      } else if (val === "/") {
        this._currentInput = this._currentInput === "numerator" ? "denominator" : "numerator";
      } else {
        if (this._currentInput === "numerator" && this.given.numerator.length < 3) this.given.numerator += val;
        else if (this._currentInput === "denominator" && this.given.denominator.length < 3) this.given.denominator += val;
      }
      this.statuses = ["", ""];
      this.requestUpdate();
    }
  }

  check() {
    if (this._checkInProgress) return false;
    this._checkInProgress = true;
    const at = this.config?.answer_type;

    if (at === "selector") {

      const correctIndices = this.options.map((o,i) => o && o.correct ? i : -1).filter(i => i >= 0);
      
      const selectedIdx = this.options.findIndex(opt => 
        String(opt.numerator) === String(this.given.numerator) &&
        String(opt.denominator) === String(this.given.denominator)
      );
      const selectedOpt = selectedIdx >= 0 ? this.options[selectedIdx] : null;
      
      if (selectedIdx >= 0 && selectedOpt) {

        if (correctIndices.length) {
          this.isCorrect = correctIndices.includes(selectedIdx);
        } else if (this._expectedAnswers && this._expectedAnswers.length) {
          const selectedFrac = `${selectedOpt.numerator}/${selectedOpt.denominator}`;
          this.isCorrect = this._expectedAnswers.includes(selectedFrac);
        } else {
          this.isCorrect = String(selectedOpt.numerator) === String(this.solution?.numerator || "") &&
                          String(selectedOpt.denominator) === String(this.solution?.denominator || "");
        }

        this.statuses = [
          this.isCorrect ? "correct" : "wrong",
          this.isCorrect ? "correct" : "wrong"
        ];
      } else {
        this.isCorrect = false;
        this.statuses = ["wrong", "wrong"];
      }

      if (this.isCorrect) {
        const mark = this.shadowRoot.getElementById("mark");
        if (mark && typeof mark.show === "function") mark.show();
        else this._dispatchAnswerComplete(true);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      } else {
        setTimeout(() => this._dispatchAnswerComplete(false), 500);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      }
      this.requestUpdate();
      return true;
    }

    if (at === "multiplechoice") {
      const correctIndices = this.options.map((o,i) => o && o.correct ? i : -1).filter(i => i >= 0);
      const selected = new Set(this._mcSelectedIndices || []);

      if (selected.size === 0) {
        this.isCorrect = false;
        this._wrongIndices = [];
        this._correctIndices = [];
      } 
      else {
        if (correctIndices.length) {
          const correctSet = new Set(correctIndices);
          this.isCorrect = selected.size === correctSet.size && [...selected].every(i => correctSet.has(i));
        } else if (this._expectedAnswers && this._expectedAnswers.length) {
          const selectedFracs = [...selected].map(i => `${this.options[i].numerator}/${this.options[i].denominator}`);
          const selSet = new Set(selectedFracs);
          const expSet = new Set(this._expectedAnswers);
          this.isCorrect = selSet.size === expSet.size && [...selSet].every(v => expSet.has(v));
        } else {
          const solIdx = this.options.findIndex(o =>
            String(o.numerator) === String(this.solution?.numerator || "") &&
            String(o.denominator) === String(this.solution?.denominator || "")
          );
          this.isCorrect = solIdx >= 0 && selected.size === 1 && selected.has(solIdx);
        }

        // obliczanie ktore zaznaczone odpowiedzi sa poprawne, a ktore nie (tylko dla zaznaczonych)
        const correctSet = new Set(correctIndices);
        this._correctIndices = [...selected].filter(i => correctSet.has(i));
        this._wrongIndices = [...selected].filter(i => !correctSet.has(i));
      }

      this.statuses = ["", ""];

      if (this.isCorrect) {
        const mark = this.shadowRoot.getElementById("mark");
        if (mark && typeof mark.show === "function") mark.show();
        else this._dispatchAnswerComplete(true);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      } else {
        // bledy z delayem
        setTimeout(() => this._dispatchAnswerComplete(false), 500);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      }
      this.requestUpdate();
      return true;
    }

    if (at === "matching") {
      if (!Array.isArray(this._matchingAnswers) || !Array.isArray(this.options)) {
        this._checkInProgress = false;
        return false;
      }
      
      // czy wszystko wypelnione
      const allAnswered = this._matchingAnswers.length === this.options.length && 
                          this._matchingAnswers.every(v => v !== null && v !== undefined && v !== "");
      
      if (!allAnswered) {
        this.isCorrect = false;
        this._wrongIndices = [];
        this._correctIndices = [];
      } else {

        // porownywanie odpowiedzi z expectedAnswers (indexy poprawnych wartosci)
        const expected = this._expectedAnswers || [];
        this._correctIndices = [];
        this._wrongIndices = [];
        
        this.isCorrect = true;
        for (let i = 0; i < this._matchingAnswers.length; i++) {
          if (String(this._matchingAnswers[i]) === String(expected[i])) {
            this._correctIndices.push(i);
          } else {
            this._wrongIndices.push(i);
            this.isCorrect = false;
          }
        }
      }

      if (this.isCorrect) {
        const mark = this.shadowRoot.getElementById("mark");
        if (mark && typeof mark.show === "function") mark.show();
        else this._dispatchAnswerComplete(true);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      } else {
        // bledy z delayem
        setTimeout(() => this._dispatchAnswerComplete(false), 500);
        setTimeout(() => { this._checkInProgress = false; }, 1000);
      }
      this.requestUpdate();
      return true;
    }

    {
      const numOK = String(this.given?.numerator || "") === String(this.solution?.numerator || "");
      const denomOK = String(this.given?.denominator || "") === String(this.solution?.denominator || "");
      this.isCorrect = numOK && denomOK;
      this.statuses = [ numOK ? "correct" : "wrong", denomOK ? "correct" : "wrong" ];
      if (this.isCorrect) {
        const mark = this.shadowRoot.getElementById("mark");
        if (mark && typeof mark.show === "function") mark.show();
        else this._dispatchAnswerComplete(true);
      } else {
        setTimeout(() => this._dispatchAnswerComplete(false), 500);
      }
      setTimeout(() => { this._checkInProgress = false; }, 1000);
      this.requestUpdate();
      return true;
    }
  }

  _dispatchAnswerComplete(correct) {
    this.dispatchEvent(new CustomEvent("answer-complete", {
      detail: { correct },
      bubbles: true,
      composed: true
    }));
  }

  _loadExercise(id) {
    if (!id || this._loadingId === id) return;
    this._loadingId = id;

    // reset parametrow przy wczytywaniu zadania
    this._currentInput = "numerator";
    this.statuses = ["", ""];
    this._wrongIndices = [];
    this._correctIndices = [];
    this._mcSelectedIndices = [];
    this._mcSelectedOptions = [];
    this._matchingAnswers = [];

    if (this.config && (this.config.answer_type || (Array.isArray(this.options) && this.options.length) || this.solution?.numerator || this.solution?.denominator)) {
      if (Array.isArray(this.options) && this.options.length) {
        if (!this.config) this.config = {};
        if (!['multiplechoice','selector','matching'].includes(this.config.answer_type)) this.config.answer_type = 'multiplechoice';
        if (Array.isArray(this.config.options) && this.config.options.length && (!Array.isArray(this.options) || !this.options.length)) this.options = this.config.options;
        if ((!this.given || !this.given.numerator) && this.options.length) this.given = { numerator: this.options[0].numerator, denominator: this.options[0].denominator };
      }
      this.exerciseId = id;
      setTimeout(() => this.dispatchEvent(new CustomEvent("exercise-loaded", { bubbles: true, composed: true })), 0);
      this._loadingId = null;
      return;
    }

    fetch("/api/me/nextQuestion")
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        this.exerciseId = id;

        if (data && data.finished) {
          this.exercise = "Koniec lekcji";
          this.config = { answer_type: "done" };
          this.dispatchEvent(new CustomEvent("exercise-loaded", { bubbles: true, composed: true }));
          this._loadingId = null;
          return;
        }

        this.exercise = data.exerciseQuestion?.toString() || "Brak pytania";
        try {
          this.config = data.exerciseProperties ? JSON.parse(data.exerciseProperties) : { answer_type: "keypad" };

          const rawAnswer = (data.exerciseAnswer || "").toString().trim();
          if (rawAnswer.includes(",")) {
            this._expectedAnswers = rawAnswer.split(",").map(s => s.trim());
            this.solution = { numerator: "", denominator: "" };
          } else {
            const parts = rawAnswer.split("/") || ["", ""];
            this.solution = { numerator: parts[0] || "", denominator: parts[1] || "" };
            this._expectedAnswers = null;
          }

          this.given = { numerator: "", denominator: "" };

          if ((this.config.answer_type === "selector" || Array.isArray(this.config.options) && this.config.options.length) && this.config.options) {
            this.options = this.config.options;
            this.given = { numerator: this.options[0].numerator, denominator: this.options[0].denominator };
            if (!['multiplechoice','selector','matching'].includes(this.config.answer_type)) this.config.answer_type = 'multiplechoice';
          }

          this.requestUpdate();
          this.dispatchEvent(new CustomEvent("exercise-loaded", { bubbles: true, composed: true }));
        } catch (err) {
          this.config = { answer_type: "keypad" };
        }
      })
      .catch(err => {
        this.exercise = "Błąd połączenia";
        this.config = { answer_type: "error" };
      })
      .finally(() => {
        this._loadingId = null;
      });
  }

  updated(changedProps) {
    if (changedProps.has("exerciseId")) {
      const id = this.exerciseId || Number(this.getAttribute("exercise-id"));
      if (id && typeof this._loadExercise === "function") {
        const hasManualExercise = this.exercise && this.exercise !== 'Ładowanie...';
        if (!hasManualExercise) {
          this._loadExercise(id);
        }
      }
    }
  }

  renderExerciseContent() {
    const at = this.config?.answer_type;

    switch (at) {
      case "selector":
        if (!this.options || !this.options.length) return html`<div>Wczytywanie...</div>`;
        return html`
          <x-fraction-selector 
            .options="${this.options}"
            .selectedIndex="${this.options.findIndex(opt => opt.numerator === this.given.numerator && opt.denominator === this.given.denominator)}"
            @fraction-selected="${e => {
              const idx = e.detail;
              this.given = { numerator: this.options[idx].numerator, denominator: this.options[idx].denominator };
              this.statuses = ["", ""];
              this.requestUpdate();
            }}"
          ></x-fraction-selector>
          <div class="fields-group">
            <x-fraction-field numerator="${this.given.numerator}" denominator="${this.given.denominator}" .status="${this.statuses}" slotActive="numerator"></x-fraction-field>
          </div>
        `;
      case "multiplechoice":
        if (!this.options || !this.options.length) return html`<div>Wczytywanie...</div>`;
        return html`
          <x-fraction-mc .options="${this.options}" .question="${this.exercise}" .selectedIndices="${this._mcSelectedIndices || []}" .wrongIndices="${this._wrongIndices || []}" .correctIndices="${this._correctIndices || []}"></x-fraction-mc>
        `;
      case "matching":
        if (!this.options || !this.options.length) return html`<div>Wczytywanie...</div>`;
        return html`
          <x-fraction-matching .fractions="${this.options}" .values="${this.config.values || []}" .answers="${this._matchingAnswers || []}" .wrongIndices="${this._wrongIndices || []}" .correctIndices="${this._correctIndices || []}" @matching-complete="${e => { this._matchingAnswers = e.detail; this.requestUpdate(); }}"></x-fraction-matching>
        `;
      case "keypad":
      default:
        return html`
          <div class="fields-group">
            <x-fraction-field numerator="${this.given.numerator}" denominator="${this.given.denominator}" .status="${this.statuses}" slotActive="${this._currentInput}"></x-fraction-field>
          </div>
          <x-fraction-keypad @keyboard-pressed="${this.handleInput}"></x-fraction-keypad>
        `;
    }
  }

  render() {
    return html`
      <x-success-mark id="mark"></x-success-mark>
      <div class="container">
        <div class="question">${this.exercise}</div>
        ${this.renderExerciseContent()}
      </div>
    `;
  }
}

customElements.define("x-fraction-exercise", FractionExercise);