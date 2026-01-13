import { css, html, LitElement } from "../../lib/lit.min.js";

import "../partial/keypad.js";
import "../partial/field.js";
import "../partial/slider.js";
import "../partial/success-mark.js";
import "../partial/drag-drop.js";
import "../partial/find-error.js";

class AddSubExercise extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: String },
    given: { attribute: false, type: String }, 
    config: { type: Object },
    sliderMin: { type: Number },
    sliderMax: { type: Number },
    statuses: { attribute: false } 
  };

  static styles = css`
    :host { display: block; width: 100%; height: 100%; }
    .container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      gap: 20px; 
      color: white; 
      font-family: sans-serif; 
      height: 100%; 
    }
    .question { font-size: 4rem; font-weight: bold; margin-bottom: 20px; }
    .fields-group { display: flex; flex-direction: row; gap: 0.5rem; margin-bottom: 2rem; }
   `;

  constructor() {
    super();
    this.exerciseId = null;
    this.exercise = "Ładowanie...";
    this.solution = "";
    this.given = "";
    this.config = { mode: "loading" };
    this.sliderMin = 0;
    this.sliderMax = 10;
    this.statuses = []; 
  }

  calculateRange(solutionStr) {
    const sol = parseInt(solutionStr);
    if (isNaN(sol)) return;
    this.sliderMin = 0; 
    if (sol <= 10) this.sliderMax = 10;
    else if (sol <= 20) this.sliderMax = 20;
    else if (sol <= 50) this.sliderMax = 50;
    else if (sol <= 100) this.sliderMax = 100;
    else this.sliderMax = Math.ceil(sol / 100) * 100;
    this.given = Math.floor(this.sliderMax / 2).toString();
  }

  handleInput(e) {
    const val = e.detail;
    this.statuses = []; 

    if (['slider', 'drag-drop', 'find-error'].includes(this.config.answer_type)) {
        this.given = val.toString();
    }
    else if (this.config.answer_type === 'keypad') {
        if (val === "<") this.given = this.given.slice(0, -1);
        else if (this.given.length < this.solution.length) this.given += val;
        this.requestUpdate();
    }
  }

  triggerJump() {
      const q = this.shadowRoot.querySelector('.question');
      if(q) {
          q.classList.remove('jumping');
          void q.offsetWidth;
          q.classList.add('jumping');
      }
  }

  check() {
    if (this._checkInProgress) return;

    this._checkInProgress = true;
    let correct = false;

    if (this.config.answer_type === 'slider') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();

        } else {
            const el = this.shadowRoot.querySelector('x-input-slider');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    } 
    else if (this.config.answer_type === 'drag-drop') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();
        } else {
            const el = this.shadowRoot.querySelector('x-drag-drop');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }
    else if (this.config.answer_type === 'find-error') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();
        } else {
            const el = this.shadowRoot.querySelector('x-find-error');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }

    else {
        this.statuses = Array.from(this.solution).map((char, i) =>
            this.given[i] === char ? "correct" : "wrong"
        );
        const isAllCorrect = this.statuses.every(s => s === "correct");
        if (isAllCorrect && this.given.length === this.solution.length) {
            this.shadowRoot.getElementById('mark').show();
            correct = true;
        } else {
            correct = false;
            const firstField = this.shadowRoot.querySelector('x-field');
            if (firstField && typeof firstField.showError === 'function') firstField.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }

    this.isCorrect = correct;

    if (correct) {
      const mark = this.shadowRoot.getElementById('mark');
      if (!mark) {
        setTimeout(() => this._dispatchAnswerComplete(true), 1000);
      }
    }

    setTimeout(() => {
      this._checkInProgress = false;
    }, 3200);
  }

  _dispatchAnswerComplete(correct) {
    this.dispatchEvent(new CustomEvent('answer-complete', {
      detail: { correct },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    const id = this.exerciseId || Number(this.getAttribute('exercise-id')) || 1;
    this._loadExercise(id);
  }

 _loadExercise(id) {
    if (!id) return;
    if (this._loadingId === id) return;
    this._loadingId = id;

    fetch(`/api/exercise/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log('Zaladowano zadanie', id, data);
        this.exerciseId = id;
        this.exercise = data.exerciseQuestion?.toString() || 'Brak pytania';
        this.solution = data.exerciseAnswer?.toString() || '';

        try {
          if (data.exerciseProperties) this.config = JSON.parse(data.exerciseProperties);
          else this.config = { question_type: "text_only", answer_type: "keypad" };

          if (this.config.answer_type === 'slider') this.calculateRange(this.solution);
          else this.given = "";

          this.dispatchEvent(new CustomEvent('exercise-loaded', { bubbles: true, composed: true }));

        } catch (err) {
          console.error('Blad JSON:', err);
          this.config = { question_type: "text_only", answer_type: "keypad" };
        }
      })
      .catch(err => {
        console.error('Blad _loadExercise:', err);
        this.exercise = "Blad polaczenia";
        this.config = { answer_type: "error" }; 
      })
      .finally(() => {
        this._loadingId = null;
      });
  }

updated(changedProps) {
  if (changedProps.has('exerciseId')) {
    const id = this.exerciseId || Number(this.getAttribute('exercise-id'));
    if (id && typeof this._loadExercise === 'function') {
      this._loadExercise(id);
    }
  }
}

  renderExerciseContent() {
    switch (this.config.answer_type) {
      case 'slider':
        return html`
          <x-input-slider 
            min="${this.sliderMin}" 
            max="${this.sliderMax}" 
            .value="${parseInt(this.given)}"
            @value-changed="${this.handleInput}"
          ></x-input-slider>
        `;

      case 'drag-drop':
        return html`
          <x-drag-drop 
            .variants="${this.config.variants || [1, 2, 3]}"
            @value-changed="${this.handleInput}"
          ></x-drag-drop>
        `;

      case 'find-error':
        return html`
          <x-find-error
            .lines="${this.config.lines || []}"
            @value-changed="${this.handleInput}"
          ></x-find-error>
        `;

      case 'keypad':
        return html`
          <div class="fields-group">
            ${Array.from(this.solution).map((_, i) => html`
                <x-field 
                  value="${this.given[i] || ''}"
                  status="${this.statuses[i] || ''}"
                ></x-field>
            `)}
          </div>
          <x-keypad @keyboard-pressed="${this.handleInput}"></x-keypad>
        `;

      default:
        return html`<div>Wczytywanie...</div>`;
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
customElements.define("x-addsub-exercise", AddSubExercise);