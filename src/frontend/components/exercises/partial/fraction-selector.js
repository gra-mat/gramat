import { css, html, LitElement } from "../../../lib/lit.min.js";

class FractionSelector extends LitElement {
  static properties = {
    options: { type: Array },
    selectedIndex: { type: Number }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 15px;
    }

    .options-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .fraction-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      padding: 15px;
      border-radius: 10px;
      border: 3px solid transparent;
      transition: all 0.2s;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .fraction-option:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .fraction-option.selected {
      border-color: #5b63ff;
      background-color: rgba(91, 99, 255, 0.2);
    }

    .fraction-num {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      min-width: 45px;
      text-align: center;
    }

    .fraction-line {
      width: 45px;
      height: 2px;
      background-color: white;
      margin: 4px 0;
    }

    .fraction-denom {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      min-width: 45px;
      text-align: center;
    }
  `;

  selectOption(index) {
    this.selectedIndex = index;
    this.dispatchEvent(new CustomEvent('fraction-selected', {
      detail: index,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="options-container">
        ${this.options?.map((frac, index) => html`
          <div 
            class="fraction-option ${this.selectedIndex === index ? 'selected' : ''}"
            @click="${() => this.selectOption(index)}"
          >
            <div class="fraction-num">${frac.numerator}</div>
            <div class="fraction-line"></div>
            <div class="fraction-denom">${frac.denominator}</div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define("x-fraction-selector", FractionSelector);