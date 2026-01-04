import { Database } from "./Database.ts";
import { Feedback } from './Feedback.ts';

export class FeedbackRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getFeedback(feedbackId : number) : Promise<Feedback> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM feedback WHERE feedback_id = ?', [feedbackId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Feedback ${feedbackId} not found`);
            }

            const r = rows[0];
            const feedback = new Feedback(
                r.feedback_id,
                r.user_id,
                r.exercise_id,
                r.feedback_rating,
                r.added_points
            );
            return feedback;
        } catch (err: any) {
            throw new Error(`Error fetching feedback: ${err}`);
        }
    }
}