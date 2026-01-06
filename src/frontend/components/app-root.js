import { html, css, LitElement } from "../lib/lit.min.js";

import "./login-view.js";
import "./home-view.js";
import "./account-view.js"; 
import "./lessons-viewer.js";
import "./exercise-viewer.js";

export class AppRoot extends LitElement {
  static properties = {
    currentView: { type: String }, 
    user: { type: Object },
    activeLessonId: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      background: #373a68ff;
      margin: 0;
      overflow: hidden;
    }
  `;

  constructor() {
    super();
    this.currentView = 'loading';
    this.user = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.checkSession();
  }

  async checkSession() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        this.user = await res.json();
        this.currentView = 'home';
      } else {
        this.currentView = 'login';
      }
    } catch (e) {
      this.currentView = 'login';
    }
  }

  handleNavigate(e) {
    this.currentView = e.detail;
  }

  handleExitLesson() {
    this.currentView = 'home';
    this.activeLessonId = null; 
  }

  handleOpenLesson(e) {
    this.activeLessonId = e.detail.lessonId;
    this.currentView = 'exercise';
  }

  handleLogout() {
    window.location.href = '/logout'; 
  }

  render() {
    switch (this.currentView) {
      case 'loading':
        return html`<div style="color:white; text-align:center; padding-top:40vh">Ładowanie...</div>`;

      case 'login':
        return html`<x-login-view></x-login-view>`;

      case 'home':
        return html`
          <x-home-view 
            .user="${this.user}" 
            @navigate="${(e) => this.handleNavigate(e)}">
          </x-home-view>`;

      case 'profile':
        return html`
          <button @click="${() => this.currentView = 'home'}" 
            style="position:absolute; top:20px; left:20px; z-index:100; padding:10px; border-radius:10px; border:none; background:#2f3044ff; color:white; cursor:pointer;">
            ⬅ Wróć
          </button>
          <x-account-view .userData="${this.user}"></x-account-view>`;

      case 'exercise':
        return html`
          <x-exercise-view 
            .lessonId="${this.activeLessonId}"
            @exit-lesson="${(e) => this.handleExitLesson(e)}"> 
          </x-exercise-view>
        `;

      case 'learn':
        return html`
          <button @click="${() => this.currentView = 'home'}" 
            style="position:absolute; top:20px; left:20px; z-index:100; padding:10px; border-radius:10px; border:none; background:#2f3044ff; color:white; cursor:pointer; font-weight:bold;">
            ⬅ Wróć do menu
          </button>
          <x-lessons-view 
            .user="${this.user}"
            @open-lesson="${(e) => this.handleOpenLesson(e)}">
          </x-lessons-view>
        `;

      case 'settings':
        return html`<div style="color:white; text-align:center; padding-top:20vh"><h1>Ustawienia ⚙️</h1><button @click="${() => this.currentView = 'home'}">Wróć</button></div>`;

      default:
        return html`<div>Błąd widoku</div>`;
    }
  }
}
customElements.define("app-root", AppRoot);