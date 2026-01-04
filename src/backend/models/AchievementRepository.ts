import { Database } from "./Database.ts";
import { Achievement } from './Achievement.ts';

export class AchievementRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getAchievement(achievementId : number) : Promise<Achievement> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM achievements WHERE achievement_id = ?', [achievementId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Achievement ${achievementId} not found`);
            }

            const r = rows[0];
            const achievement = new Achievement(
                r.achievement_id,
                r.name,
                r.description
            );
            return achievement;
        } catch (err: any) {
            throw new Error(`Error fetching achievement: ${err}`);
        }
    }
}