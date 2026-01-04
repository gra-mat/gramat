import { Lesson } from './Lesson.ts';

export class Chapter {
    id: number;
    name: string;
    mathBranchId: number;
    lessons: Array<Lesson>;

    constructor(id: number, name: string, mathBranchId: number, lessons: Array<Lesson>) {
        this.id = id;
        this.name = name;
        this.mathBranchId = mathBranchId;
        this.lessons = lessons;
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

    getMathBranchId(): number {
        return this.mathBranchId;
    }
    
    setChapterId(mathBranchId: number): void {
        this.mathBranchId = mathBranchId;
    }

    getLessons(): Array<Lesson> {
        return this.lessons;
    }

    setLessons(lessons: Array<Lesson>): void {
        this.lessons = lessons;
    }

}