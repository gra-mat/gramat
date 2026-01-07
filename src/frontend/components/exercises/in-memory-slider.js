import { css, html, LitElement } from "../../lib/lit.min.js";
import "../partial/slider.js";
import "../partial/field.js";

class InMemorySliderExercise extends LitElement {
    static properties = {
        question: { type: String },
        solution: { type: String },
        min: { type: Number },
        max: { type: Number },
        default: { type: Number },
        value: { type: Number },
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
        /** @type {number} */
        this.value = 0;
    }

    check() {
        const el = this.shadowRoot.querySelector('x-input-slider');
        const result = el?.validate(this.solution);
        return result;
    }

    handleInput(e) {
        const val = e.detail;
        this.value = val;
    }

    render() {
        return html`
            <div class="assigned">
                <div class='question'>${this.question}</div>
            </div>

            <x-input-slider 
                min="${this.min}" 
                max="${this.max}" 
                value="${this.default}"
                @value-changed=${this.handleInput}
                ></x-input-slider>
        `;
    }
}

customElements.define("x-in-memory-slider", InMemorySliderExercise);