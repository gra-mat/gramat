import { css, html, LitElement } from "../../lib/lit.min.js";

const topics = {
  "arytmetyka": [
    "1", "2", "3",
    "4", "5", "6",
  ],
  "geometria": [
    "1", "2", "3",
    "4", "5", "6",
  ],
};

class CampaignView extends LitElement {
  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
    width: 100%;
    color: white;
    font-family: system-ui, sans-serif;
    position: relative; /* important */
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

  .back {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 30px;
    background-color: rgb(47, 48, 68);
    width: 100px;
    text-align: center;
    border-radius: .5em;
    padding-bottom: 5px;
  }

  .topic-view {
    height: calc( 90vh - 64px);
    margin-top: 64px;
    width: 80%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .exercises {
    height: calc(80vh - 64px);
  }
`;

  static properties = {
    selected: { attribute: false, type: Number }
  };


  constructor() {
    super();
    this.selected = 0;
  }



  render() {
    const name = Object.getOwnPropertyNames(topics)[this.selected];
    return html`
      <div class='back'>
        <x-link to="/learn">←</x-link>
      </div>
      <div class='topic-view'>
        <h1>${name}</h1>
        <div class='exercises'>

        </div>
      </div>
      
      <x-navbar></x-navbar>
    `;
  }
}

customElements.define('x-campaign-view', CampaignView);
