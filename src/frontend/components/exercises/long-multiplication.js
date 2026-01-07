import { css, html, LitElement } from "../../lib/lit.min.js";
import "../partial/slider.js";
import "../partial/field.js";
import "../partial/keypad.js";


class LongMultiplication extends LitElement {
    static properties = {
        a: { type: String },
        b: { type: String },
        sol: { type: Array, attribute: false },
        selected: { type: Number, attribute: false },
        statuses: { type: Array, attribute: false },
    };

    static styles = css`

    .task {
        height: 58%;  
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
    }

    .assigned {
      width: 13rem;
      height: 19rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
      
    }

    .fields-group {
        display: flex; 
        flex-direction: row; 
        gap: 0.5rem; 
        padding-bottom: 0.5rem;
    }
    .question { 
        font-size: 4rem;
        font-weight: bold; 
    }

    .hidden {
        visibility: hidden;
    }

    .no-border {
        border: none;
    }

   .parent {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-column-gap: 0rem;
        grid-row-gap: 0rem;
    }
    `;

    constructor() {
        super();
        /** @type {string} */
        this.a = "";
        /** @type {string} */
        this.b = "";

        /** @type {string[]} */
        this.sol = ["", "", ""];

        /** @type {0 | 1 | 2 | undefined} */
        this.selected = undefined;

        this.statuses = ["", "", ""];
    }

    check() {

        const results = Array.from(this.solution).map((char, i) => this.given[i] === char);
        const result = results.every(s => s === true);
        this.statuses = result ?
            results.map(() => "correct") :
            results.map(s => s ? "" : "wrong");

        return result;

    }

    handleInput(e) {
        const val = e.detail;
        const id = this.selected;

        if (id == undefined) {
            return;
        }

        if (val === "<") {
            this.sol = this.sol.map((v, i) => i == id ? v.slice(0, -1) : v);
            return;
        }


        if ((id == 0 || id == 1) && this.sol[id].length >= 3) {
            return;
        }

        if (id == 2 && this.sol[id].length >= 4) {
            return;
        }

        this.sol = this.sol.map((v, i) => i == id ? v + val : v);

    }

    select_input(id) {
        this.selected = id;
        this.statuses = this.statuses.map((_v, i) => i == id ? "selected" : "");
    }

    render() {
        const a_of_2 = this.a.substring(0, 2).padStart(5, ' ');
        const b_of_2 = 'x' + this.b.substring(0, 2).padStart(4, ' ');
        const sol1_of_3 = this.sol[0].substring(0, 3).padStart(5, ' ');
        const sol2_of_3 = '+' + this.sol[1].substring(0, 3).padStart(3, ' ') + ' ';
        const sol_of_4 = '=' + this.sol[2].substring(0, 4).padStart(4, ' ');

        return html`
        <div class="task">
        <div class="assigned parent">            
            ${Array.from(a_of_2).map((w, i) => html`
                   <x-field value=${w} border=${(i < 3) ? 'false' : 'true'} ></x-field>  
               `)}

            ${Array.from(b_of_2).map((w, i) => html`
                   <x-field value=${w} border=${(i < 3) ? 'false' : 'true'} ></x-field>  
               `)}
            
            ${Array.from(sol1_of_3).map((w, i) => html`
                   <x-field value=${w}  status=${this.statuses[0]} @click=${() => this.select_input(0)} border=${(i < 2) ? 'false' : 'true'} ></x-field>  
               `)}

            ${Array.from(sol2_of_3).map((w, i) => html`
                   <x-field value=${w}  status=${this.statuses[1]} @click=${() => this.select_input(1)} border=${(i > 3 || i < 1) ? 'false' : 'true'} ></x-field>  
               `)}
            
            ${Array.from(sol_of_4).map((w, i) => html`
                   <x-field value=${w} status=${this.statuses[2]}  @click=${() => this.select_input(2)} border=${(i < 1) ? 'false' : 'true'} ></x-field>  
               `)}      
        </div>
        </div>        
        <x-keypad @keyboard-pressed="${this.handleInput}"></x-keypad>
        `;
    }
}

customElements.define("x-long-multiplication", LongMultiplication);
