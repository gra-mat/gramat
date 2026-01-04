import { Chapter } from './Chapter.ts';

export class MathBranch {
    id: number;
    name: string;
    chapters: Array<Chapter>;

    constructor(id: number, name: string, chapters: Array<Chapter>) {
        this.id = id;
        this.name = name;
        this.chapters = chapters;
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

}