import { css, html, LitElement } from "../../lib/lit.min.js";
import "./partial/navbar.js";

class LearnView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      font-family: system-ui, sans-serif;
      color: white;
      background: #121212;
    }

    .content {
      flex: 1; /* take all remaining vertical space */
      display: flex;
      flex-direction: column;
      justify-content: center; /* vertical center */
      align-items: center;    /* horizontal center */
      gap: 2rem;
      width: 100%;
      margin-left: -20px;
    }

    x-link {
      width: 70%;
      max-width: 600px;
      text-decoration: none;
    }

    x-link > div {
      width: 100%;
      padding: 1.5rem;
      font-size: 2rem;
      font-weight: 600;
      text-align: center;

      background: rgb(47, 48, 68);
      border-radius: 12px;
      cursor: pointer;

      transition: transform 0.15s ease, background 0.15s ease;
    }

    x-link > div:hover {
      background: #2a2a2a;
      transform: translateY(-2px);
    }

    x-navbar {
      width: 100%;
    }

    .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  align-items: center;     /* horizontal center */
  gap: 2rem;
  width: 100%;
  padding: 0 15px; /* optional: small side padding for mobile */
  box-sizing: border-box;
}

x-link {
  width: 70%;
  max-width: 600px;
  display: block; /* ensures x-link fills its width properly */
  text-decoration: none;
}

x-link > div {
  width: 100%;
  margin: 0 auto;  /* center inside x-link */
  padding: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;

  background: rgb(47, 48, 68);
  border-radius: 12px;
  cursor: pointer;

  transition: transform 0.15s ease, background 0.15s ease;
}

x-link > div:hover{
  width: 100%;
  margin: 0 auto;  /* center inside x-link */
  padding: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;

  background: rgb(52, 53, 73);
  border-radius: 12px;
  cursor: pointer;

  transition: transform 0.15s ease, background 0.15s ease;
}

  `;

  render() {
    return html`
      <div class="content">
        <x-link to="/quiz">
          <div>Quiz</div>
        </x-link>

        <x-link to="/campaign">
          <div>Campaign</div>
        </x-link>

        <x-link to="/coming-soon">
          <div>Survival</div>
        </x-link>

        <x-link to="/coming-soon">
          <div>PVP</div>
        </x-link>
      </div>

      <x-navbar></x-navbar>
    `;
  }
}

customElements.define("x-learn-view", LearnView);
