import { css, html, LitElement } from "../../lib/lit.min.js";
import "../partial/slider.js";
import "../partial/field.js";

class InMemoryKeyboardExercise extends LitElement {
    static properties = {
        question: { type: String },
        solution: { type: String },
        given: { type: String, attribute: false },
        statuses: { type: Array, attribute: false }
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

    .fields-group {
        display: flex; 
        flex-direction: row; 
        gap: 0.5rem; 

    }
    .question { 
        font-size: 4rem;
        font-weight: bold; 
    }
    `;

    constructor() {
        super();
        /** @type {string} */
        this.question = "";
        /** @type {string} */
        this.solution = "";
        /** @type {string} */
        this.given = "";
        /** @type {("" | "correct" | "wrong")[]} */
        this.statuses = [];
    }

    check() {

        const results = Array.from(this.solution).map((char, i) => this.given[i] === char);
        const result = results.every(s => s === true);
        this.statuses = result ?
            results.map(() => "correct") :
            results.map(s => s ? "" : "wrong");

        return result;

    }

    handleInput(e) {
        const val = e.detail;

        if (val === "<") {
            this.given = this.given.slice(0, -1);
            return;
        }

        if (this.given.length >= this.solution.length) return;

        this.given += val;
    }

    render() {
        const padded_given = this.given.padStart(this.solution.length, ' ');
        return html`
            <div class="assigned">
                <div class='question'>${this.question}</div>

                <div class="fields-group">
                    ${Array.from(padded_given).map((w, i) => html`
                        <x-field value=${w} status="${this.statuses[i] || ''}"></x-field>  
                    `)}
                </div>
            </div>

            <x-keypad @keyboard-pressed="${this.handleInput}"></x-keypad>
        `;
    }
}

customElements.define("x-in-memory-keyboard", InMemoryKeyboardExercise);