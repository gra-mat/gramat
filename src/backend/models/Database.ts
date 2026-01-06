import sqlite3 from "sqlite3";

export class Database {

    dbPath: string;
    isConnected: boolean;
    dbObj : sqlite3.Database | null;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
        this.isConnected = false;
        this.dbObj = null;
    }

    connect() : Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbObj = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Database connection error:', err);
                    this.isConnected = false;
                    reject(err);
                } else {
                    console.log('Connected to database');
                    this.isConnected = true;
                    resolve();
                }
            });
        });
    }

    serialze() : Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.dbObj === null) {
                reject(new Error('Database not connected'));
                return;
            }
            this.dbObj.serialize(() => {
                resolve();
            });
        });
    }
    
    getDbInstance() : sqlite3.Database {
        if (this.isConnected && this.dbObj !== null) {
            return this.dbObj;
        } else {
            throw new Error('Database is not connected');
        }
    }
}