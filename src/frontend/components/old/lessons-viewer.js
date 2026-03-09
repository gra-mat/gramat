import { css, html, LitElement } from "../../lib/lit.min.js";

class LessonsView extends LitElement {
  static properties = {
    lessons: { type: Array }
  }

  constructor(){
    super();
    this.lessons = [];
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      height: 8%;
      align-items: center;
      justify-content: center;
      column-gap: 3%;
      background-color: #373a68ff;
      color: white;
      font-weight: 600;
    }

    .content {
      display: flex;
      height: 92%;
      justify-content: center;
      align-items: center;
      background-color: #252746ff;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .lesson-btn {
      display: grid;
      place-items: center;
      aspect-ratio: 1 / 1;
      border-radius: 8px;
      background-color: #6166acff;
      color: #252746ff;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .lesson-btn:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      background-color: #7076c4ff;

    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
        .lesson-btn {
        min-width: 140px;
        min-height: 140px;
        font-size: 20px;
      }
    }
  `;

  async firstUpdated() {
    try {
      const res = await fetch("/api/lesson/list");
      const data = await res.json();
      this.lessons = data;
    } catch (err) {
      console.error("Blad pobierania lekcji:", err);
    }
  }

  _selectLesson(id) {
    console.log("Wybrano lekcje:", id);
    this.dispatchEvent(new CustomEvent("lesson-selected", {
      detail: { lessonId: id },
      bubbles: true,
      composed: true
    }));
    window.location.href = `lesson.html?lessonId=${id}`; // po kliknieciu w lekcje przelacza sie na ten plik, wiec jak nazwe pliku bedziecie zmieniac to tu okok 

  }

  render() {
    return html`
      <div class="header">
        Wybierz lekcje
      </div>
      <div class="content">
        <div class="grid">
          ${this.lessons.map(
            (lesson) => html`
              <button class="lesson-btn" @click=${() => this._selectLesson(lesson.id)}>
                ${lesson.name}
              </button>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("x-lessons-view", LessonsView);