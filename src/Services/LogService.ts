import { DB_CLIENT } from '../DBConnector.js';

/**
 * 클라이언트 로그인
 * @param device 
 * @returns 
 */
export const logClientLogin = async (device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.CLIENT_LOGIN}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 클라이언트 로그아웃
 * @param device 
 * @returns 
 */
export const logClientLogout = async (device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.CLIENT_LOGOUT}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 웹 유저 로그인
 * @param device 
 * @returns 
 */
export const logUserLogin = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.USER_LOGIN}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 웹 유저 로그아웃
 * @param device 
 * @returns 
 */
export const logUserLogout = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.USER_LOGOUT}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 블랙 프로세스 추가
 * @param device 
 * @returns 
 */
export const logBlackAdded = async (device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.BLACK_ADDED}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 블랙 프로세스 삭제
 * @param device 
 * @returns 
 */
export const logBlackRemoved = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.BLACK_REMOVED}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 화이트 프로세스 추가
 * @param device 
 * @returns 
 */
export const logWhiteAdded = async (device : string) => {
    let res : boolean = false;
    try{
        await DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.WHITE_ADDED}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 화이트 프로세스 삭제
 * @param device 
 * @returns 
 */
export const logWhiteRemoved = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.WHITE_REMOVED}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 프로세스 킬
 * @param device 
 * @returns 
 */
export const logProcKill = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.CMD_KILL_BLACK}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
};

/**
 * 프로세스 자동 킬
 * @param device 
 * @returns 
 */
export const logProcKillAuto = (device : string) => {
    let res : boolean = false;
    try{
        DB_CLIENT.GetInstance()
        .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${device}','${process.env.AUTO_KILL_BLACK}')`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res = true;
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
        });
        
    } catch(error) {
        console.error(error);
    } finally {
        return res;
    }
}