import { css, html, LitElement } from "../../lib/lit.min.js";
import "./partial/navbar.js"

class SettingsView extends LitElement {
    static properties = {
        user: { type: Object }
    };

    static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 90%;
      width: 100%;
      color: white;
      font-family: system-ui, sans-serif;
    }

    .subtitle { 
        font-size: 1.1rem; 
        margin-bottom: 2rem; 
    }

    .grid-menu {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 90%;
        max-width: 600px;
    }


    @media (min-width: 768px) {
    .grid-menu {
        grid-template-columns: repeat(3, 1fr);
    }
    }


    .aligner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .menu-card {
      background: #2f3044ff;
      border-radius: 20px;
      padding: 1rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .icon {
      width: 48px;
      height: 48px;
      fill: white;
      color: white;
      margin-bottom: 0.5rem;
    }
    
    .icon img {
        filter: brightness(0) invert(1);
    }
    
    .label {
        display: block;
        margin-top: 0.5rem;
    }
  `;

    render() {
        return html`
        <center>
            <h1> There is no settings yet. </h1>
        </center>
    <x-navbar></x-navbar>
    `;
    }
}
customElements.define("x-settings-view", SettingsView);