import { CONST } from "src/Const";
import mysql, { Pool, PoolConnection, PoolOptions, RowDataPacket, FieldPacket } from "mysql2/promise";

interface DbClient {
    Check: () => Promise<void>;
    Clear: () => Promise<void>;
    ClearPool: () => Promise<void>;
    Query: (query: string, param?: any[]) => Promise<RowDataPacket[] | null>;
    AsyncQuery: (query: string, param?: any[]) => Promise<RowDataPacket[] | null>;
    AsyncQueryWithId: (query: string, param?: any[]) => Promise<{ rows: RowDataPacket[], insertId?: FieldPacket[] } | null>;
}

const DB_CLIENT = (function () {
    let instance: DbClient;
    let connectionPool: Pool;
    let promisePool: Pool | null;

    function Instance(): DbClient {
        return {
            Check: async function () {
                const checkCon = await mysql.createConnection({
                    host: CONST.DB_HOST,
                    port: Number(CONST.DB_PORT),
                    user: CONST.DB_USER,
                    password: CONST.DB_PASS,
                    database: CONST.DB_NAME,
                });
                return checkCon.connect();
            },
            Clear: async function () {
                if(promisePool != null) return promisePool.end();
            },
            ClearPool: async function () {
                await connectionPool.end();
                promisePool = null;
            },
            Query: async function (query: string, param: any[] = []) {
                let result: RowDataPacket[] | null = null;
                try {
                    const [rows] = await connectionPool.query<RowDataPacket[]>(query, param);
                    result = rows;
                } catch (error) {
                    console.error(error);
                }
                return result;
            },
            AsyncQuery: async function (query: string, param: any[] = []) {
                let result: RowDataPacket[] | null = null;
                try {
                    if(promisePool != null) {
                        const [rows] = await promisePool.query<RowDataPacket[]>(query, param);
                        result = rows;
                    }
                } catch (error) {
                    console.error(error);
                }
                return result;
            },
            AsyncQueryWithId: async function (query: string, param: any[] = []) {
                let result: { rows: RowDataPacket[]; insertId?: FieldPacket[] } | null = null;
                try {
                    if(promisePool != null) {
                        const [rows, insertId] = await promisePool.query<RowDataPacket[]>(query, param);
                        result = { rows, insertId };
                    }
                } catch (error) {
                    console.error(error);
                }
                return result;
            }
        };
    }

    return {
        GetInstance: function (): DbClient {
            if (!instance) {
                instance = Instance();
                connectionPool = mysql.createPool({
                    connectionLimit: Number(CONST.DB_POOL),
                    host: CONST.DB_HOST,
                    port: Number(CONST.DB_PORT),
                    user: CONST.DB_USER,
                    password: CONST.DB_PASS,
                    database: CONST.DB_NAME,
                });
                promisePool = connectionPool;

                connectionPool.on('connection', function (connection: PoolConnection) {
                    console.info(`MySQL Connection Complete ${connection.threadId}`);
                });
                connectionPool.on('enqueue', function () {
                    console.info('Waiting for available connection...');
                });
                connectionPool.on('acquire', function (connection: PoolConnection) {
                    console.info(`MySQL Connection ${connection.threadId} acquired`);
                });
                connectionPool.on('release', function (connection: PoolConnection) {
                    console.info(`MySQL Connection ${connection.threadId} released`);
                });
            }

            return instance;
        }
    };
})();

export { DB_CLIENT };
