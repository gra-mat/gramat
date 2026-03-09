import { css, html, LitElement } from "../../lib/lit.min.js";

export class SuccessMark extends LitElement {
  static properties = {
    visible: { type: Boolean },
    x: { type: Number },
    y: { type: Number }
  };

  static styles = css`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    }

    @keyframes flyUpAndFade {
      0% {
        opacity: 0;
        transform: translate(-50%, 0px) scale(0.5); 
      }
      15% {
        opacity: 1;
        transform: translate(-50%, -20px) scale(1.5); 
      }
      60% {
        opacity: 1;
        transform: translate(-50%, -80px) scale(1.0); 
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -180px) scale(1.2); 
      }
    }

    .mark-container {
      position: absolute;
      animation: flyUpAndFade 3s ease-out forwards;
    }

    .checkmark {
      width: 100px;
      height: 100px;
      fill: none;
      stroke: #2ecc71;
      stroke-width: 7;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 10px rgba(46, 204, 113, 0.5));
    }
  `;

  constructor() {
    super();
    this.visible = false;
    this.x = 50;
    this.y = 50;
    this._hideTimer = null; 
  }

  show() {
  if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
  }

  this.x = Math.floor(Math.random() * 60) + 20;
  this.y = Math.floor(Math.random() * 40) + 30;

  this.visible = false;
  
  setTimeout(() => {
      this.visible = true;
      
      // po koncu animacji timeout na 3s + maly zapas zeby przejsc do next zadania
      this._hideTimer = setTimeout(() => { 
          this.visible = false; 
          this._hideTimer = null;

          this.dispatchEvent(new CustomEvent('success-complete', {
            bubbles: true,
            composed: true
          }));
      }, 3100);
      
  }, 0);
}


  render() {
    if (!this.visible) return html``;

    return html`
      <div 
        class="mark-container" 
        style="left: ${this.x}%; top: ${this.y}%;"
      >
        <svg class="checkmark" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `;
  }
}

customElements.define("x-success-mark", SuccessMark);