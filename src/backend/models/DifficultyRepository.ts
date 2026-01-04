import { Database } from "./Database.ts";
import { Difficulty } from './Difficulty.ts';

export class DifficultyRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getDifficulty(difficultyId : number) : Promise<Difficulty> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM difficulties WHERE difficulty_id = ?', [difficultyId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Achievement ${difficultyId} not found`);
            }

            const r = rows[0];
            const difficulty = new Difficulty(
                r.difficulty_id,
                r.difficulty_name
            );
            return difficulty;
        } catch (err: any) {
            throw new Error(`Error fetching achievement: ${err}`);
        }
    }
}