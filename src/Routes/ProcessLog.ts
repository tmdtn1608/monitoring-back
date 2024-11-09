import { Router } from 'express';
import { CheckProcessType, StringBuilder } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';

const router = Router();

/**
 * 조회
 */
router.get('/', (req, res) => {
    
    DB_CLIENT.GetInstance()
    .AsyncQuery(`select * from ProcessLog`)
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
    
    let qb = new StringBuilder();
    qb.append('INSERT INTO ProcessLog (Device, Process) ')
    .append(`VALUES ('${param.device}','${param.process}') `)
    .append(`ON DUPLICATE KEY UPDATE Process = '${param.process}', `)
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