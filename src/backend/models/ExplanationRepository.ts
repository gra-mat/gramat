import { Database } from "./Database.ts";
import { Explanation } from './Explanation.ts';

export class ExplanationRepository {

    db : Database;
    
    constructor(db: Database) {
        this.db = db;
    }

    async getExplanation(explanationId : number) : Promise<Explanation> {
        
        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM explanations WHERE id = ?', [explanationId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Explanation ${explanationId} not found`);
            }

            const r = rows[0];
            const explanation = new Explanation(
                r.id,
                r.title,
                r.description
            );
            return explanation;
        } catch (err: any) {
            throw new Error(`Error fetching explanation: ${err}`);
        }
    }
}