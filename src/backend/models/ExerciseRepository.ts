import { Database } from "./Database.ts";
import { Exercise } from './Exercise.ts';


export class ExerciseRepository {

    db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getExercise(exerciseId : number) : Promise<Exercise> {

        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM exercises WHERE exercise_id = ?', [exerciseId], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Exercise ${exerciseId} not found`);
            }

            const r = rows[0];
            const exercise = new Exercise(
                r.exercise_id,
                r.lesson_id,
                r.difficulty_id,
                r.random_values_conditions,
                r.exercise_question,
                r.exercise_properties,
                r.exercise_answer
            );
            return exercise;
        } catch (err: any) {
            throw new Error(`eeeError fetching exercise: ${err}`);
        }
    }

    async getRandomExercise() : Promise<Exercise> {
        try {
            const rows: any[] = await new Promise<any[]>((resolve, reject) => {
                if (this.db.dbObj === null) {
                    throw new Error('Database not connected');
                }
                this.db.dbObj.all('SELECT * FROM exercises ORDER BY RANDOM() LIMIT 1', [], (err, rows) => {
                    if (err) { reject(err); }
                    else { resolve(rows); }
                });
            });

            if (!rows || rows.length === 0) {
                throw new Error(`Exercise not found`);
            }
            const r = rows[0];
            const exercise = new Exercise(
                r.exercise_id,
                r.lesson_id,
                r.difficulty_id,
                r.random_values_conditions,
                r.exercise_question,
                r.exercise_properties,
                r.exercise_answer
            );
            return exercise;
        } catch (err: any) {
            throw new Error(`Error fetching exercise: ${err}`);
        }
    }
}