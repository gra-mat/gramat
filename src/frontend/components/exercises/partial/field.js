import { css, html, LitElement } from "../../lib/lit.min.js";

class Field extends LitElement {
  static properties = {
    value: { type: String },
    status: { type: String }, // "", "correct", "wrong"
  };

  static styles = css`
    .window {
      width: 2rem;
      height: 3rem;
      font-size: 2.5rem;
      border: 2px solid white;
      border-radius: 0.5rem;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .correct {
      border: 2px solid #6af16a;
      background-color: #264226ff;
    }

    .wrong {
      border: 2px solid #ff7a7aff;
      background-color: #523434ff;
    }
  `;

  render() {
    return html`
      <div class="window ${this.status}">${this.value?.[0] ?? ""}</div>
    `;
  }
}

customElements.define("x-field", Field);
