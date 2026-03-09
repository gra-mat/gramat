import { css, html, LitElement } from "../../lib/lit.min.js";

export class DragDrop extends LitElement {
  static properties = {
    variants: { type: Array },
    droppedItems: { type: Array }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 100%;
    }

    /* --- ANIMACJA BŁĘDU --- */
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }

    .shaking { 
      animation: shake 0.4s ease-in-out; 
      /* 👇 DODANO !important, żeby nadpisać biały kolor */
      color: #ff6b6b !important; 
    }

    /* --- KOSZYK --- */
    .basket-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .drop-zone {
      width: 300px;
      min-height: 120px;
      border: 3px dashed #6c5ce7;
      border-radius: 15px;
      background-color: rgba(108, 92, 231, 0.1);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 15px;
      transition: all 0.3s;
    }

    .drop-zone.drag-over {
      background-color: rgba(108, 92, 231, 0.3);
      transform: scale(1.02);
      border-color: #fff;
    }

    .placeholder {
      color: rgba(255, 255, 255, 0.5);
      font-size: 1.2rem;
      pointer-events: none;
    }

    /* --- SUMA --- */
    .total-display {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      transition: color 0.2s;
    }

    /* --- KLOCKI W KOSZYKU --- */
    .dropped-chip {
      background-color: #6c5ce7;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .dropped-chip:hover { background-color: #ff7675; }
    .dropped-chip::after { content: "×"; font-size: 1.2rem; margin-left: 5px; opacity: 0.7; }

    /* --- MAGAZYN --- */
    .variants-container {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      width: 100%;
    }

    .draggable-block {
      width: 70px;
      height: 70px;
      background-color: #6c5ce7; 6c5ce7  00b894
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      cursor: grab;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      user-select: none;
      color: white;
    }
    .draggable-block:active { cursor: grabbing; }
  `;

  constructor() {
    super();
    this.variants = [];
    this.droppedItems = [];
  }

  get currentSum() {
    return this.droppedItems.reduce((sum, current) => sum + current, 0);
  }

  handleDragStart(e, value) {
    e.dataTransfer.setData("text/plain", value);
    e.dataTransfer.effectAllowed = "copy";
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    this.shadowRoot.querySelector('.drop-zone').classList.add('drag-over');
  }

  handleDragLeave(e) {
    this.shadowRoot.querySelector('.drop-zone').classList.remove('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    this.shadowRoot.querySelector('.drop-zone').classList.remove('drag-over');

    const valueStr = e.dataTransfer.getData("text/plain");
    const value = parseInt(valueStr);

    if (!isNaN(value)) {
        this.droppedItems = [...this.droppedItems, value];
        this.notifyChange();
    }
  }

  removeItem(indexToRemove) {
    this.droppedItems = this.droppedItems.filter((_, index) => index !== indexToRemove);
    this.notifyChange();
  }

  notifyChange() {
    // Jak cokolwiek zmieniamy, to usuwamy czerwony kolor błędu
    const text = this.shadowRoot.querySelector('.total-display');
    if(text) text.classList.remove('shaking');

    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.currentSum,
      bubbles: true,
      composed: true
    }));
  }

  // 👇 PUBLICZNA METODA DLA RODZICA
  showError() {
    const text = this.shadowRoot.querySelector('.total-display');
    if (text) {
        text.classList.remove('shaking');
        void text.offsetWidth; // Restart animacji
        text.classList.add('shaking');
    }
  }

  render() {
    return html`
      <div class="basket-container">
        <div 
            class="drop-zone"
            @dragover="${this.handleDragOver}"
            @dragleave="${this.handleDragLeave}"
            @drop="${this.handleDrop}"
        >
            ${this.droppedItems.length === 0 
                ? html`<div class="placeholder">Przeciągnij tutaj...</div>` 
                : this.droppedItems.map((val, index) => html`
                    <div class="dropped-chip" @click="${() => this.removeItem(index)}">
                        ${val}
                    </div>
                  `)
            }
        </div>

        <div class="total-display">
            Suma w koszyku: ${this.currentSum}
        </div>
      </div>

      <div class="variants-container">
        ${this.variants.map(val => html`
          <div 
            class="draggable-block" 
            draggable="true" 
            @dragstart="${(e) => this.handleDragStart(e, val)}"
          >
            ${val}
          </div>
        `)}
      </div>
    `;
  }
}
customElements.define("x-drag-drop", DragDrop);