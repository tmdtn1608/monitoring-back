import { Router } from 'express';
import { DB_CLIENT } from '../DBConnector.js';
import { HistoryType } from '../Const.js';
import { StringBuilder } from '../Util.js';
import { logClientLogin, logClientLogout } from '../Services/LogService.js';
import { DeleteAllHistory, DeleteHistory, GetAllLog, GetLiveDevice } from '../Services/HistoryService.js';

const router = Router();

router.post("/",(req,res) => {
    let param = req.body;
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }
    if (param.actType === undefined || param.actType === null) {
        res.status(400).send("No actType");
    }

    let result : boolean = false;
    if(param.actType === process.env.CLIENT_LOGIN)
    {
        result = logClientLogin(param.mac);
    }
    else if (param.actType === process.env.CLIENT_LOGOUT) {
        result = logClientLogout(param.mac);
    }
    res.send(result);
});

/**
 * 실시간 온라인 클라이언트 조회
 */
router.get("/", (req, res) => {
    let result = GetLiveDevice();
    if(result == null) res.status(500).send("Failed live device");
    res.json(result);
});

/**
 * 전체로그 조회
 */
router.get("/all", (req,res) => {

    let result = GetAllLog();
    if(result == null) res.status(500).send("Failed get all log");
    res.json(result);
});

/**
 * 로그 삭제
 */
router.delete("/", (req,res) => {
    let param = req.body;
    if (param.idx === undefined || param.idx === null) {
        res.status(400).send("No idx");
    }

    if(param.idx > 0) {
        // 타겟 삭제
        let result = DeleteHistory(param.idx);
        if(!result) res.status(500).send("Failed to delete log");
        else res.send(result);
    }
    else if (param.idx < 0){
        // 전체 삭제(TRUNCATE TABLE)
        let result = DeleteAllHistory();
        if(!result) res.status(500).send("Failed to reset table");
        else res.send(result);
    }
    else {
        // error
        res.status(400).send("Invalid idx");
    }
});

export default router;