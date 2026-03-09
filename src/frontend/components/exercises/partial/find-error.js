import { css, html, LitElement } from "../../lib/lit.min.js";

export class FindError extends LitElement {
  static properties = {
    lines: { type: Array },
    selectedIndex: { type: Number } 
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

 
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      width: 90%;
      max-width: 500px;
    }


    .line-item {
      background-color: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
      padding: 15px 20px;
      border-radius: 15px;
      font-size: 2.2rem; 
      font-weight: bold;
      font-family: sans-serif;
      text-align: center;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.2s;
      user-select: none;
    }

    .line-item:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: scale(1.02);
    }


    .line-item.selected {
      background-color: rgba(108, 92, 231, 0.2);
      border-color: #6c5ce7;
      color: white;
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }

    .line-item.shaking {
      animation: shake 0.4s ease-in-out;
      border-color: #ff6b6b !important;
      color: #ff6b6b !important;     
      background-color: rgba(255, 107, 107, 0.1);
    }
  `;

  constructor() {
    super();
    this.lines = [];
    this.selectedIndex = null;
  }

  selectLine(index) {
    this.selectedIndex = index;
    
    const items = this.shadowRoot.querySelectorAll('.line-item');
    items.forEach(item => item.classList.remove('shaking'));

    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.selectedIndex, 
      bubbles: true,
      composed: true
    }));
  }

  showError() {
    if (this.selectedIndex !== null) {
        const items = this.shadowRoot.querySelectorAll('.line-item');
        const selectedItem = items[this.selectedIndex];
        
        if (selectedItem) {
            selectedItem.classList.remove('shaking');
            void selectedItem.offsetWidth; 
            selectedItem.classList.add('shaking');
        }
    }
  }

  render() {
    return html`
      <div class="list-container">
        ${this.lines.map((text, index) => html`
          <div 
            class="line-item ${this.selectedIndex === index ? 'selected' : ''}"
            @click="${() => this.selectLine(index)}"
          >
            ${text}
          </div>
        `)}
      </div>
    `;
  }
}
customElements.define("x-find-error", FindError);