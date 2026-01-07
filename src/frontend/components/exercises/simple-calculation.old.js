import { css, html, LitElement } from "../../lib/lit.min.js";

class ExerciseCalculation extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: String },
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

  connectedCallback() {
    super.connectedCallback();
    if (this.exerciseId) {
      fetch(`http://localhost:3000/exercise/${this.exerciseId}`)
        .then(res => res.json())
        .then(data => {
          this.exercise = data.exerciseQuestion.toString();
          this.solution = data.exerciseAnswer.toString();
        })
        .catch(err => {
          this.exercise = "Blad w ladowaniu zdania";
          this.solution = "";
          console.log(err);
        });
    }
  }


  render() {
    return html`
      <div class="assigned">
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
