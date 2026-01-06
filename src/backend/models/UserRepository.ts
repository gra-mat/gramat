import { Database } from "./Database.ts";
import { User } from './User.ts';

export class UserRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getUserById(userId : string) : Promise<User> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM users WHERE user_id = ?', [userId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`User ${userId} not found`);
            }

            const r = rows[0];
            const user = new User(
                r.user_id,
                r.user_name,
                r.user_email,
                r.user_password,
                r.user_auth_provider,
                r.user_avatar_url,
                r.user_permissions,
                r.user_points,
                r.user_strengths,
                r.user_weaknesses,
                r.user_suggested_exercises,
                r.user_stats
            );
            return user;
        } catch (err: any) {
            throw new Error(`Error fetching user: ${err}`);
        }
    }

    async checkIfUserExists(userId : string) : Promise<boolean> {
        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT 1 FROM users WHERE user_id = ?', [userId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });
            
            return rows && rows.length > 0;
        } catch (err: any) {
            throw new Error(`Error checking user existence: ${err}`);
        }
    }

    async createUserWithGoogle(userId : string, name: string, email: string, avatarUrl: string | null) : Promise<User> {
        const password = null;
        const authProvider = "google";
        const permissions = "normal";
        const points = 0;
        const strengths = null;
        const weaknesses = null;
        const suggestedExercises = null;
        const stats = JSON.stringify({"completedLessons": 0, "perfectlyCompletedLessons": 0, math_branches: {}});
        const newUser = new User(userId, name, email, password, authProvider, avatarUrl, permissions, points, strengths, weaknesses, suggestedExercises, stats);
        try {
            await new Promise<void>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }

                this.db.dbObj.run('INSERT INTO users (user_id, user_name, user_email, user_password, user_auth_provider, user_avatar_url, user_permissions, user_points, user_strengths, user_weaknesses, user_suggested_exercises, user_stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, name, email, password, authProvider, avatarUrl, permissions, points, strengths, weaknesses, suggestedExercises, stats], (err) => {
                    if (err) { reject(err); }
                    else { resolve(); }
                });
            });

            return newUser;
        } catch (err: any) {
            throw new Error(`Error creating a user: ${err}`);
        }
    }

    async updateUser(user: User) : Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.getUserById(user.getId()).then((existingUser) => {
                    const changes = [];
                    const params = [];
                    if (user.getName() !== existingUser.getName()) {
                        changes.push('user_name = ?');
                        params.push(user.getName());
                    }
                    if (user.getEmail() !== existingUser.getEmail()) {
                        changes.push('user_email = ?');
                        params.push(user.getEmail());
                    }
                    if (user.getAuthProvider() !== existingUser.getAuthProvider()) {
                        changes.push('user_auth_provider = ?');
                        params.push(user.getAuthProvider());
                    }
                    if (user.getAvatarUrl() !== existingUser.getAvatarUrl()) {
                        changes.push('user_avatar_url = ?');
                        params.push(user.getAvatarUrl());
                    }
                    if (user.getPermissions() !== existingUser.getPermissions()) {
                        changes.push('user_permissions = ?');
                        params.push(user.getPermissions());
                    }
                    if (user.getPoints() !== existingUser.getPoints()) {
                        changes.push('user_points = ?');
                        params.push(user.getPoints());
                    }
                    if (user.getStrengths() !== existingUser.getStrengths()) {
                        changes.push('user_strengths = ?');
                        params.push(user.getStrengths());
                    }
                    if (user.getWeaknesses() !== existingUser.getWeaknesses()) {
                        changes.push('user_weaknesses = ?');
                        params.push(user.getWeaknesses());
                    }
                    if (user.getSuggestedExercises() !== existingUser.getSuggestedExercises()) {
                        changes.push('user_suggested_exercises = ?');
                        params.push(user.getSuggestedExercises());
                    }
                    if (JSON.parse(user.getStats() as string) !== JSON.parse(existingUser.getStats() as string)) {
                        changes.push('user_stats = ?');
                        params.push(user.getStats());
                    }

                    if (changes.length > 0 && this.db.dbObj !== null) {
                        params.push(user.getId());
                        const query = `UPDATE users SET ${changes.join(', ')} WHERE user_id = ?`;
                        this.db.dbObj.run(query, params, (err) => {
                            if (err) { reject(err); }
                            else { resolve(); }
                        });
                    } else {
                        resolve();
                    }
                });
            });
        } catch (err: any) {
            throw new Error(`Error updating user: ${err}`);
        }
    }

}