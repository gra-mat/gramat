import { css, html, LitElement } from "../../../lib/lit.min.js";

class FractionMatching extends LitElement {
  static properties = {
    fractions: { type: Array },
    values: { type: Array },
    answers: { type: Array },
    wrongIndices: { type: Array },
    correctIndices: { type: Array },
  };

  static styles = css`
    .fraction-matching {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .matching-row {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      transition: background-color 0.2s;
    }

    .matching-row.wrong {
      background-color: rgba(255, 122, 122, 0.15) !important;
      border-left: 3px solid #ff7a7a;
    }

    .matching-row.correct {
      background-color: rgba(106, 241, 106, 0.15) !important;
      border-left: 3px solid #6af16a;
    }

    .fraction-label {
      font-weight: 700;
      font-size: 1.1rem;
      color: #ffffff;
      min-width: 70px;
    }

    select {
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      background-color: rgba(91,99,255,0.1);
      color: #ffffff;
      font-size: 1rem;
      cursor: pointer;
      flex: 1;
      max-width: 200px;
    }

    select:hover {
      background-color: rgba(91,99,255,0.15);
    }

    select:focus {
      outline: none;
      border-color: #5b63ff;
      box-shadow: 0 0 4px #5b63ff88;
    }

    option {
      background-color: #1a1e35;
      color: #ffffff;
    }
  `;

  constructor() {
    super();
    this.fractions = [];
    this.values = [];
    this.answers = [];
    this.wrongIndices = [];
    this.correctIndices = [];
  }

  _onChange(e, i) {
    this.answers[i] = e.target.value === "" ? null : Number(e.target.value);
    // reset statusow
    this.wrongIndices = [];
    this.correctIndices = [];
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("matching-complete", {
      detail: this.answers.slice(), 
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="fraction-matching">
        ${this.fractions?.map((frac, i) => {
          const isWrong = (this.wrongIndices || []).includes(i);
          const isCorrect = (this.correctIndices || []).includes(i);
          let className = '';
          if (isWrong) className = 'wrong';
          else if (isCorrect) className = 'correct';
          
          return html`
            <div class="matching-row ${className}">
              <div class="fraction-label">${frac.numerator}/${frac.denominator}</div>
              <select @change="${(e)=> this._onChange(e, i)}">
                <option value="">Wybierz...</option>
                ${this.values?.map((val, j) => html`
                  <option value="${j}" ?selected=${this.answers[i] === j}>${val}</option>
                `)}
              </select>
            </div>
          `;
        }) || html``}
      </div>
    `;
  }
}

customElements.define("x-fraction-matching", FractionMatching);
