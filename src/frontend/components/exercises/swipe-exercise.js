import { css, html, LitElement } from "../../lib/lit.min.js";

export class SwipeExercise extends LitElement {
  static properties = {
    question: { type: String },
    equation: { type: String },
    isCorrect: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --card-width: 300px;
      --card-height: 400px;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      box-sizing: border-box;
      touch-action: none; 
    }

    .header-question {
      color: #9196d8;
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 40px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 10;
      user-select: none;
      pointer-events: none;
    }

    .card-stack {
      position: relative;
      width: var(--card-width);
      height: var(--card-height);
      z-index: 20; 
    }

    .card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transform: scale(0.95) translateY(10px);
      z-index: 1;
    }

    .card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: grab;
      z-index: 2;
      transform-origin: 50% 100%;
      will-change: transform;
      user-select: none;
      touch-action: none;
    }

    .card:active {
      cursor: grabbing;
    }

    .equation-text {
      font-size: 3rem;
      font-weight: 800;
      color: #373a68;
      text-align: center;
      pointer-events: none;
    }

    .stamp {
      position: absolute;
      top: 40px;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 4px solid;
      opacity: 0;
      transition: opacity 0.1s;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.9);
    }

    .stamp svg {
      width: 60%;
      height: 60%;
      stroke-width: 4px;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .stamp.nope {
      right: 30px;
      border-color: #a73636;
      color: #a73636;
      transform: rotate(15deg);
      box-shadow: 0 4px 15px rgba(167, 54, 54, 0.3);
    }

    .stamp.like {
      left: 30px;
      border-color: #226e2fff;
      color: #226e2fff;
      transform: rotate(-15deg);
      box-shadow: 0 4px 15px rgba(34, 110, 47, 0.3);
    }
  `;

  constructor() {
    super();
    this.question = "Czy to prawda?";
    this.equation = "2 + 2 = 4";
    this.isCorrect = true;
    
    this._startX = 0;
    this._currentX = 0;
    this._isDragging = false;
    this._cardElement = null;
    this._animationInProgress = false;
  }

  firstUpdated() {
    this._cardElement = this.shadowRoot.getElementById('card');
    this._setupGestures();
    this._hideParentCheckButton();
    this._dropCardFromTop();
  }

  updated(changedProperties) {
    if (changedProperties.has('equation')) {
      this._dropCardFromTop();
    }
  }


  _dropCardFromTop() {
    if (!this._cardElement) return;

    this._animationInProgress = true; 

    this._cardElement.style.transition = 'none';
    this._cardElement.style.transform = 'translate(0, -120vh) rotate(0deg)'; 
    
    const nope = this.shadowRoot.getElementById('nope-stamp');
    const like = this.shadowRoot.getElementById('like-stamp');
    if(nope) nope.style.opacity = 0;
    if(like) like.style.opacity = 0;

    requestAnimationFrame(() => {
        setTimeout(() => {
            this._cardElement.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            this._cardElement.style.transform = 'translate(0, 0) rotate(0deg)';
            
            setTimeout(() => {
                this._animationInProgress = false;
            }, 600);
        }, 50);
    });
  }

  _hideParentCheckButton() {
    const parent = this.closest('x-exercise-view');
    if (parent && parent.shadowRoot) {
      const btn = parent.shadowRoot.querySelector('#check-button');
      if (btn) btn.style.display = 'none';
    }
  }

  _setupGestures() {
    const card = this._cardElement;
    
    card.addEventListener('mousedown', (e) => this._startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => this._drag(e.clientX));
    window.addEventListener('mouseup', () => this._endDrag());

    card.addEventListener('touchstart', (e) => this._startDrag(e.touches[0].clientX));
    window.addEventListener('touchmove', (e) => this._drag(e.touches[0].clientX));
    window.addEventListener('touchend', () => this._endDrag());
  }

  _startDrag(clientX) {
    if (this._animationInProgress) return;
    this._isDragging = true;
    this._startX = clientX;
    this._cardElement.style.transition = 'none';
  }

  _drag(clientX) {
    if (!this._isDragging) return;
    
    this._currentX = clientX - this._startX;
    const rotate = this._currentX * 0.05;
    
    this._cardElement.style.transform = `translateX(${this._currentX}px) rotate(${rotate}deg)`;

    const nope = this.shadowRoot.getElementById('nope-stamp');
    const like = this.shadowRoot.getElementById('like-stamp');
    
    if (this._currentX > 0) {
      like.style.opacity = Math.min(this._currentX / 100, 1);
      nope.style.opacity = 0;
    } else {
      nope.style.opacity = Math.min(Math.abs(this._currentX) / 100, 1);
      like.style.opacity = 0;
    }
  }

  _endDrag() {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._cardElement.style.transition = 'transform 0.3s ease-out';

    const threshold = 100;

    if (this._currentX > threshold) {
      this._handleSwipe(true);
    } else if (this._currentX < -threshold) {
      this._handleSwipe(false);
    } else {
      this._cardElement.style.transform = 'translateX(0) rotate(0)';
      this.shadowRoot.getElementById('nope-stamp').style.opacity = 0;
      this.shadowRoot.getElementById('like-stamp').style.opacity = 0;
    }
  }

  _handleSwipe(userSaidYes) {
    this._animationInProgress = true;
    const card = this._cardElement;
    
    const endX = userSaidYes ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
    card.style.transform = `translateX(${endX}px) rotate(${userSaidYes ? 20 : -20}deg)`;

    const isSuccess = (this.isCorrect === userSaidYes);

    setTimeout(() => {
      if (isSuccess) {
        this.dispatchEvent(new CustomEvent('success-complete', { bubbles: true, composed: true }));
      } else {
        setTimeout(() => this._dropCardFromTop(), 500);
      }
    }, 200);
  }

  check() {}

  render() {
    return html`
      <div class="container">
        <div class="header-question">${this.question}</div>
        
        <div class="card-stack">
          <div class="card-bg"></div>
          <div class="card" id="card">
            
            <div class="stamp nope" id="nope-stamp">
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"></line>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"></line>
              </svg>
            </div>

            <div class="stamp like" id="like-stamp">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" stroke="currentColor"></polyline>
              </svg>
            </div>
            
            <div class="equation-text">
              ${this.equation}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("swipe-exercise", SwipeExercise);