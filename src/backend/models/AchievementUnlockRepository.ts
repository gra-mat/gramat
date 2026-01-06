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

    async getUnlockedAchievementsByUserId(userId : number) : Promise<Array<AchievementUnlock>> {
        try {
            const achievementUnlockRows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT * FROM achievements_unlocks WHERE user_id = ? AND unlock_date IS NOT NULL`, [userId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const achievementUnlocks: Array<AchievementUnlock> = [];
            achievementUnlockRows.forEach((row) => {
                const achievementUnlock = new AchievementUnlock(
                    row.achievement_id,
                    row.user_id,
                    row.unlock_date
                );
                achievementUnlocks.push(achievementUnlock);
            });
            return achievementUnlocks;
        } catch (err) {
            throw new Error(`Error fetching unlocked achievements: ${err}`);
        }
    }
    async updateAchievementUnlocks(userId : number) : Promise<void> {
        try {
            const achievementRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT achievement_id, conditions FROM achievements`, [], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const unlockedAchievementsRows = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all(`SELECT achievement_id FROM achievements_unlocks WHERE user_id = ? AND unlock_date IS NOT NULL`, [userId], (err, rows) => {
                    if (err) { reject(err) }
                    else { resolve(rows) };
                });
            });

            const unlockedAchievementsIds : any = [];
            unlockedAchievementsRows.forEach(unlockedAchievementRow => {
                unlockedAchievementsIds.push(unlockedAchievementRow.achievement_id);
            });

            const achievementsToUnlock = achievementRows.filter(achievementRow => {
                if (unlockedAchievementsIds.includes(achievementRow.achievement_id)) {
                    return false;
                }
                return true;
            });

            achievementsToUnlock.forEach(async achievement => {
                const conditions = JSON.parse(achievement.conditions);
                    if (Object.keys(conditions)[0] == "xp") {
                        const xpRow = await new Promise<any[]>((resolve, reject) => {
                        if (this.db.dbObj === null) {
                            throw new Error('Database not connected');
                        }
                        this.db.dbObj.all(`SELECT user_points FROM users WHERE user_id = ?`, [userId], (err, rows) => {
                            if (err) { reject(err) }
                            else { resolve(rows) };
                        });
                        });
                        const userXp = xpRow[0].user_points;
                        if (userXp >= conditions["xp"]) {
                            // Unlock achievement
                            this.db.dbObj?.run(`INSERT INTO achievements_unlocks (achievement_id, user_id, unlock_date) VALUES (?, ?, datetime('now'))`, [achievement.achievement_id, userId], (err) => {
                                if (err) {
                                    console.error(`Error unlocking achievement ${achievement.achievement_id} for user ${userId}:`, err);
                                } else {
                                    console.log(`Achievement ${achievement.achievement_id} unlocked for user ${userId}`);
                                }
                            });
                        }
                    }
            });

        } catch (err) {
            throw new Error(`Error updating achievements unlocks: ${err}`);
        }
    }
}