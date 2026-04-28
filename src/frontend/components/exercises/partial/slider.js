import { css, html, LitElement } from "../../../lib/lit.min.js";

export class InputSlider extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number }
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

    .shaking { 
      animation: shake 0.4s ease-in-out; 
      color: #ff6b6b; 
    }
  `;

  constructor() {
    super();
    this.min = null; 
    this.max = null;
    this.value = null; 
  }

  _handleInput(e) {
    this.value = parseInt(e.target.value);
    
    const text = this.shadowRoot.querySelector('.value-display');
    if(text) text.classList.remove('shaking');

    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.value, 
      bubbles: true, 
      composed: true
    }));
  }

  showError() {
    const text = this.shadowRoot.querySelector('.value-display');
    if (text) {
        text.classList.remove('shaking');
        void text.offsetWidth;
        text.classList.add('shaking');
    }
  }

  render() {
    return html`
      <input 
        type="range" 
        min="${this.min}" 
        max="${this.max}" 
        .value="${this.value}" 
        @input="${this._handleInput}"
      >
      <div class="value-display">Twój wybór: ${this.value}</div>
    `;
  }
}
customElements.define("x-input-slider", InputSlider);