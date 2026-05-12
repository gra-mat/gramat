import { css, html, LitElement, unsafeHTML, until } from "../../lib/lit.min.js";

import "./partial/keypad.js";
import "./partial/field.js";
import "./partial/success-mark.js";
import "./partial/drag-drop.js";
import "./partial/explanation-popup.js";

class PercentageExercise extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: String },
    difficultyId: { type: Number },
    given: { state: true },
    config: { type: Object },
    statuses: { state: true },
    mcSelected: { state: true }
  };

  static styles = css`
    :host { display: block; height: 100%; }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: white;
        gap: 20px;
    }

    .question {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
    }

    .fields {
        display: flex;
        gap: 6px;
    }

    .options {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .option-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 90px;
        padding: 15px 22px;
        font-size: 1.8rem;
        font-weight: bold;
        color: white;
        background-color: rgba(255,255,255,0.05);
        border: 3px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .option-btn:hover {
        background-color: rgba(255,255,255,0.15);
        transform: scale(1.05);
    }

    .option-btn.selected {
        border-color: #5b63ff;
        background-color: rgba(91, 99, 255, 0.2);
    }

    .mc-btn {
        min-width: 140px;
    }

    .error {
        border-color: #ff6b6b !important;
        background-color: rgba(255, 0, 0, 0.15) !important;
    }

    .shake {
        animation: shake 0.3s;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        50% { transform: translateX(6px); }
        75% { transform: translateX(-6px); }
        100% { transform: translateX(0); }
    }
    .show-explanation {
      padding: 0.5rem 0.75rem;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      border: 2px solid rgba(120, 119, 198, 0.6);
      background-color: rgba(120, 119, 198, 0.15);
      color: rgba(237, 240, 255, 0.9);
      cursor: pointer;
      font-weight: 700;
      font-size: 1.2rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .show-explanation:hover {
      background-color: rgba(120, 119, 198, 0.3);
      border-color: rgba(120, 119, 198, 0.9);
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(120, 119, 198, 0.4);
    }

    .show-explanation:active {
      transform: scale(0.95);
    }
   `;

constructor() {
super();
this.exercise = "";
this.solution = "";
this.difficultyId = null;
this.given = "";
this.config = {};
this.statuses = [];
this.mcSelected = [];
}

handleInput(e) {
    const val = e.detail;
    this.statuses = [];

    if (this.config.answer_type === "keypad") {
        if (val === "<") this.given = this.given.slice(0, -1);
        else if (this.given.length < this.solution.length) this.given += val;
    }

    if (this.config.answer_type === "drag-drop") {
        this.given = val.toString();
    }

    this.requestUpdate();
}

check() {
    let correct = false;

    if (this.config.answer_type === "multiplechoice") {
        const correctIndices = (this.config.options || [])
            .map((o, i) => o.correct ? i : -1)
            .filter(i => i >= 0);

        const selected = new Set(this.mcSelected);
        const correctSet = new Set(correctIndices);

        const correct =
            selected.size === correctSet.size &&
            [...selected].every(i => correctSet.has(i));

        this.isCorrect = correct;

        const mark = this.shadowRoot.getElementById("mark");

        if (correct) {
            if (mark && typeof mark.show === "function") mark.show();
            else this._dispatchAnswerComplete(true);
        } else {
            const buttons = this.shadowRoot.querySelectorAll(".option-btn");

            buttons.forEach((btn, i) => {
            if (selected.has(i) && !correctSet.has(i)) {
                btn.classList.add("error", "shake");
            }
            if (correctSet.has(i)) {
                btn.classList.add("selected");
            }
            });

            setTimeout(() => {
            buttons.forEach(btn => btn.classList.remove("shake"));
            this._dispatchAnswerComplete(false);
            }, 500);
        }

        return;
    }

    if (this.config.answer_type === "selector") {
        const correct = this.given === this.solution;
        this.isCorrect = correct;

        const mark = this.shadowRoot.getElementById("mark");

        if (correct) {
            if (mark && typeof mark.show === "function") mark.show();
            else this._dispatchAnswerComplete(true);
        } else {
            const buttons = this.shadowRoot.querySelectorAll(".option-btn");
            buttons.forEach(btn => {
            if (btn.textContent.trim() === this.given) {
                btn.classList.add("error", "shake");
                setTimeout(() => btn.classList.remove("shake"), 300);
            }
            });

            setTimeout(() => this._dispatchAnswerComplete(false), 500);
        }

        return;
        }


    if (this.config.answer_type === "drag-drop") {
        correct = this.given === this.solution;

        if (correct) {
            const mark = this.shadowRoot.getElementById("mark");
            if (mark && typeof mark.show === "function") {
            mark.show();
            } else {
            this._dispatchAnswerComplete(correct);
            }
        } else {
            const zone = this.shadowRoot.querySelector("x-drag-drop")?.shadowRoot?.querySelector(".drop-zone");
            if (zone) {
                zone.classList.add("error", "shake");
                setTimeout(() => zone.classList.remove("shake"), 300);
            }
            this._dispatchAnswerComplete(false);
        }
        } else {
        this.statuses = Array.from(this.solution).map((c, i) =>
            this.given[i] === c ? "correct" : "wrong"
    );

    correct = this.statuses.every(s => s === "correct") &&
                this.given.length === this.solution.length;

    if (correct) {
        const mark = this.shadowRoot.getElementById("mark");
        if (mark && typeof mark.show === "function") {
        mark.show();
        } else {
        this._dispatchAnswerComplete(true);
        }
    } else {
        const el = this.shadowRoot.querySelector("x-field");
        el?.showError?.();
        this._dispatchAnswerComplete(false);
    }
    }

    this.isCorrect = correct;
}

_dispatchAnswerComplete(correct) {
  setTimeout(() => {
    this.dispatchEvent(new CustomEvent("answer-complete", {
      detail: { correct },
      bubbles: true,
      composed: true
    }));
  }, 1000);
}


renderContent() {
    switch (this.config.answer_type) {

        case "selector":
        return html`
            <div class="options">
            ${(this.config.options || []).map(opt => html`
                <div
                class="option-btn ${this.given === opt.toString() ? 'selected' : ''}"
                @click=${() => {
                    this.given = opt.toString();
                    this.statuses = [];
                    this.requestUpdate();
                }}
                >
                ${opt}
                </div>
            `)}
            </div>
        `;

        case "multiplechoice":
        return html`
            <div class="options">
            ${(this.config.options || []).map((opt, i) => html`
                <div
                class="option-btn mc-btn ${this.mcSelected.includes(i) ? 'selected' : ''}"
                @click=${() => {
                    if (this.mcSelected.includes(i)) {
                    this.mcSelected = this.mcSelected.filter(x => x !== i);
                    } else {
                    this.mcSelected = [...this.mcSelected, i];
                    }
                    this.requestUpdate();
                }}
                >
                ${opt.value}
                </div>
            `)}
            </div>
        `;

        case "drag-drop":
        return html`
            <x-drag-drop
            .variants=${this.config.variants || []}
            @value-changed=${this.handleInput}
            ></x-drag-drop>
        `;

        case "keypad":
        default:
        return html`
            <div class="fields">
            ${Array.from(this.solution).map((_, i) => html`
                <x-field
                value=${this.given[i] || ""}
                status=${this.statuses[i] || ""}
                ></x-field>
            `)}
            </div>

            <x-keypad @keyboard-pressed=${this.handleInput}></x-keypad>
        `;
    }
}

  async renderExplanationPopup() {
    console.log('Ładowanie objaśnienia dla ID:', this.config.explanation_id);
    const response = await fetch(`/api/explanation/${this.config.explanation_id}`)
    const explanation = await response.json();
    if (!explanation || !explanation.title || !explanation.description) {
      console.error('Nieprawidłowe dane objaśnienia:', explanation);
      return;
    } 
    console.log('Zaladowano objaśnienie:', explanation);
    return html`<x-explanation-popup title="${explanation.title}" description="${explanation.description}"></x-explanation-popup>`;
  }
  
  renderExplanationPopupBtn() {
    return html`<button class="show-explanation" @click="${() => this.shadowRoot.querySelector('x-explanation-popup').visible = true}">?</button>`;
  }

render() {
    return html`
      <x-success-mark id="mark"></x-success-mark>

      <div class="container">
        <div class="question">${this.exercise}</div>
        ${this.renderContent()}
        ${this.config.explanation_id !== undefined ? this.renderExplanationPopupBtn() : null}
        ${this.config.explanation_id !== undefined ? until(this.renderExplanationPopup()) : null}        
      </div>
    `;
  }
}

customElements.define("x-percentage-exercise", PercentageExercise);