import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';
import { StringBuilder } from '../Util.js';

export const GetProcessList = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        res = await DB_CLIENT.GetInstance()
        .AsyncQuery("select * from ProcessList")
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

export const RegistProcess = async (param : any) => {
    let res : boolean = false;
    try{
        let qb = new StringBuilder();
        qb.append('INSERT INTO ProcessList (ProcessName, Device, IsBlack, IsAuto, MEMO) VALUES ')
        .append(`('${param.processName}','${param.device}',${param.isBlack},${param.isAuto},'${param.memo}')`);
        await DB_CLIENT.GetInstance()
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

export const DeleteProcess = async (process : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`DELETE FROM ProcessList WHERE ProcessName ='${process}'`)
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

export const EditProcess = async (param : any) => {
    let res : boolean = false;
    try{
        // ProcessName
        let processName = param.processName;
        // Device
        let Device = param.device === undefined ? null : param.device;
        // IsBlack
        let IsBlack = param.IsBlack === undefined ? null : param.IsBlack;
        // IsAuto
        let IsAuto = param.IsAuto === undefined ? null : param.IsAuto;
        // Memo
        let Memo = param.Memo === undefined ? null : param.Memo;

        if(IsBlack == null &&
            IsAuto == null &&
            Memo == null
        ) {
            throw new Error("Body invalid");
        }

        let queryBuilder = new StringBuilder();
        queryBuilder.append("UPDATE ProcessList SET ");
        
        let queryArr : string[] = [];
        const separator: string = ", ";
        if(IsBlack != null) {
            queryArr.push(`Device = '${Device}'`);
        }
        if(IsBlack != null) {
            queryArr.push(`IsBlack = ${IsBlack}`);
        }
        if(IsAuto != null) {
            queryArr.push(`IsAuto = ${IsAuto}`);
        }

        if(Memo != null) {
            queryArr.push(`Memo = '${Memo}'`);
        }
        let changedQuery = queryArr.join(separator);

        queryBuilder.append(changedQuery);
        queryBuilder.append(` WHERE ProcessName = '${processName}'`);

        await DB_CLIENT.GetInstance()
        .AsyncQuery(queryBuilder.toString())
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