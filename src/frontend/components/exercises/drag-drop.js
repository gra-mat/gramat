import { css, html, LitElement } from "../../lib/lit.min.js";

const overlap = (a, b) =>
    !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );

class DragDrop extends LitElement {
    static properties = {
        dropped: { type: Array, attribute: false },
        dragable: { type: Array },
        target: { type: Number },
        status: { type: String },
    };

    static styles = css`
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

    .basket-container {
      margin-top: 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 15px;
    }

    .chips{
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      width: 100%;
    }

    .chip {
      width: 70px;
      height: 70px;
      background-color: #6c5ce7; 
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

    .dragged {
        position: absolute;
    }

    .chip {
      width: 70px;
      height: 70px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      user-select: none;
      color: white;
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }

    .correct {
      animation: shake 0.4s ease-in-out;
      color: #81ff6b !important;     
    }
    
    .wrong {
      animation: shake 0.4s ease-in-out;
      color: #f12222 !important;     
    }
    
    .msg {
      font-size: 2rem;
    }
    `;

    constructor() {
        super();
        /** @type {number[]} */
        this.dropped = [];
        /** @type {number[]} */
        this.dragable = [];
        /** @type {"" | "correct" | "wrong"} */
        this.status = "";
    }

    handleDrop(e) {
        const data = e.detail;
        const rect = data.rect;
        const val = data.val;
        const zone = this.shadowRoot.querySelector('.drop-zone').getBoundingClientRect()
        if (overlap(zone, rect)) {
            this.dropped = [...this.dropped, parseInt(val)];
        }
    }

    check() {
        const sum = this.dropped.reduce((sum, x) => sum + x, 0);
        const msg = this.shadowRoot.querySelector('.msg');
        msg.innerHTML = `Zebrano: ${sum} z ${this.target}.`;
        this.status = (sum == this.target) ? "correct" : "wrong";
        return (sum == this.target);
    }

    render() {
        const sum = this.dropped.reduce((sum, x) => sum + x, 0);
        return html`
            <div class="basket-container">

            <div class="drop-zone">
                ${this.dropped?.map(
            (x, i) => html`
                    <div class="dropped chip" 
                    @click=${() => this.dropped = this.dropped.filter((v, n) => n != i)}
                    >
                        ${x}
                    </div>`)
            }
            </div>
            
            <span class="msg ${this.status}"> Do zebrania: ${this.target}</span>

            <div class="chips">
                ${this.dragable.map((x, i) => html`
                <x-dragable @drag-released=${this.handleDrop} value="${x}" class="chip"></x-dragable>
                `)}
            </div>
            </div>
        `;
    }
}

class Dragable extends LitElement {
    static properties = {
        value: { type: String },
        isDragged: { type: Boolean, reflect: true },
        x: { type: Number },
        y: { type: Number },
    };

    static styles = css`
    :host {
      position: relative;

      top:var(--y, 0px);
      left: var(--x, 0px);
      will-change: transform;
    }
    
    :host([isdragged]) {
        position: absolute;
        z-index: 100;
    }

    div {
      width: 100%;
      height: 100%;
      touch-action: none;
      background-color: #6c5ce7; 
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      font-size: 2rem;
      font-weight: bold;
      cursor: grab;

    }
  `;

    constructor() {
        super();
        this.value = '';
        this.isDragged = false;
        this.x = 0;
        this.y = 0;
    }

    updated(changed) {
        if (changed.has('x')) {
            this.style.setProperty('--x', `${this.x}px`);
        }
        if (changed.has('y')) {
            this.style.setProperty('--y', `${this.y}px`);
        }
    }

    startDrag(e) {
        this.isDragged = true;
        e.target.setPointerCapture(e.pointerId);
        this.x = e.clientX
        this.y = e.clientY
    }

    publish() {
        this.dispatchEvent(
            new CustomEvent("drag-released", {
                detail: {
                    rect: this.getBoundingClientRect(),
                    val: this.value,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    endDrag(e) {
        this.isDragged = false;
        e.target.releasePointerCapture(e.pointerId);
        this.x = 0;
        this.y = 0;
        this.publish()

    }



    move(e) {
        if (!this.isDragged) return;
        const rect = this.getBoundingClientRect();
        this.x = e.clientX - rect.width / 2;
        this.y = e.clientY - rect.height / 2;
    }

    render() {
        return html`
      <div
        @pointerdown=${this.startDrag}
        @pointerup=${this.endDrag}
        @pointercancel=${this.endDrag}
        @pointermove=${this.move}
      >
        ${this.value}
      </div>
    `;
    }
}


customElements.define("x-dragable", Dragable);
customElements.define("x-drag-drop", DragDrop);