import { css, html, LitElement, unsafeHTML } from "../../lib/lit.min.js";

import "./partial/keypad.js";
import "./partial/field.js";
import "./partial/slider.js";
import "./partial/success-mark.js";
import "./partial/drag-drop.js";
import "./partial/find-error.js";

class AddSubExercise extends LitElement {
  static properties = {
    exerciseId: { type: Number, attribute: "exercise-id" },
    exercise: { type: String },
    solution: { type: String },
    difficultyId: { type: Number },
    given: { attribute: false, type: String }, 
    config: { type: Object },
    sliderMin: { type: Number },
    sliderMax: { type: Number },
    statuses: { attribute: false },

    orderStage: { type: Number },
    orderOperations: { type: Array },
    selectedOpIndex: { type: Number },
    resultOptions: { type: Array },
    selectedResult: { type: Number },
    orderError: { type: String }
  };

  static styles = css`
    :host { display: block; width: 100%; height: 100%; }
    .container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      gap: 20px; 
      color: white; 
      font-family: sans-serif; 
      height: 100%; 
    }
    .question { font-size: 3rem; font-weight: bold; margin-bottom: 20px; }
    .difficulty-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.85);
      margin-bottom: 12px;
    }
    .difficulty-indicator .dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--difficulty-color, #ccc);
    }
    .fields-group { display: flex; flex-direction: row; gap: 0.5rem; margin-bottom: 2rem; }
    .exercise_image { height: 4rem; }
    #image_text_question { display: flex; align-items: center; justify-content: center; }

    .order-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      max-width: 600px;
      align-items: center;
    }

    .order-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      width: 100%;
    }

    .order-button {
      flex: 1 1 150px;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 3px solid rgba(255, 255, 255, 0.25);
      background-color: rgba(255, 255, 255, 0.08);
      color: white;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s ease;
      min-width: 140px;
      text-align: center;
    }

    .order-button:hover {
      background-color: rgba(255, 255, 255, 0.14);
      transform: translateY(-2px);
    }

    .order-button.selected {
      border-color: #5b63ff;
      background-color: rgba(91, 99, 255, 0.25);
    }

    .order-button.wrong {
      border-color: #ff5f5f;
      background-color: rgba(255, 95, 95, 0.25);
    }

    .order-hint {
      color: rgba(255, 255, 255, 0.72);
      font-size: 0.95rem;
      text-align: center;
      max-width: 520px;
    }
   `;

  constructor() {
    super();
    this.exerciseId = null;
    this.exercise = "Ładowanie...";
    this.solution = "";
    this.difficultyId = null;
    this.given = "";
    this.config = { mode: "loading" };
    this.sliderMin = 0;
    this.sliderMax = 10;
    this.statuses = []; 

    this.orderStage = 1;
    this.orderOperations = [];
    this.selectedOpIndex = null;
    this.resultOptions = [];
    this.selectedResult = null;
    this.orderError = null;
  }

  calculateRange() {
    let digits = null;
    if (this.config.answer_length) {
      digits = this.config.answer_length;
    } else {
      const sol = parseInt(this.solution);
      if (isNaN(sol)) return;
      digits = Math.abs(sol).toString().length;
    }
    if (digits == null) return;
    if (digits != 1) {
      this.sliderMin = Math.pow(10, digits - 1); 
      this.sliderMax = Math.pow(10, digits); 
    } else {
      this.sliderMin = 0; 
      this.sliderMax = 10; 
    }
    this.given = Math.floor(this.sliderMax / 2).toString();
  }

  _computeOperationResult(left, op, right) {
    const a = Number(left);
    const b = Number(right);
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? null : a / b;
      default: return null;
    }
  }

  _parseOperations(expression) {
    const tokens = expression.match(/\d+|[()+\-*/]/g) || [];
    const ops = [];
    const depthStack = [];
    let depth = 0;

    const extractOperand = (idx, direction) => {
      const token = tokens[idx];
      if (!token) return null;

      if (token === "(") {
        let balance = 0;
        let end = idx;
        while (end < tokens.length) {
          if (tokens[end] === "(") balance++;
          else if (tokens[end] === ")") balance--;
          if (balance === 0) break;
          end++;
        }
        return tokens.slice(idx, end + 1).join("");
      }

      if (token === ")") {
        let balance = 0;
        let start = idx;
        while (start >= 0) {
          if (tokens[start] === ")") balance++;
          else if (tokens[start] === "(") balance--;
          if (balance === 0) break;
          start--;
        }
        return tokens.slice(start, idx + 1).join("");
      }

      return token;
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === "(") {
        depth++;
        depthStack.push(i);
        continue;
      }
      if (token === ")") {
        depth = Math.max(0, depth - 1);
        depthStack.pop();
        continue;
      }
      if (["+", "-", "*", "/"].includes(token)) {
        const left = extractOperand(i - 1, -1);
        const right = extractOperand(i + 1, 1);
        if (left && right) {
          const prec = token === "*" || token === "/" ? 2 : 1;
          ops.push({
            left,
            op: token,
            right,
            label: `${left} ${token} ${right}`,
            precedence: prec,
            depth
          });
        }
      }
    }

    return ops;
  }

  _prepareOrderExercise() {
    this.orderStage = 1;
    this.selectedOpIndex = null;
    this.selectedResult = null;
    this.orderError = null;
    this.resultOptions = [];

    const [expectedOp = "", expectedResult = ""] = (this.solution || "").split(",");
    this._expectedOp = expectedOp.trim();
    this._expectedResult = expectedResult.trim();

    const expr = (this.exercise || "").toString().trim();
    const ops = this._parseOperations(expr);

    if (!ops.length) {
      this.orderOperations = [];
      return;
    }

    if (this._expectedOp) {
      const opHasExpected = ops.some(o => o.label === this._expectedOp);
    }

    this.orderOperations = ops;
  }

  _chooseOperation(index) {
    this.selectedOpIndex = index;
    this.orderError = null;

    const op = this.orderOperations[index];
    const correctResult = String(this._computeOperationResult(op.left, op.op, op.right));
    const options = new Set();
    options.add(correctResult);

    while (options.size < 4) {
      const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1);
      const candidate = String(Number(correctResult) + delta);
      if (candidate !== correctResult) options.add(candidate);
    }

    this.resultOptions = Array.from(options).sort((a, b) => Number(a) - Number(b));
  }

  _selectResult(value) {
    this.selectedResult = String(value);
    this.orderError = null;
  }

  _normalizeOpLabel(label) {
    return (label || "").toString().replace(/\s+/g, "").trim();
  }

  _getCorrectOperationIndex() {
    if (!this.orderOperations.length) return -1;

    if (this._expectedOp) {
      const expected = this._normalizeOpLabel(this._expectedOp);
      const idx = this.orderOperations.findIndex(o => this._normalizeOpLabel(o.label) === expected);
      if (idx >= 0) return idx;
    }

    const sorted = [...this.orderOperations].sort((a, b) => {
      if (a.depth !== b.depth) return b.depth - a.depth;
      if (a.precedence !== b.precedence) return b.precedence - a.precedence;
      return 0;
    });
    const correct = sorted[0];
    return this.orderOperations.findIndex(o => o === correct);
  }

  _getCorrectResultForSelectedOperation() {
    if (this._expectedResult) {
      return String(this._expectedResult);
    }
    if (this.selectedOpIndex === null) return null;
    const op = this.orderOperations[this.selectedOpIndex];
    return String(this._computeOperationResult(op.left, op.op, op.right));
  }

  handleInput(e) {
    const val = e.detail;
    this.statuses = []; 

    if (['slider', 'drag-drop', 'find-error'].includes(this.config.answer_type)) {
        this.given = val.toString();
    }
    else if (this.config.answer_type === 'keypad') {
        if (val === "<") this.given = this.given.slice(0, -1);
        else if (this.given.length < this.solution.length) this.given += val;
        this.requestUpdate();
    }
  }

  triggerJump() {
      const q = this.shadowRoot.querySelector('.question');
      if(q) {
          q.classList.remove('jumping');
          void q.offsetWidth;
          q.classList.add('jumping');
      }
  }

  check() {
    if (this._checkInProgress) return;

    this._checkInProgress = true;
    let correct = false;

    if (this.config.answer_type === 'order') {
      if (this.orderStage === 1) {
        const correctOpIndex = this._getCorrectOperationIndex();
        if (this.selectedOpIndex === correctOpIndex) {
          this.orderError = null;
          this.orderStage = 2;
          correct = false;
          this._checkInProgress = false;
          return false;
        } else {
          this.orderError = 'Błędna kolejność.';

          this.orderStage = 1;

          setTimeout(() => this._dispatchAnswerComplete(false), 1200);
          this._checkInProgress = false;
          return false;
        }
      } else {
        const correctResult = this._getCorrectResultForSelectedOperation();
        const normalizedSelected = String(this.selectedResult).trim();
        const normalizedCorrect = String(correctResult).trim();

        console.log("Stage2: wybrane =", normalizedSelected, "oczekiwane =", normalizedCorrect);

        if (normalizedSelected === normalizedCorrect) {
          this.orderError = null;
          const mark = this.shadowRoot.getElementById('mark');

          if (mark && typeof mark.show === 'function') {
            mark.show();
            const handleSuccessComplete = () => {
              mark.removeEventListener('success-complete', handleSuccessComplete);
              this._dispatchAnswerComplete(true);
            };
            mark.addEventListener('success-complete', handleSuccessComplete);
          } else {
            this._dispatchAnswerComplete(true);
          }

          correct = true;
        } else {
          this.orderError = 'Wynik jest niepoprawny. Spróbuj jeszcze raz.';

          setTimeout(() => this._dispatchAnswerComplete(false), 1200);
          this._checkInProgress = false;
          return false;
        }
      }
    } else if (this.config.answer_type === 'slider') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();

        } else {
            const el = this.shadowRoot.querySelector('x-input-slider');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    } 
    else if (this.config.answer_type === 'drag-drop') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();
        } else {
            const el = this.shadowRoot.querySelector('x-drag-drop');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }
    else if (this.config.answer_type === 'find-error') {
        correct = (this.given === this.solution)
        if (correct) {
            this.shadowRoot.getElementById('mark').show();
        } else {
            const el = this.shadowRoot.querySelector('x-find-error');
            if(el && typeof el.showError === 'function') el.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }

    else {
        this.statuses = Array.from(this.solution).map((char, i) =>
            this.given[i] === char ? "correct" : "wrong"
        );
        const isAllCorrect = this.statuses.every(s => s === "correct");
        if (isAllCorrect && this.given.length === this.solution.length) {
            this.shadowRoot.getElementById('mark').show();
            correct = true;
        } else {
            correct = false;
            const firstField = this.shadowRoot.querySelector('x-field');
            if (firstField && typeof firstField.showError === 'function') firstField.showError();
            setTimeout(() => this._dispatchAnswerComplete(false), 1000);
        }
    }

    this.isCorrect = correct;

    setTimeout(() => {
      this._checkInProgress = false;
    }, 3200);
  }

  _dispatchAnswerComplete(correct) {
    this.dispatchEvent(new CustomEvent('answer-complete', {
      detail: { correct },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    const id = this.exerciseId || Number(this.getAttribute('exercise-id')) || 1;

    if (!this.exercise || this.exercise === 'Ładowanie...') {
      this._loadExercise(id);
    }
  }

 _loadExercise(id) {
    if (!id) return;
    if (this._loadingId === id) return;
    this._loadingId = id;

    fetch("/api/me/nextQuestion")
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(text => {
        if (!text) {
          return { finished: true };
        }
        try {
          return JSON.parse(text);
        } catch (err) {
          err.message = 'Invalid JSON response: ' + err.message;
          throw err;
        }
      })
      .then(data => {
        console.log('Zaladowano zadanie', id, data);

        if (data && data.finished) {
          this.exerciseId = id;
          this.exercise = "Koniec lekcji";
          this.solution = "";
          this.difficultyId = null;
          this.config = { answer_type: "done" };
          this.dispatchEvent(new CustomEvent('exercise-loaded', { bubbles: true, composed: true }));
          return;
        }

        this.exerciseId = id;
        this.difficultyId = data?.difficultyId || data?.difficulty_id || null;
        this.exercise = data.exerciseQuestion?.toString() || 'Brak pytania';
        this.solution = data.exerciseAnswer?.toString() || '';

        try {
          if (data.exerciseProperties) this.config = JSON.parse(data.exerciseProperties);
      else this.config = { question_type: "text_only", answer_type: "keypad" };

      if (this.config.answer_type === 'slider') {
        this.calculateRange();
      } else if (this.config.answer_type === 'order') {
        this._prepareOrderExercise();
      } else {
        this.given = "";
      }

      this.dispatchEvent(new CustomEvent('exercise-loaded', { bubbles: true, composed: true }));

    } catch (err) {
        console.error('Blad JSON:', err);
        this.config = { question_type: "text_only", answer_type: "keypad" };
    }
      })
      .catch(err => {
        console.error('Blad _loadExercise:', err);
        this.exercise = "Blad polaczenia";
        this.difficultyId = null;
        this.config = { answer_type: "error" }; 
      })
      .finally(() => {
    this._loadingId = null;
      });
  }

updated(changedProps) {
    if (changedProps.has('exerciseId')) {
      const id = this.exerciseId || Number(this.getAttribute('exercise-id'));
      this.given = '';
      this.statuses = [];
      if (id && typeof this._loadExercise === 'function') {
          this._loadExercise(id);
      }
    }
  }
  renderExerciseQuestion() {
    switch (this.config.question_type) {
      case 'text_only':
        return html`
        ${this.exercise}
        `;
      case 'image_text':
        let exerciseWithImgs = this.exercise;
        exerciseWithImgs = exerciseWithImgs.replace(/{(\S*)}/gm, '<img class="exercise_image" src="../exercise_images/$1"/>');
        exerciseWithImgs = exerciseWithImgs.replace(/\\n/gm, '<br/>');
        return html`${unsafeHTML(exerciseWithImgs)}`;
      default:
        return html`${this.exercise}`;
    }
  }


  getDifficultyInfo() {
    const id = Number(this.difficultyId);
    if (!id) return null;

    const label = this.difficultyLabel || (id <= 1 ? 'Łatwe' : id === 2 ? 'Średnie' : 'Trudne');
    const color = id <= 1 ? '#4CAF50' : id === 2 ? '#FFC107' : '#F44336';
    return { label, color };
  }

  renderDifficultyIndicator() {
    const info = this.getDifficultyInfo();
    if (!info) return null;
    return html`<div class="difficulty-indicator" style="--difficulty-color: ${info.color};"> <span class="dot"></span> <span>${info.label}</span> </div>`;
  }

  renderExerciseContent() {
    switch (this.config.answer_type) {
      case 'slider':
        return html`
          <x-input-slider 
            min="${this.sliderMin}" 
            max="${this.sliderMax}"
            value=${Math.floor(this.sliderMax / 2).toString()}
            @value-changed="${this.handleInput}"
          ></x-input-slider>
        `;
      case 'drag-drop':
        return html`
          <x-drag-drop 
            .variants="${this.config.variants || [1, 2, 3]}"
            @value-changed="${this.handleInput}"
          ></x-drag-drop>
        `;

      case 'find-error':
        return html`
          <x-find-error
            .lines="${this.config.lines || []}"
            @value-changed="${this.handleInput}"
          ></x-find-error>
        `;

      case 'order':
        return html`
          <div style="display:flex; flex-direction:column; gap: 18px; width:100%; max-width:560px;">
            <div class="order-panel">
              <div class="order-hint">
                ${this.orderStage === 1
                  ? html`Wybierz działanie, które powinno być wykonane jako pierwsze.`
                  : html`Oblicz wynik wybranego działania.`}
              </div>

              ${this.orderError
                ? html`<div style="color: #ff6b6b; font-weight: 700;">${this.orderError}</div>`
                : null}

              <div class="order-buttons">
                ${this.orderStage === 1
                  ? this.orderOperations.map((op, idx) => {
                      const selected = this.selectedOpIndex === idx;
                      const wrong = this.orderError && selected;
                      return html`
                        <button
                          class="order-button ${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''}"
                          @click="${() => this._chooseOperation(idx)}"
                        >
                          ${op.label}
                        </button>
                      `;
                    })
                  : this.resultOptions.map((opt) => {
                      const selected = this.selectedResult === opt;
                      const wrong = this.orderError && selected;
                      return html`
                        <button
                          class="order-button ${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''}"
                          @click="${() => this._selectResult(opt)}"
                        >
                          ${opt}
                        </button>
                      `;
                    })}
              </div>
            </div>
        `;

      case 'keypad':
        return html`
          <div class="fields-group">
            ${Array.from(this.solution).map((_, i) => html`
                <x-field 
                  value="${this.given[i] || ''}"
                  status="${this.statuses[i] || ''}"
                ></x-field>
            `)}
          </div>
          <x-keypad @keyboard-pressed="${this.handleInput}"></x-keypad>
        `;

      case 'done':
        return html`<div style="text-align:center; padding: 2rem; font-size: 1.2rem;">
          Gratulacje! Przejście przez tę lekcję zostało zakończone.
        </div>`;

      default:
        return html`<div>Wczytywanie...</div>`;
    }
  }

  render() {
    return html`
      <x-success-mark id="mark"></x-success-mark>
      <div class="container">
        ${this.renderDifficultyIndicator()}
        <div class="question">${this.renderExerciseQuestion()}</div>
        ${this.renderExerciseContent()}
      </div>
    `;
  }
}
customElements.define("x-addsub-exercise", AddSubExercise);