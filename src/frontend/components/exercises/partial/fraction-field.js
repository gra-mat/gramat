import { css, html, LitElement } from "../../../lib/lit.min.js";

class FractionField extends LitElement {
  static properties = {
    numerator: { type: String },
    denominator: { type: String },
    status: { type: Array },
    slotActive: { type: String },
  };

  static styles = css`
    .window {
      width: 55px; height: 40px; font-size: 2.1rem;
      border: 2px solid white; border-radius: 0.5rem;
      display: flex; align-items: center; justify-content: center;
      background: transparent; margin: 0;
      transition: border-color 0.13s, background-color 0.13s;
    }
    .window.active { border-color: #5b63ff;
      box-shadow: 0 0 4px #5b63ff88;
      background-color: rgba(91,99,255,0.10);}
    .window.correct { border-color: #6af16a;
      background-color: rgba(38,66,38,0.15);}
    .window.wrong { border-color: #ff7a7aff;
      background-color: rgba(82,52,52,0.15);}
    .fraction-line { width: 55px; height: 2px;
      background-color: white; margin: 6px 0;}
    .fraction-container { display: flex; flex-direction: column; align-items: center;}

    .window.active.correct, .window.correct.active {
      border-color: #6af16a !important;
      background-color: rgba(38,66,38,0.15) !important;
    }
    .window.active.wrong, .window.wrong.active {
      border-color: #ff7a7aff !important;
      background-color: rgba(82,52,52,0.15) !important;
    }
  `;

  render() {
    return html`
      <div class="fraction-container">
        <div class="window ${this.status?.[0] || ""} ${this.slotActive === "numerator" ? "active" : ""}">
          ${this.numerator || ""}
        </div>
        <div class="fraction-line"></div>
        <div class="window ${this.status?.[1] || ""} ${this.slotActive === "denominator" ? "active" : ""}">
          ${this.denominator || ""}
        </div>
      </div>
    `;
  }
}
customElements.define("x-fraction-field", FractionField);