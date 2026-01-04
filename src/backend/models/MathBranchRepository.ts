import {Database} from "./Database.ts";
import { Chapter } from './Chapter.ts';
import { MathBranch } from './MathBranch.ts';


export class MathBranchRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getMathBranch(mathBranchId : number) : Promise<MathBranch> {
        try {
            const mathBranchRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM math_branches WHERE math_branch_id = ?`, [mathBranchId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const mathBranch = new MathBranch(mathBranchRows[0].math_branch_id, mathBranchRows[0].math_branch_name, []);

            const chapterRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM chapters WHERE math_branch_id = ?`, [mathBranchId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const chapters: Array<Chapter> = [];
            chapterRows.forEach((row) => {
                const chapter = new Chapter(row.chapter_id, row.chapter_name, row.math_branch_id, []);
                chapters.push(chapter);
            });
            mathBranch.setChapters(chapters);
            return mathBranch;
        } catch (err) {
            throw new Error(`Error fetching lesson: ${err}`);
        }
    }

    async getMathBranchList() : Promise<Array<MathBranch>> {
        try {
            const mathBranchList = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM math_branches`, [], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const mathBranches: Array<MathBranch> = [];
            mathBranchList.forEach((row) => {
                const mathBranch = new MathBranch(row.math_branch_id, row.math_branch_name, []);
                mathBranches.push(mathBranch);
            });

            return mathBranches;
        } catch (err) {
            throw new Error(`Error fetching lesson: ${err}`);
        }
    }
}