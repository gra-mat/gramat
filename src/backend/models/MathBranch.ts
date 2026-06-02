import { Chapter } from './Chapter.ts';
import { Exercise } from './Exercise.ts';

export class MathBranch {
    id: number;
    name: string;
    chapters: Array<Chapter>;
    exercises: Array<Exercise> | null;

    constructor(id: number, name: string, chapters: Array<Chapter>, exercises: Array<Exercise> | null = null) {
        this.id = id;
        this.name = name;
        this.chapters = chapters;
        this.exercises = exercises;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getChapters(): Array<Chapter> {
        return this.chapters;
    }

    setChapters(chapters: Array<Chapter>): void {
        this.chapters = chapters;
    }

    getExercises(): Array<Exercise> | null {
        return this.exercises;
    }
    
    setExercises(exercises: Array<Exercise> | null): void {
        this.exercises = exercises;
    }

}