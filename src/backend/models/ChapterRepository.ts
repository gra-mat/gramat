import {Database} from "./Database.ts";
import { Lesson } from './Lesson.ts';
import { Chapter } from './Chapter.ts';


export class ChapterRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getChapter(chapterId : number) : Promise<Chapter> {
        try {
            const chapterRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM chapters WHERE chapter_id = ?`, [chapterId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const chapter = new Chapter(chapterRows[0].chapter_id, chapterRows[0].chapter_name, chapterRows[0].math_branch_id, []);

            const lessonRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM lessons WHERE chapter_id = ?`, [chapterId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const lessons: Array<Lesson> = [];
            lessonRows.forEach((row) => {
                const lesson = new Lesson(row.lesson_id, row.lesson_name, row.chapter_id, []);
                lessons.push(lesson);
            });
            chapter.lessons = lessons;
            return chapter;
        } catch (err) {
            throw new Error(`Error fetching lesson: ${err}`);
        }
    }

    async getChapterList() : Promise<Array<Chapter>> {
        try {
            const chapterList = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM chapters`, [], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const chapters: Array<Chapter> = [];
            chapterList.forEach((row) => {
                const chapter = new Chapter(row.chapter_id, row.chapter_name, row.math_branch_id, []);
                chapters.push(chapter);
            });

            return chapters;
        } catch (err) {
            throw new Error(`Error fetching lesson: ${err}`);
        }
    }
}