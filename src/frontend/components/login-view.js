import { css, html, LitElement } from "../../lib/lit.min.js"; 

export class LoginView extends LitElement {
  static styles = css`
    :host {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #373a68ff;
        font-family: system-ui, sans-serif;
        color: white;
    }

    .card {
        background: #2f3044ff;
        border-radius: 16px;
        padding: 3rem 2rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
        width: 90%;
        
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .logo {
        width: 120px;   
        height: auto;
        margin-bottom: 1rem;
        border-radius: 12px;
    }

    h1 { 
        margin-bottom: 0.5rem; 
        font-size: 2rem; 
        margin-top: 0;
    }
    
    p { color: #aaa; margin-bottom: 2rem; }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background-color: white;
      color: #333;
      padding: 12px 24px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.1rem;
      transition: transform 0.2s, box-shadow 0.2s;
      width: 100%;
      box-sizing: border-box;
    }

    .google-btn:hover {
      transform: scale(1.05);
      background-color: #f0f0f0;
    }

    .google-icon { width: 24px; height: 24px; }
  `;

  render() {
    return html`
      <div class="card">
        <img class="logo" src="/icons/logo.svg" alt="Gramat Logo" />
        
        <h1>gramat</h1>
        <p>Zaloguj się, aby zapisywać swoje postępy</p>
        
        <a href="/auth/google" class="google-btn">
          <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
          Zaloguj się przez Google
        </a>
      </div>
    `;
  }
}
customElements.define("x-login-view", LoginView);