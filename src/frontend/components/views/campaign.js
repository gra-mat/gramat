import { css, html, LitElement } from "../../lib/lit.min.js";

const topics = {
  "arytmetyka": [
    "1", "2",
    "3", "4",
    "5", "6",
  ],
  "geometria": [
    "1", "2",
    "3", "4",
    "5",
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
    margin-top: -200px;
    width: 80%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

.exercises {
  width: 100%;
  max-height: 250px;   /* controls square size */
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.exercise {
  background-color: rgb(47, 48, 68);
  color: white;
  text-decoration: none;
  border-radius: .5em;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 600;

  aspect-ratio: 1 / 1;
}

.exercise:hover {
  background-color: rgb(60, 62, 90);
  transform: translateY(-2px);
}

.exercise img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.topic-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.topic-nav button {
  width: 80px;
  height: 80px;
  font-size: 36px;
  background: rgb(47,48,68);
  color: white;

  border: none;
  border-radius: .6em;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.topic-nav button:hover {
  background: rgb(60,62,90);
  transform: translateY(-2px);
}
`;

  static properties = {
    selected: { attribute: false, type: Number }
  };


  constructor() {
    super();
    this.selected = 0;
  }

  next_topic() {
    this.selected = (this.selected + 1) % Object.getOwnPropertyNames(topics).length;
  }

  previous_topic() {
    let selected_d = this.selected - 1;
    if (selected_d < 0) {
      selected_d = Object.getOwnPropertyNames(topics).length - 1;
    }
    this.selected = selected_d;
  }

  render() {
    const name = Object.getOwnPropertyNames(topics)[this.selected];
    const exercises = topics[name];

    // TODO: Use to="/learn/${name}/${ex}" argument instead of @click
    return html`
      <div class='back'>
        <x-link to="/learn">←</x-link>
      </div>
      <div class='topic-view'>
        <h1>${name}</h1>
        <div class='exercises'>
          ${exercises.map(
            (ex) => html`
              <x-link class="exercise" to="" @click=${() => window.location.href = `/old/lesson.html?lessonId=${ex}`}>
                <img src="icons/${ex}.png" alt="${ex}" />
              </x-link>
            `
          )}
        </div>
      </div>

      <x-navbar></x-navbar>
    `;
  }
}

customElements.define('x-campaign-view', CampaignView);
