export class Exercise {
    id: number;
    lessonId: number;
    difficultyId: number;
    randomValuesConditions: string | null;
    exerciseQuestion: string;
    exerciseProperties: string | null;
    exerciseAnswer: string | null;

    constructor(id: number, lessonId: number, difficultyId: number, randomValuesConditions: string | null, exerciseQuestion: string, exerciseProperties : string | null, exerciseAnswer: string | null) {
        this.id = id;
        this.lessonId = lessonId;
        this.difficultyId = difficultyId;
        this.randomValuesConditions = randomValuesConditions;
        this.exerciseQuestion = exerciseQuestion;
        this.exerciseProperties = exerciseProperties;
        this.exerciseAnswer = exerciseAnswer;
        if (this.randomValuesConditions != null) {
            this.prepareRandomValuesExercise();
        }
    }

    prepareRandomValuesExercise(): void {

        // Wylosowanie wartosci zmiennych
        const randomValues = this.getRandomValues();
        
        // Podstawienie wylosowanych wartosci do pytania
        const variables = (JSON.parse(this.randomValuesConditions as string) as any)?.variables
        this.exerciseQuestion = this.placeRandomValuesIntoQuestion(this.exerciseQuestion, variables, randomValues);
        
        // Obliczenie odpowiedzi
        this.exerciseAnswer = this.answerEvaluation(this.exerciseQuestion);
    }

    getRandomValues(): Number[] {
        const variableValues = [];
        let rvConditions = JSON.parse(this.randomValuesConditions as string);
        // Sprawdzenie czy nie ma dodatkowych warunkow do wylosowania odpowiedzi
        // TODO: obsluga dodatkowych warunkow
        if (rvConditions != null && (rvConditions as any)?.additional == "") {
            for (let i = 0; i < (rvConditions as any)?.variables.length; i++) {
                // Sprawdzenie z jakiego zbioru liczb losujemy (int, float, etc.)
                if ((rvConditions as any)?.setsOfNumbers[i] == 'int') {
                    const min = (rvConditions as any)?.ranges[i][0];
                    const max = (rvConditions as any)?.ranges[i][1];
                    const minInlude = (rvConditions as any)?.ranges[i][2][0];
                    const maxInlude = (rvConditions as any)?.ranges[i][2][1];
                    // Sprawdzenie czy przedzial jest domkniety (c) czy otwarty (o) z lewej i prawej strony
                    if (minInlude == 'c' && maxInlude == 'c') {
                        variableValues.push(Math.floor(Math.random() * (max - min + 1)) + min);
                    } else if (minInlude == 'c' && maxInlude == 'o') {
                        variableValues.push(Math.floor(Math.random() * (max - min)) + min);
                    } else if (minInlude == 'o' && maxInlude == 'c') {
                        variableValues.push(Math.floor(Math.random() * (max - min)) + min + 1);
                    } else if (minInlude == 'o' && maxInlude == 'o') {
                        variableValues.push(Math.floor(Math.random() * (max - min - 1)) + min + 1);
                    } else {
                        variableValues.push(Math.floor(Math.random() * (max - min + 1)) + min);
                    }
                } else if ((rvConditions as any)?.setsOfNumbers[i] == 'float') {
                    const min = (rvConditions as any)?.ranges[i][0];
                    const max = (rvConditions as any)?.ranges[i][1];
                    const minInlude = (rvConditions as any)?.ranges[i][2][0];
                    const maxInlude = (rvConditions as any)?.ranges[i][2][1];
                    if (minInlude == 'c' && maxInlude == 'c') {
                        variableValues.push(Math.random() * (max - min + 1) + min);
                    } else if (minInlude == 'c' && maxInlude == 'o') {
                        variableValues.push(Math.random() * (max - min) + min);
                    } else if (minInlude == 'o' && maxInlude == 'c') {
                        variableValues.push(Math.random() * (max - min) + min + 1);
                    } else if (minInlude == 'o' && maxInlude == 'o') {
                        variableValues.push(Math.random() * (max - min - 1) + min + 1);
                    } else {
                        variableValues.push(Math.random() * (max - min + 1) + min);
                    }
                }
            }
        }
        return variableValues;
    }

    placeRandomValuesIntoQuestion(question: string, variables: any[], randomValues: Number[]): string {
        let result = question;
        for (let i = 0; i < variables.length; i++) {
            const variableName = variables[i];
            const value = randomValues[i];
            result = result.replace(new RegExp(variableName, 'g'), value.toString());
        }
        return result;
    }

    answerEvaluation(question: string): string {
        try {
            const result = Function('"use strict"; return (' + question + ')')();
            return result.toString();
        } catch (err) {
            throw new Error(`Error evaluating expression: ${question}`);
        }
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getLessonId(): number {
        return this.lessonId;
    }

    setLessonId(lessonId: number): void {
        this.lessonId = lessonId;
    }

    getDifficultyId(): number {
        return this.difficultyId;
    }

    setDifficultyId(difficultyId: number): void {
        this.difficultyId = difficultyId;
    }

    getRandomValuesConditions(): string | null {
        return this.randomValuesConditions;
    }

    setRandomValuesConditions(randomValuesConditions: string | null): void {
        this.randomValuesConditions = randomValuesConditions;
    }

    getExerciseQuestion(): string {
        return this.exerciseQuestion;
    }

    setExerciseQuestion(exerciseQuestion: string): void {
        this.exerciseQuestion = exerciseQuestion;
    }

    getExerciseProperties(): string | null {
        return this.exerciseProperties;
    }

    setExerciseProperties(exerciseProperties: string | null): void {
        this.exerciseProperties = exerciseProperties;
    }

    getExerciseAnswer(): string | null {
        return this.exerciseAnswer;
    }

    setExerciseAnswer(exerciseAnswer: string | null): void {
        this.exerciseAnswer = exerciseAnswer;
    }
}