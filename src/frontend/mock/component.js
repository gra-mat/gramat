import { css, html, LitElement } from "../lib/lit.min.js";

class LearnMock extends LitElement {
  static properties = {
  };

  static styles = css``;

  constructor() {
    super();
  }

  render() {
    return html`

    <x-link to=''>home</x-link>
    <x-link to='learn'>learn</x-link>
    <x-link to='account'>account</x-link>
    <x-link to='settings'>settings</x-link>
    `;
  }
}

customElements.define("x-select-view", LearnMock);

