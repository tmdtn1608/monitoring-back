import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';
import { StringBuilder } from '../Util.js';

export const GetLiveDevice = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        let qb = new StringBuilder();
        qb.append('SELECT Device, MAX(RegDate) AS last_login ')
            .append('FROM History t1 ')
            .append(`WHERE ActType = 'Client login' `)
            .append('AND NOT EXISTS ( ')
            .append('SELECT 1 FROM History t2 ')
            .append('WHERE t2.Device = t1.Device ')
            .append(`AND t2.ActType = 'Client logout' `)
            .append('AND t2.RegDate > t1.RegDate)')
            .append('GROUP BY Device');
        res = await DB_CLIENT.GetInstance()
        .AsyncQuery(qb.toString())
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw error;
        });
    } catch (error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const GetAllLog = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        res = await DB_CLIENT.GetInstance()
        .AsyncQuery(`select * from History`)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw error;
        });
    } catch (error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const DeleteHistory = async (idx : Number) => {
    let res : boolean = false;
    try {
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`DELETE FROM History WHERE Idx = ${idx}`)
        .then((result) => {
            res = true;
        })
        .catch((error) => {
            throw error;
        });
    } catch (error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const DeleteAllHistory = async () => {
    let res : boolean = false;
    try {
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`TRUNCATE TABLE History`)
        .then((result) => {
            res = true;
        })
        .catch((error) => {
            throw error;
        });
    } catch (error) {
        console.error(error);
    } finally {
        return res;
    }
};