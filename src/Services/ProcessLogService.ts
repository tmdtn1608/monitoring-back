import { RowDataPacket } from 'mysql2';
import { DB_CLIENT } from '../DBConnector.js';
import { StringBuilder } from '../Util.js';
import { blackWhiteList, clients } from '../index.js';
import { processINF } from '../Interfaces/index.js';
import { logProcKillAuto } from './LogService.js';

export const GetLiveProcess = async (device : string) => {
    let res : RowDataPacket[] | null = null;
    try {
        let qb = new StringBuilder();
        qb.append('SELECT pl.* FROM ProcessLog pl, ')
        .append(`(SELECT Device, MAX(RegDate) AS last_login FROM History h1 `)
        .append(`WHERE ActType = 'Client login' AND NOT EXISTS `)
        .append('(SELECT 1 FROM History h2 WHERE h2.Device = h1.Device ')
        .append(`AND h2.ActType = 'Client logout' AND h2.RegDate > h1.RegDate)`)
        .append('GROUP BY Device ) live ')
        .append('WHERE live.Device = pl.Device AND 1 = 1 ');
        if (device !== undefined && device !== null) {
            qb.append(`pl.Device = '${device}'`);
        }

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

export const GetLiveClient = async () => {
    let res : RowDataPacket[] | null = null;
    try {
        let qb = new StringBuilder();
        qb.append('SELECT Device, MAX(RegDate) AS last_login FROM History h1 ')
        .append(`WHERE ActType = 'Client login' AND NOT EXISTS `)
        .append(`(SELECT 1 FROM History h2 WHERE h2.Device = h1.Device `)
        .append(`AND h2.ActType = 'Client logout' AND h2.RegDate > h1.RegDate) `)
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

export const SaveProcess = async (device :string, processJson : any) => {
    let res : boolean = false;
    try{
        let qb = new StringBuilder();
        qb.append('INSERT INTO ProcessLog (Device, Process) ')
        .append(`VALUES ('${device}','${processJson}') `)
        .append(`ON DUPLICATE KEY UPDATE Process = '${processJson}', `)
        .append('UpdatedAt = CURRENT_TIMESTAMP');

        await DB_CLIENT.GetInstance()
        .AsyncQuery(qb.toString())
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
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
export const CheckProcessList = async (param : any) => {
    console.log("checkProcessList");
    if (blackWhiteList != null) {
        blackWhiteList.forEach(item => {
            // item.ProcessName
            // console.log(`processes : ${JSON.stringify(item)}`);
            if(item.Device == param.device) {
                // console.log(`chk process :${JSON.stringify(param)}`);
                Array.from(param.process.process, (k,v) => {
                    // k is unknown
                    if (typeof k === "object" && k != null) {
                        let processObject = k as processINF;
                        if (processObject.name === item.ProcessName 
                            && item.IsBlack === 1 && item.IsAuto === 1
                        ) {
                            console.log(`kill Process, devicce : ${param.device}, procName: ${item.ProcessName}`);
                            let msg = {"device" : param.device, "process" : item.ProcessName};
                            clients[param.device].send(item.ProcessName);
                            logProcKillAuto(param.device);
                        } 
                    }
                });
            }
            // console.log(`device : ${item.Device}`);
            // console.log(`process : ${item.ProcessName}`);
        });
    }
};