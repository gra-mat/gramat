import { css, html, LitElement } from "../../../lib/lit.min.js";
class Keypad extends LitElement {
  static styles = css`
    .keypad {
      height: 40%;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
    .button {
      width: calc((100% - 14px) / 3); 
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #444470ff;
      box-shadow: inset 0 0 0 2px #8587ffff;
      border-radius: 0.5rem;
      font-weight: bold;
      color: white;
        font-size: 2rem;
        line-height: 1;  
    }
  `;

  buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"];

  publish(action) {
    this.dispatchEvent(
      new CustomEvent("keyboard-pressed", {
        detail: action,
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    super.connectedCallback();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./lib/pure.min.css";
    this.renderRoot.prepend(link);
  }

  render() {
    return html`
      <div class="keypad">
        ${this.buttons.map(
          (btn) =>
            html` <button
              class="button pure-button"
              @click=${() => this.publish(btn)}
            >
              ${btn}
            </button>`
        )}
      </div>
    `;
  }
}
customElements.define("x-keypad", Keypad);
