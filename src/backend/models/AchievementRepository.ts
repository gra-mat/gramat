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
                r.image_url,
                r.description,
                r.conditions
            );
            return achievement;
        } catch (err: any) {
            throw new Error(`Error fetching achievement: ${err}`);
        }
    }

    async getAllAchievements() : Promise<Array<Achievement>> {
        try {
            const achievementRows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM achievements`, [], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const achievements: Array<Achievement> = [];
            achievementRows.forEach((row) => {
                const achievement = new Achievement(
                    row.achievement_id,
                    row.name,
                    row.image_url,
                    row.description,
                    row.conditions
                );
                achievements.push(achievement);
            });
            return achievements;
        } catch (err) {
            throw new Error(`Error fetching achievements: ${err}`);
        }
    }
}