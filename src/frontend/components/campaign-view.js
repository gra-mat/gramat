import { css, html, LitElement } from "../../lib/lit.min.js";

class YearSelection extends LitElement {
    static properties = {};

    static styles = css`
        :host {
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            height: 8%;
            align-items: center;
            justify-content: center;
            column-gap: 3%;
            background-color: #373a68ff;
            color: white;
            width: 100%;
        }

        #container {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 92%;
            width: 100%;
            background-color: #252746ff;
            overflow-y: auto;
            padding: 2rem 0;
            gap: 1.5rem;
        }

        /* Thin/Invisible Scrollbar */
        #container::-webkit-scrollbar {
            width: 4px;
        }

        #container::-webkit-scrollbar-track {
            background: transparent;
        }

        #container::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        #container::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        /* Firefox scrollbar styling */
        #container {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .lesson-btn {
            display: grid;
            place-items: center;
            width: 80%; /* 80% of container width */
            min-height: 60px; /* Minimum height */
            border-radius: 8px;
            background-color: #6166acff;
            color: white; /* Changed from #252746ff for better contrast */
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            border: none;
            font-size: 1.1rem;
            padding: 1rem;
        }

        .lesson-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            background-color: #7076c4ff;
        }

        #progress {
            width: 70%;
            height: 65%;
            background-color: #3f418aff;
            border-radius: 0.6em;
            border: 0.2em solid #7d94fcff;
        }

        #bar {
            width: 20%;
            height: 100%;
            background-color: #4f51ffff;
            border-radius: 0.4em;
        }

        #score {
            height: 65%;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            padding-right: 5%;
            font-family: Verdana, sans-serif;
        }

        #close {
            height: 65%;
            aspect-ratio: 1;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #a73636ff;
            border-radius: 0.4em;
            cursor: pointer;
        }

        .button {
            width: 85%;
            height: 70%;
            border-radius: 1rem;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            text-transform: uppercase;
            background-color: #6f703aff;
            color: white;
            box-shadow: inset 0 0 0 4px #fcff5bff;
        }
    `;

    constructor() {
        super();
        this.selection = [
            'klasa 1 sp',
            'klasa 2 sp',
            'klasa 3 sp',
            'klasa 4 sp',
            'klasa 5 sp',
            'klasa 6 sp',
            'klasa 7 sp',
            'klasa 8 sp',
            'klasa 1 lo',
            'klasa 2 lo',
            'klasa 3 lo',
            'klasa 4 lo',
        ];
    }

    render() {
        return html`
            <div class="header">
                <div id="close">X</div>
                <div id="progress">
                    <div id="bar"></div>
                </div>
                <div id="score">10</div>
            </div>
            <div id='container'>
                ${this.selection.map(
                    className => html`
                        <button class="lesson-btn">${className}</button>
                    `
                )}            
            </div>
        `;
    }
}



class ExerciseSelection extends LitElement {
    static properties = {
        currentSelectionIndex: { type: Number },
        currentExerciseIndex: { type: Number }
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            color: white;
        }

        .header {
            display: flex;
            height: 8%;
            align-items: center;
            justify-content: center;
            column-gap: 3%;
            background-color: #373a68ff;
            color: white;
            width: 100%;
        }

        #container {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 92%;
            width: 100%;
            background-color: #252746ff;
            overflow-y: auto;
            padding: 2rem 0;
            gap: 1.5rem;
            position: relative;
        }

        /* Selection Display Area */
        .selection-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 90%;
            min-height: 200px;
            margin-bottom: 2rem;
        }

        .selection-name {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 3rem;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 1rem;
        }

        .navigation-controls {
            display: flex;
            justify-content: space-between;
            width: 90%;
            margin-bottom: 2rem;
        }

        .nav-button {
            width: 120px;
            height: 50px;
            border-radius: 8px;
            background-color: #6166acff;
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-button:hover:not(:disabled) {
            background-color: #7076c4ff;
            transform: translateY(-2px);
        }

        .nav-button:disabled {
            background-color: #3f418aff;
            cursor: not-allowed;
            opacity: 0.6;
        }

        /* Exercises Grid */
        .exercises-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
            gap: 15px;
            width: 90%;
            max-width: 600px;
            margin-top: 1rem;
        }

        .exercise-button {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            background-color: #6166acff;
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .exercise-button:hover {
            background-color: #7076c4ff;
            transform: scale(1.05);
        }

        .exercise-button.active {
            background-color: #4f51ffff;
            box-shadow: 0 0 0 3px #7d94fcff;
            transform: scale(1.05);
        }

        .exercise-button.completed {
            background-color: #6f703aff;
        }

        /* Thin/Invisible Scrollbar */
        #container::-webkit-scrollbar {
            width: 4px;
        }

        #container::-webkit-scrollbar-track {
            background: transparent;
        }

        #container::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        #container::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        /* Firefox scrollbar styling */
        #container {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        #progress {
            width: 70%;
            height: 65%;
            background-color: #3f418aff;
            border-radius: 0.6em;
            border: 0.2em solid #7d94fcff;
            position: relative;
            overflow: hidden;
        }

        #bar {
            width: 20%;
            height: 100%;
            background-color: #4f51ffff;
            border-radius: 0.4em;
            transition: width 0.3s ease;
        }

        #score {
            height: 65%;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            padding-right: 5%;
            font-family: Verdana, sans-serif;
        }

        #close {
            height: 65%;
            aspect-ratio: 1;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #a73636ff;
            border-radius: 0.4em;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #close:hover {
            background-color: #c74646ff;
            transform: scale(1.05);
        }

        /* Stats display */
        .stats {
            display: flex;
            justify-content: space-between;
            width: 90%;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            color: #b0b3d8;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
        }
    `;

    constructor() {
        super();
        this.selection = [
            {name: 'cyfry i liczby', exercises: 10},
            {name: 'dodawanie i odejmowanie', exercises: 10},
            {name: 'tabliczka mnożenia', exercises: 10},
            {name: 'obliczenia pisemne', exercises: 10},
        ];
        this.currentSelectionIndex = 0;
        this.currentExerciseIndex = 0;
        this.completedExercises = new Set();
    }

    nextSelection() {
        if (this.currentSelectionIndex < this.selection.length - 1) {
            this.currentSelectionIndex++;
            this.currentExerciseIndex = 0;
            this.requestUpdate();
        }
    }

    previousSelection() {
        if (this.currentSelectionIndex > 0) {
            this.currentSelectionIndex--;
            this.currentExerciseIndex = 0;
            this.requestUpdate();
        }
    }

    selectExercise(index) {
        this.currentExerciseIndex = index;
        this.requestUpdate();
    }

    completeExercise() {
        const selection = this.selection[this.currentSelectionIndex];
        const exerciseId = `${this.currentSelectionIndex}-${this.currentExerciseIndex}`;
        this.completedExercises.add(exerciseId);
        this.requestUpdate();
        
        // Auto-advance to next exercise if available
        if (this.currentExerciseIndex < selection.exercises - 1) {
            setTimeout(() => {
                this.currentExerciseIndex++;
                this.requestUpdate();
            }, 300);
        }
    }

    isExerciseCompleted(selectionIndex, exerciseIndex) {
        return this.completedExercises.has(`${selectionIndex}-${exerciseIndex}`);
    }

    getCurrentSelection() {
        return this.selection[this.currentSelectionIndex];
    }

    getProgressPercentage() {
        const current = this.getCurrentSelection();
        const totalExercises = current.exercises;
        const completed = Array.from({length: totalExercises}, (_, i) => 
            this.isExerciseCompleted(this.currentSelectionIndex, i)
        ).filter(Boolean).length;
        return (completed / totalExercises) * 100;
    }

    render() {
        const currentSelection = this.getCurrentSelection();
        const progressPercentage = this.getProgressPercentage();
        const totalExercises = currentSelection.exercises;
        const completedExercises = Array.from({length: totalExercises}, (_, i) => 
            this.isExerciseCompleted(this.currentSelectionIndex, i)
        ).filter(Boolean).length;

        return html`
            <div class="header">
                <div id="close" @click=${() => console.log('Close clicked')}>X</div>
                <div id="progress">
                    <div id="bar" style="width: ${progressPercentage}%"></div>
                </div>
                <div id="score">${completedExercises}/${totalExercises}</div>
            </div>
            <div id='container'>
                <div class="selection-display">
                    <div class="selection-name">
                        ${currentSelection.name}
                    </div>
                    
                    <div class="stats">
                        <div class="stat-item">
                            <span>Selection</span>
                            <span class="stat-value">${this.currentSelectionIndex + 1}/${this.selection.length}</span>
                        </div>
                        <div class="stat-item">
                            <span>Progress</span>
                            <span class="stat-value">${Math.round(progressPercentage)}%</span>
                        </div>
                        <div class="stat-item">
                            <span>Current</span>
                            <span class="stat-value">${this.currentExerciseIndex + 1}</span>
                        </div>
                    </div>
                    
                    <div class="navigation-controls">
                        <button 
                            class="nav-button" 
                            @click=${this.previousSelection}
                            ?disabled=${this.currentSelectionIndex === 0}
                        >
                            ← Backward
                        </button>
                        
                        <button 
                            class="nav-button" 
                            @click=${this.nextSelection}
                            ?disabled=${this.currentSelectionIndex === this.selection.length - 1}
                        >
                            Forward →
                        </button>
                    </div>
                </div>

                <div class="exercises-grid">
                    ${Array.from({length: totalExercises}, (_, index) => html`
                        <button 
                            class="exercise-button 
                                   ${index === this.currentExerciseIndex ? 'active' : ''}
                                   ${this.isExerciseCompleted(this.currentSelectionIndex, index) ? 'completed' : ''}"
                            @click=${() => this.selectExercise(index)}
                        >
                            ${index + 1}
                        </button>
                    `)}
                </div>

                <button 
                    class="nav-button" 
                    style="margin-top: 2rem; width: 200px;"
                    @click=${this.completeExercise}
                >
                    Complete Exercise ${this.currentExerciseIndex + 1}
                </button>
            </div>
        `;
    }
}


customElements.define("x-year-selection", YearSelection);
customElements.define("x-exercise-selection", ExerciseSelection);
