import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';
import { v4 as uuidv4 } from 'uuid';

export const ResetLicense = async (device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`UPDATE License SET Device = NULL WHERE Device = '${device}'`)
        .then((result) => {
            res = true;
        })
        .catch((error) => {
            throw error;
        });

    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const GetLicense = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        await DB_CLIENT.GetInstance().AsyncQuery("select * from License")
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

export const CreateLicense = async () => {
    let res : string | null = null;
    try {
        let licenseNum : string = uuidv4();
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO License (License) VALUES ('${licenseNum}')`)
        .then((result) => {
            res = licenseNum;
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

export const DeleteLicense = async (license : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`DELETE FROM License WHERE License = '${license}'`)
        .then((result) => {
            res = true;
        })
        .catch((error) => {
            throw error;
        });

    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const SetLicense = async (device : string, license : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`UPDATE License SET Device = '${device}' WHERE License = '${license}'`)
        .then((result) => {
            res = true;
        })
        .catch((error) => {
            throw error;
        });

    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

export const CheckUsedLicense = async(license : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`SELECT COUNT(*)  FROM License WHERE License = '${license}' AND (Device is null OR Device = '')`)
        .then((result) => {
            if(result != null) {
                let cnt = result[0].CNT;
                // 0이면 사용불가
                // 1이면 사용가능
                switch (cnt) {
                    case 0:
                        res = false;
                        break;
                    case 1:
                        res = true;
                        break;
                    default:
                        throw new Error("Duplicated");
                }
            }
        })
        .catch((error) => {
            throw error;
        });

    } catch(error) {
        console.error(error);
        throw error;
    } finally {
        return res;
    }
};

export const CheckLicense = async (license : string, device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`SELECT COUNT(*) as CNT FROM License WHERE License = '${license}' AND Device = '${device}'`)
        .then((result) => {
            if(result != null) {
                let cnt = result[0].CNT;
                switch (cnt) {
                    case 0:
                        res = false;
                        break;
                    case 1:
                        res = true;
                        break;
                    default:
                        throw new Error("Duplicated");
                }
            }
        })
        .catch((error) => {
            throw error;
        });

    } catch(error) {
        console.error(error);
        throw error;
    } finally {
        return res;
    }
};