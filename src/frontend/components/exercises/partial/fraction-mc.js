import { css, html, LitElement } from "../../../lib/lit.min.js";

class FractionMC extends LitElement {
  static properties = {
    options: { type: Array },
    selectedIndices: { type: Array },
    question: { type: String },
    wrongIndices: { type: Array },
    correctIndices: { type: Array },
  };

  static styles = css`
    :host { display:block; width:100%; color:#eef0ff; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
    .mc-question { font-size:1.3rem; margin-bottom:8px; text-align:center; color:#e6e8ff; }
    .mc-options { display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:8px; }
    label.option {
      display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px;
      background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04); cursor:pointer; user-select:none;
      transition: border-color 0.2s, background-color 0.2s;
    }
    label.option:hover { background: rgba(255,255,255,0.045); }
    label.option.wrong {
      border-color: #ff7a7a !important;
      background-color: rgba(255, 122, 122, 0.15) !important;
    }
    label.option.correct {
      border-color: #6af16a !important;
      background-color: rgba(106, 241, 106, 0.15) !important;
    }
    input[type="checkbox"] { width:18px; height:18px; accent-color:#5b63ff; }
    .option-content { font-weight:700; font-size:1.15rem; color:#ffffff; }
    @media (max-width:600px) { .mc-question{font-size:1.05rem;} .option-content{font-size:1rem;} }
  `;

  constructor() {
    super();
    this.selectedIndices = [];
    this.options = [];
    this.question = "";
    this.wrongIndices = [];
    this.correctIndices = [];
    this._uid = Math.random().toString(36).slice(2,9);
  }

  _onCheckboxChange(idx, ev) {
    const checked = !!ev.target.checked;
    const set = new Set(this.selectedIndices || []);
    if (checked) set.add(idx); else set.delete(idx);
    this.selectedIndices = Array.from(set).sort((a,b)=>a-b);
    this._emitSelection();
  }

  _emitSelection() {
    const indices = this.selectedIndices || [];
    const opts = indices.map(i => this.options?.[i]).filter(Boolean);
    this.dispatchEvent(new CustomEvent("mc-selected", {
      detail: { selectedIndices: indices, selectedOptions: opts },
      bubbles: true,
      composed: true
    }));
  }

  check() {
    return (this.selectedIndices || []).length > 0;
  }

  render() {
    return html`
      <div class="fraction-mc">
        <div class="mc-question">${this.question}</div>
        <div class="mc-options">
          ${this.options?.map((opt, idx) => {
            const id = `mc-${this._uid}-${idx}`;
            const isWrong = (this.wrongIndices || []).includes(idx);
            const isCorrect = (this.correctIndices || []).includes(idx);
            let className = '';
            if (isWrong) className = 'wrong';
            else if (isCorrect) className = 'correct';
            
            return html`
              <label class="option ${className}" for="${id}">
                <input id="${id}" type="checkbox"
                  .checked="${(this.selectedIndices || []).includes(idx)}"
                  @change="${(ev) => this._onCheckboxChange(idx, ev)}" />
                <div class="option-content">${opt.numerator}/${opt.denominator}</div>
              </label>
            `;
          }) || html``}
        </div>
      </div>
    `;
  }
}

customElements.define("x-fraction-mc", FractionMC);