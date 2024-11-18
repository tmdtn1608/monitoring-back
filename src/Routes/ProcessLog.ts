import { Router } from 'express';
import { CheckProcessType, StringBuilder } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';
import { blackWhiteList, clients } from '../index.js';
import { parse } from 'path';
import { logProcKillAuto } from '../Services/LogService.js';
import { processINF } from '../Interfaces/index.js';
import { CheckProcessList, GetLiveClient, GetLiveProcess, SaveProcess } from '../Services/ProcessLogService.js';

const router = Router();

/**
 * 접속중인 디바이스 x 프로세스 조회
 */
router.get('/', async (req, res) => {
    let param = req.body;
    let result = await GetLiveProcess(param.device);
    if(result == null) res.status(500);
    else res.json(result);
});

/**
 * 접속중인 클라이언트 정보 조회
 */
router.get("/alive", async (req,res) => {
    let result = await GetLiveClient();
    console.log(`alive result : ${result}`);
    if(result == null) res.status(500);
    else res.json(result);
});

/**
 * 실행중인 프로세스 저장.
 */
router.post('/', async (req,res) => {

    let param = req.body;
    if (param.device === undefined || param.device === null) {
        res.status(400).send("No device");
    }
    if (param.process === undefined || param.process === null) {
        res.status(400).send("No actType");
    }
    /*
"process": [{"pid": 0, "name": "kernel_task", "status": "running", "cpu_percent": null, "memory_percent": null}]
    */
    // console.log(`saved black/white list : ${blackWhiteList}`);

    await CheckProcessList(param);
    // clients
    let processJson = JSON.stringify(param.process);
    let result = await SaveProcess(param.device, processJson);
    if(result == null) res.status(500);
    else res.send({result : result});

});

export default router;