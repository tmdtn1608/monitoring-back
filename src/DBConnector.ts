import { CONST } from "src/Const";
import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

interface QueryResult {
    rows: RowDataPacket[];
    insertId?: number;
}

class DBInstance {
    private connectionPool: Pool;
    private checkCon!: mysql.Connection;

    constructor() {
        this.connectionPool = mysql.createPool({
            connectionLimit: CONST.DB_POOL,
            host: CONST.DB_HOST,
            port: CONST.DB_PORT,
            user: CONST.DB_USER,
            password: CONST.DB_PASS,
            database: CONST.DB_NAME,
        });

        this.connectionPool.on('connection', (connection: PoolConnection) => {
            // Logger.info(`MySQL Connection Complete: ${connection.threadId}`);
            console.log(`MySQL Connection Complete: ${connection.threadId}`);
        });
        this.connectionPool.on('enqueue', () => {
            // Logger._log.info('Waiting for available connection...');
            console.log('Waiting for available connection...');
        });
        this.connectionPool.on('acquire', (connection: PoolConnection) => {
            // Logger.info(`MySQL Connection ${connection.threadId} acquired`);
            console.log(`MySQL Connection ${connection.threadId} acquired`);
        });
        this.connectionPool.on('release', (connection: PoolConnection) => {
            // Logger.info(`MySQL Connection ${connection.threadId} released`);
            console.log(`MySQL Connection ${connection.threadId} released`);
        });
    }

    async checkConnection(): Promise<void> {
        this.checkCon = await mysql.createConnection({
            host: CONST.DB_HOST,
            port: CONST.DB_PORT,
            user: CONST.DB_USER,
            password: CONST.DB_PASS,
            database: CONST.DB_NAME,
        });
        await this.checkCon.connect();
    }

    async clearConnection(): Promise<void> {
        await this.checkCon.end();
    }

    async clearPool(): Promise<void> {
        await this.connectionPool.end();
    }

    async query(query: string, param: any[]): Promise<RowDataPacket[]> {
        try {
            const [rows] = await this.connectionPool.query<RowDataPacket[]>(query, param);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async asyncQuery(query: string, param: any[]): Promise<RowDataPacket[]> {
        try {
            const [rows] = await this.connectionPool.query<RowDataPacket[]>(query, param);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async asyncQueryWithId(query: string, param: any[]): Promise<QueryResult> {
        try {
            const [rows, fields] = await this.connectionPool.query<RowDataPacket[]>(query, param);
            const insertId = (fields as any).insertId; // Type assertion
            return { rows, insertId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const DB_CLIENT = (() => {
    let instance: DBInstance | null = null;

    return {
        getInstance: (): DBInstance => {
            if (!instance) {
                instance = new DBInstance();
            }
            return instance;
        },
    };
})();

export { DB_CLIENT };
