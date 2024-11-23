import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';

export const GetDevice = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        res = await DB_CLIENT.GetInstance().AsyncQuery("select * from Device")
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw error;
        });
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        return res;
    }
};

export const ResetDevice = async (device : string) => {
    let res : boolean = false;
    try {
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`DELETE FROM Device WHERE mac = '${device}'`)
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

export const UpdateDevice = async (nick : string, isUsed : Number, device : string) => {
    let res : boolean = false;
    try {
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`UPDATE Device SET Nick = '${nick}', IsUsed = ${isUsed} WHERE mac = '${device}'`)
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

export const RegistDevice = async (device : string) => {
    let res : boolean = false;
    try {
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO Device (mac) VALUES ('${device}')`)
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