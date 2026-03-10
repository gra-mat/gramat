import { css, html, LitElement } from "../../../lib/lit.min.js";

class BottomNav extends LitElement {
  static styles = css`
:host {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgb(40, 43, 76);
  z-index: 1000;
  box-shadow: 0 -4px 12px rgba(18, 18, 78, 0.2);
}

    img {
  width: 48px;
  height: 48px;
  filter: brightness(0) invert(1); /* white icons */
}
  `;

  constructor() {
    super();
  }

  // TODO: Use to='/profile' instead of @click
  render() {
    return html`
    <x-link to='/'>
        <img src="icons/home.svg" alt="Home">
    </x-link>
    <x-link to='/learn'>
        <img src="icons/learn.svg" alt="Learn">
    </x-link>
    <x-link to='' @click=${() => window.location.href = 'old/account.html'}>
        <img src="icons/account.svg" alt="Account">
    </x-link>
    <x-link to='/settings'>
        <img src="icons/settings.svg" alt="Settings">
    </x-link>
    `;
  }
}

customElements.define('x-navbar', BottomNav);
