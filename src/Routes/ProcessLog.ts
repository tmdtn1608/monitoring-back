import { Router } from 'express';
import { CheckProcessType, StringBuilder } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';

const router = Router();

/**
 * 접속중인 디바이스 x 프로세스 조회
 */
router.get('/', (req, res) => {
    let param = req.body;
    
    /*
    SELECT pl.* FROM ProcessLog pl ,
(SELECT Device, MAX(RegDate) AS last_login
FROM History h1
WHERE ActType = 'Client login'
AND NOT EXISTS (
    SELECT 1
    FROM History h2
    WHERE h2.Device = h1.Device
    AND h2.ActType = 'Client logout'
    AND h2.RegDate > h1.RegDate
)
GROUP BY Device ) live
WHERE live.Device = pl.Device AND pl.Device = ''
    */

    let qb = new StringBuilder();
    qb.append('SELECT pl.* FROM ProcessLog pl, ')
    .append(`(SELECT Device, MAX(RegDate) AS last_login FROM History h1 `)
    .append(`WHERE ActType = 'Client login' AND NOT EXISTS `)
    .append('(SELECT 1 FROM History h2 WHERE h2.Device = h1.Device ')
    .append(`AND h2.ActType = 'Client logout' AND h2.RegDate > h1.RegDate)`)
    .append('GROUP BY Device ) live ')
    .append('WHERE live.Device = pl.Device AND 1 = 1 ');
    if (param.device !== undefined && param.device !== null) {
        qb.append(`pl.Device = '${param.device}'`);
    }
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
 * 접속중인 클라이언트 정보 조회
 */
router.get("/alive", (req,res) => {

    /*

    SELECT Device, MAX(RegDate) AS last_login
FROM History h1
WHERE ActType = 'Client login'
AND NOT EXISTS (
    SELECT 1
    FROM History h2
    WHERE h2.Device = h1.Device
    AND h2.ActType = 'Client logout'
    AND h2.RegDate > h1.RegDate
    )
GROUP BY Device
*/
    let qb = new StringBuilder();
    qb.append('SELECT Device, MAX(RegDate) AS last_login FROM History h1 ')
    .append(`WHERE ActType = 'Client login' AND NOT EXISTS `)
    .append(`(SELECT 1 FROM History h2 WHERE h2.Device = h1.Device `)
    .append(`AND h2.ActType = 'Client logout' AND h2.RegDate > h1.RegDate) `)
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
 * 
 */
router.post('/', (req,res) => {

    /*
INSERT INTO users (username, email) 
VALUES ('johndoe', 'john@example.com')
ON DUPLICATE KEY UPDATE email = 'john@newdomain.com',
updated_at = CURRENT_TIMESTAMP;
    */
    let param = req.body;
    if (param.device === undefined || param.device === null) {
        res.status(400).send("No device");
    }
    if (param.process === undefined || param.process === null) {
        res.status(400).send("No actType");
    }

    let processJson = JSON.stringify(param.process);
    let qb = new StringBuilder();
    qb.append('INSERT INTO ProcessLog (Device, Process) ')
    .append(`VALUES ('${param.device}','${processJson}') `)
    .append(`ON DUPLICATE KEY UPDATE Process = '${processJson}', `)
    .append('UpdatedAt = CURRENT_TIMESTAMP');

    DB_CLIENT.GetInstance()
    .AsyncQuery(qb.toString())
    .then((result) => {
        // const jsonResult = JSON.stringify(result);
        res.json({"result" : "true"});
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });

});

export default router;