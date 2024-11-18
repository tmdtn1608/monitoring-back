import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';

export const GetDevice = () => {
    let res : RowDataPacket[] | null = null;
    try {
        DB_CLIENT.GetInstance().AsyncQuery("select * from Device")
        .then((result) => {
            res = result;
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

export const ResetDevice = (device : string) => {
    let res : boolean = false;
    try {
        DB_CLIENT.GetInstance()
        .AsyncQuery(`UPDATE Device SET IsUsed = FALSE WHERE mac = '${device}'`)
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

export const UpdateDevice = (nick : string, isUsed : Number, device : string) => {
    let res : boolean = false;
    try {
        DB_CLIENT.GetInstance()
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

export const RegistDevice = (device : string) => {
    let res : boolean = false;
    try {
        DB_CLIENT.GetInstance()
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