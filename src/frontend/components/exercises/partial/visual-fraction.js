import { css, html, LitElement } from "../../../lib/lit.min.js";

class VisualFraction extends LitElement {
  static properties = {
    numerator: { type: Number },
    denominator: { type: Number },
    type: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .visual-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: conic-gradient(
        #5b63ff 0deg calc(var(--percentage) * 3.6deg),
        rgba(255, 255, 255, 0.1) calc(var(--percentage) * 3.6deg)
      );
      border: 3px solid #5b63ff;
    }

    .bar {
      width: 200px;
      height: 40px;
      border: 2px solid #5b63ff;
      border-radius: 8px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .bar-fill {
      height: 100%;
      background-color: #5b63ff;
      width: calc(var(--percentage) * 1%);
      transition: width 0.3s ease;
    }
  `;

  render() {
    const percentage = (this.numerator / this.denominator) * 100;
    
    if (this.type === 'circle') {
      return html`
        <div class="visual-container">
          ${Array.from({length: this.denominator}, (_, i) => html`
            <div class="circle" style="--percentage: ${i < this.numerator ? 100 : 0}"></div>
          `)}
        </div>
      `;
    }

    return html`
      <div class="bar" style="--percentage: ${percentage}">
        <div class="bar-fill"></div>
      </div>
    `;
  }
}

customElements.define("x-visual-fraction", VisualFraction);