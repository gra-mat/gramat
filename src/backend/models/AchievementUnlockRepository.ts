import { Database } from "./Database.ts";
import { AchievementUnlock } from './AchievementUnlock.ts';

export class AchievementUnlockRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getAchievementUnlock(achievementId : number, userId : number) : Promise<AchievementUnlock> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM achievements_unlocks WHERE achievement_id = ? AND user_id = ?', [achievementId, userId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Achievement unlock (${achievementId}, ${userId}) not found`);
            }

            const r = rows[0];
            const achievementUnlock = new AchievementUnlock(
                r.achievement_id,
                r.user_id,
                r.unlock_date
            );
            return achievementUnlock;
        } catch (err: any) {
            throw new Error(`Error fetching achievement unlock: ${err}`);
        }
    }
}