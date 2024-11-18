import { Router } from 'express';
import { DB_CLIENT } from '../DBConnector.js';
import { HistoryType } from '../Const.js';
import { StringBuilder } from '../Util.js';

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
    let qb = new StringBuilder();
    qb.append('SELECT Device, MAX(RegDate) AS last_login ')
        .append('FROM History t1 ')
        .append(`WHERE ActType = 'Client login' `)
        .append('AND NOT EXISTS ( ')
        .append('SELECT 1 FROM History t2 ')
        .append('WHERE t2.Device = t1.Device ')
        .append(`AND t2.ActType = 'Client logout' `)
        .append('AND t2.RegDate > t1.RegDate)')
        .append('GROUP BY Device');
    DB_CLIENT.GetInstance()
    .AsyncQuery(qb.toString())
    .then((result) => {
        // const jsonResult = JSON.stringify(result);
        res.json(result);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

/**
 * 전체로그 조회
 */
router.get("/all", (req,res) => {
    DB_CLIENT.GetInstance()
    .AsyncQuery(`select * from History`)
    .then((result) => {
        // const jsonResult = JSON.stringify(result);
        res.json(result);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
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
        DB_CLIENT.GetInstance()
        .AsyncQuery(`DELETE FROM History WHERE Idx = ${param.idx}`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res.json({"result" : "true"});
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
            res.status(500);
        });
    }
    else if (param.idx < 0){
        // 전체 삭제(TRUNCATE TABLE)
        DB_CLIENT.GetInstance()
        .AsyncQuery(`TRUNCATE TABLE History`)
        .then((result) => {
            // const jsonResult = JSON.stringify(result);
            res.json({"result" : "true"});
        })
        .catch((error) => {
            console.error('Error fetching process list:', error);
            res.status(500);
        });
    }
    else {
        // error
        res.status(500);
    }
});

export default router;