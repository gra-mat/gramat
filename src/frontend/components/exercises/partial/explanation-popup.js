import { css, html, LitElement, unsafeHTML } from "../../../lib/lit.min.js";

export class ExplanationPopup extends LitElement {
  static properties = {
    visible: { type: Boolean },
    title: { type: String },
    description: { type: String },
  };

  static styles = css`
    :host {
      --popup-border: #7877c6;
      --text-primary: #edf0ff;
      --text-secondary: rgba(237, 240, 255, 0.85);
      --btn-hover: rgba(255, 255, 255, 0.25);
      --close-btn-hover: rgba(255, 119, 198, 0.2);
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .popup-container {
      border: 2px solid var(--popup-border);
      border-radius: 12px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      background-color: rgb(55, 58, 104);
      box-shadow: 
        0 10px 40px rgba(55, 58, 104, 0.2),
        0 0 20px rgba(55, 58, 104, 0.1);
      animation: slideUp 0.3s ease-out;
      font-family: sans-serif;
      color: var(--text-primary);
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      border-radius: 4px;
    }

    .close-btn:hover {
      background-color: var(--close-btn-hover);
      color: var(--text-primary);
    }

    .popup-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      color: var(--text-primary);
      padding-right: 32px;
    }

    .popup-description {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .hidden {
      display: none;
    }

        #check-button {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 0;
      background: transparent;
    }

    .button {
      width: 85%;
      max-width: 420px;
      height: 48px;
      border-radius: 10px;
      font-size: 1rem;
      background-color: #50518d;
      color: white;
      border: none;
      cursor: pointer;
    }
    
    .button:hover {
      background-color: var(--btn-hover);
    }

    .explenation_image {
      max-width: 100%;
    }
  `;

  constructor() {
    super();
    this.visible = true;
    this.title = "";
    this.description = "";
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleEscapeKey.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleEscapeKey.bind(this));
  }

  _handleEscapeKey(event) {
    if (event.key === "Escape" && this.visible) {
      this.close();
    }
  }

  close() {
    this.visible = false;
    this.dispatchEvent(
      new CustomEvent("popup-closed", {
        bubbles: true,
        composed: true,
      })
    );
  }

  show(title = "", description = "") {
    this.title = title;
    this.description = description;
    this.visible = true;
    this.dispatchEvent(
      new CustomEvent("popup-opened", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.visible) {
      return html`<div class="hidden"></div>`;
    }
    console.log('Rendering ExplanationPopup with title:', this.title);
    let descriptionWithImgs = this.description;
    descriptionWithImgs = descriptionWithImgs.replace(/{(\S*)}/gm, '<img class="explenation_image" src="../../exercise_images/$1"/>');
    descriptionWithImgs = descriptionWithImgs.replace(/\\n/gm, '<br/>');

    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="popup-container" @click="${(e) => e.stopPropagation()}">
          <h2 class="popup-title">${this.title}</h2>
          ${unsafeHTML(descriptionWithImgs)}
          <div id="check-button">
            <button class="button" title="Przejdź do zadania" @click="${this.close}">Przejdź do zadania</button>
          </div>
        </div>
      </div>
    `;
  }

  _handleOverlayClick() {
    this.close();
  }
}

customElements.define("x-explanation-popup", ExplanationPopup);
