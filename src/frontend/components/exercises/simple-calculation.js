import { css, html, LitElement } from "../../lib/lit.min.js";

class ExerciseCalculation extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: String },
    difficultyId: { type: Number },
    given: { attribute: false, type: String },
    statuses: { attribute: false },
  };

  static styles = css`
    .assigned {
      width: 100%;
      height: 58%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .example {
      font-size: 3rem;
    }

    .difficulty-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: rgba(0,0,0,0.75);
      margin-bottom: 0.6rem;
    }
    .difficulty-indicator .dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--difficulty-color, #ccc);
    }

    .group {
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
    }
  `;

  constructor() {
    super();
    this.exerciseId = null;
    this.exercise = "";
    this.solution = "";
    this.difficultyId = null;
    this.given = "";
    this.statuses = [];
  }

  notify(char) {
    if (char === "<") {
      this.given = this.given.slice(0, -1);
      this.statuses = [];
      return;
    }

    if (this.given.length < this.solution.length) {
      this.given += char;
    }

    this.statuses = [];
  }

  check() {
    this.statuses = Array.from(this.solution).map((char, i) =>
      this.given[i] === char ? "correct" : "wrong"
    );
  }

  _loadExercise() {    if (!this.exerciseId) return;

    fetch(`api/exercise/${this.exerciseId}`)
      .then(res => res.json())
      .then(data => {
        this.difficultyId = data?.difficultyId || data?.difficulty_id || data?.difficulty || null;
        console.log('[x-calculation] exercise data', { difficultyId: this.difficultyId, data });
        this.exercise = data.exerciseQuestion.toString();
        this.solution = data.exerciseAnswer.toString();
      })
      .catch(err => {
        this.exercise = "Blad w ladowaniu zdania";
        this.solution = "";
        this.difficultyId = null;
        console.log(err);
      });
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadExercise();
  }

  updated(changedProps) {
    if (changedProps.has('exerciseId')) {
      this._loadExercise();
    }
  }

  getDifficultyInfo() {
    const id = Number(this.difficultyId);
    if (!id) return null;

    const label = id <= 1 ? 'Łatwe' : id === 2 ? 'Średnie' : 'Trudne';
    const color = id <= 1 ? '#4CAF50' : id === 2 ? '#FFC107' : '#F44336';
    return { label, color };
  }

  renderDifficultyIndicator() {
    const info = this.getDifficultyInfo();
    if (!info) return null;
    return html`<div class="difficulty-indicator" style="--difficulty-color: ${info.color};"> <span class="dot"></span> <span>${info.label}</span> </div>`;
  }

  render() {
    return html`
      <div class="assigned">
        ${this.renderDifficultyIndicator()}
        <div class="example">${this.exercise}</div>

        <div class="group">
          ${Array.from(this.solution).map(
            (_, i) => html`
              <x-field
                value="${this.given[i] || ""}"
                status="${this.statuses[i] || ""}"
              ></x-field>
            `
          )}
        </div>
      </div>

      <x-keypad @keyboard-pressed=${(e) => this.notify(e.detail)}></x-keypad>
    `;
  }
}

customElements.define("x-calculation", ExerciseCalculation);
