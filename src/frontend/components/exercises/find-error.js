import { css, html, LitElement } from "../../lib/lit.min.js";


class FindErrorExercise extends LitElement {
  static properties = {
    correct: { type: Number },
    lines: { type: Array, attribute: false },
    selected: { type: Number, attribute: false },
    status: { type: String, attribute: false },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-top: 5%;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 90%;
        max-width: 500px;
    }

    .line-item {
      background-color: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
      padding: 15px 20px;
      border-radius: 15px;
      font-size: 2.2rem; 
      font-weight: bold;
      font-family: sans-serif;
      text-align: center;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.2s;
      user-select: none;
    }

    .line-item:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: scale(1.02);
    }


    .line-item.selected {
      background-color: rgba(108, 92, 231, 0.2);
      border-color: #6c5ce7;
      color: white;
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }

    .wrong {
      animation: shake 0.4s ease-in-out;
      border-color: #ff6b6b !important;
      color: #ff6b6b !important;     
      background-color: rgba(255, 107, 107, 0.1);
    }
    
    .correct {
      animation: shake 0.4s ease-in-out;
      border-color: #81ff6b !important;
      color: #81ff6b !important;     
      background-color: rgba(255, 107, 107, 0.1);
    }
    `;

  constructor() {
    super();
    /** @type {string []} */
    this.lines = [];
    /** @type {number} */
    this.correct = 0;
    /** @type {number | null} */
    this.selected = null;
    /** @type {"" | "correct" | "wrong"} */
    this.status = "";
  }

  /** @argument {number} number  */
  selectLine(number) {
    this.selected = number;
    console.log('selected:', this.selected)
  }

  check() {
    this.status = (this.selected == this.correct) ? "correct" : "wrong";
    return (this.selected == this.correct);
  }

  render() {
    return html`
        <div class='container'>
            ${this.lines.map(
      (text, i) => html`
                        <div class="line-item ${i == this.selected ? ('selected ' + this.status) : ''}"
                        @click=${() => this.selectLine(i)}>
                            ${text}
                        </div>
                    `
    )
      }
        </div>
        `;
  }
}

customElements.define("x-find-error", FindErrorExercise);