import { Router } from 'express';
import { DB_CLIENT } from '../DBConnector.js';
import { HistoryType } from '../Const.js';

const router = Router();

router.post("/",(req,res) => {
    let param = req.body;
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }
    if (param.actType === undefined || param.actType === null) {
        res.status(400).send("No actType");
    }

    DB_CLIENT.GetInstance()
    .AsyncQuery(`INSERT INTO History (Device,ActType) VALUES ('${param.mac}','${param.actType}')`)
    .then((result) => {
        // const jsonResult = JSON.stringify(result);
        res.json({"result" : "true"});
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

/**
 * 실시간 온라인 클라이언트 조회
 */
router.get("/", (req, res) => {
    DB_CLIENT.GetInstance()
    .AsyncQuery(`select * from History WHERE ActType='${HistoryType.CLIENT_LOGIN}'`)
    .then((result) => {
        // const jsonResult = JSON.stringify(result);
        res.json(result);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

export default router;