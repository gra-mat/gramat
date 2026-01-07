import { css, html, LitElement } from "../../lib/lit.min.js";

export class InputSlider extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    status: { type: String, attribute: false },
  };

  static styles = css`
    :host { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      width: 100%; 
    }
    input[type=range] { 
      width: 80%; 
      max-width: 400px; 
      cursor: pointer; 
      height: 30px; 
      accent-color: #4CAF50; 
    }
    
    .value-display { 
      font-size: 2.5rem; 
      color: #cccccc; 
      font-weight: bold; 
      margin-top: 10px;
      transition: color 0.2s; 
    }


    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }

    .wrong { 
      animation: shake 0.4s ease-in-out; 
      color: #ff6b6b; 
    }

    .correct { 
      animation: shake 0.4s ease-in-out; 
      color: #6bff84; 
    }
  `;

  constructor() {
    super();
    /** @type {number} */
    this.value = 0;
    /** @type {number} */
    this.min = 0;
    /** @type {number} */
    this.max = 10;
    /** @type { "correct" | "wrong" | ""} */
    this.status = '';
  }

  handleInput(e) {
    this.value = parseInt(e.target.value);
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  validate(answer) {
    this.status = this.value == answer ? "correct" : "wrong";
    return this.value == answer;
  }

  render() {
    return html`
      <input 
        type="range" 
        min="${this.min}" 
        max="${this.max}" 
        value="${this.value}" 
        @input="${this.handleInput}"
      >
      <div class="value-display ${this.status}">${this.value}</div>
    `;
  }
}
customElements.define("x-input-slider", InputSlider);