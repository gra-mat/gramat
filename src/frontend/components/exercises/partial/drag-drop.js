import { css, html, LitElement } from "../../../lib/lit.min.js";

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
      font-family: sans-serif;
    }

    /* --- KOSZYK --- */
    .basket-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
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
      transition: all 0.2s;
    }

    .drop-zone.drag-over {
      background-color: rgba(108, 92, 231, 0.3);
      transform: scale(1.02);
    }

    /* --- KLOCKI --- */
    .variants-container {
      display: flex;
      flex-direction: row; /* Układ poziomy */
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px; /* Odstępy między klockami */
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      width: 100%;
    }

    .draggable-block {
      width: 70px;
      height: 70px;
      background-color: #6c5ce7;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      cursor: grab;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
      touch-action: none; /* Blokada scrolla podczas dotyku */
      user-select: none;
    }

    .dropped-chip {
      background-color: #6c5ce7;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
    }

    .total-display {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
    }

    .shaking { color: #ff6b6b !important; animation: shake 0.4s; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
  `;

  constructor() {
    super();
    this.variants = [];
    this.droppedItems = [];
    this._proxy = null;
  }

  // Obsługa drag&drop w trybie mobilnym
  handleTouchStart(e, value) {
    const touch = e.touches[0];
    
    this._proxy = document.createElement('div');
    this._proxy.textContent = value;
    
    Object.assign(this._proxy.style, {
      position: 'fixed',
      width: '70px',
      height: '70px',
      backgroundColor: '#6c5ce7',
      borderRadius: '12px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: '10000',
      boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
      fontFamily: 'sans-serif',
      opacity: '0.9'
    });

    document.body.appendChild(this._proxy);
    this._updateProxyPosition(touch.clientX, touch.clientY);
    
    this._dropZoneBounds = this.shadowRoot.querySelector('.drop-zone').getBoundingClientRect();
  }

  handleTouchMove(e) {
    if (!this._proxy) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    this._updateProxyPosition(touch.clientX, touch.clientY);

    const zone = this.shadowRoot.querySelector('.drop-zone');
    if (this._isOver(touch.clientX, touch.clientY)) {
      zone.classList.add('drag-over');
    } else {
      zone.classList.remove('drag-over');
    }
  }

  handleTouchEnd(e) {
    if (!this._proxy) return;
    
    const touch = e.changedTouches[0];
    if (this._isOver(touch.clientX, touch.clientY)) {
      this.addItem(parseInt(this._proxy.textContent));
    }

    this.shadowRoot.querySelector('.drop-zone').classList.remove('drag-over');
    this._proxy.remove();
    this._proxy = null;
  }

  _updateProxyPosition(x, y) {
    this._proxy.style.left = `${x - 35}px`;
    this._proxy.style.top = `${y - 35}px`;
  }

  _isOver(x, y) {
    const b = this._dropZoneBounds;
    return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
  }

  // Obsługa drag&drop w trybie desktopowym
  handleDragStart(e, value) { e.dataTransfer.setData("text/plain", value); }
  handleDragOver(e) { e.preventDefault(); this.shadowRoot.querySelector('.drop-zone').classList.add('drag-over'); }
  handleDragLeave() { this.shadowRoot.querySelector('.drop-zone').classList.remove('drag-over'); }
  handleDrop(e) {
    e.preventDefault();
    this.handleDragLeave();
    const val = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(val)) this.addItem(val);
  }

  addItem(val) {
    this.droppedItems = [...this.droppedItems, val];
    this.notifyChange();
  }

  removeItem(index) {
    this.droppedItems = this.droppedItems.filter((_, i) => i !== index);
    this.notifyChange();
  }

  notifyChange() {
    this.shadowRoot.querySelector('.total-display')?.classList.remove('shaking');
    this.dispatchEvent(new CustomEvent('value-changed', { detail: this.currentSum, bubbles: true, composed: true }));
  }

  get currentSum() { return this.droppedItems.reduce((a, b) => a + b, 0); }

  render() {
    return html`
      <div class="basket-container">
        <div class="drop-zone" 
             @dragover="${this.handleDragOver}" 
             @dragleave="${this.handleDragLeave}" 
             @drop="${this.handleDrop}">
          ${this.droppedItems.length === 0 
            ? html`<div class="placeholder">Przeciągnij tutaj...</div>` 
            : this.droppedItems.map((v, i) => html`
                <div class="dropped-chip" @click="${() => this.removeItem(i)}">${v}</div>
              `)}
        </div>
        <div class="total-display">Suma w koszyku: ${this.currentSum}</div>
      </div>

      <div class="variants-container">
        ${this.variants.map(v => html`
          <div class="draggable-block" 
               draggable="true"
               @dragstart="${e => this.handleDragStart(e, v)}"
               @touchstart="${e => this.handleTouchStart(e, v)}"
               @touchmove="${this.handleTouchMove}"
               @touchend="${this.handleTouchEnd}">
            ${v}
          </div>
        `)}
      </div>
    `;
  }
}
customElements.define("x-drag-drop", DragDrop);