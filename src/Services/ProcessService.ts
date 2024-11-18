import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';
import { StringBuilder } from '../Util.js';

export const GetProcessList = () => {
    let res : RowDataPacket[] | null = null;
    try {
        DB_CLIENT.GetInstance()
        .AsyncQuery("select * from ProcessList")
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

export const RegistProcess = (param : any) => {
    let res : boolean = false;
    try{
        let qb = new StringBuilder();
        qb.append('INSERT INTO ProcessLIST (ProcessName, Device, IsBlack, IsAuto, MEMO) VALUES ')
        .append(`('${param.processName}','${param.device}',${param.isBlack},${param.isAuto},'${param.memo}')`);
        DB_CLIENT.GetInstance()
        .AsyncQuery(qb.toString())
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

export const DeleteProcess = () => {

};

export const EditProcess = () => {

};