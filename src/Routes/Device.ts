import { Router } from 'express';
import { DB_CLIENT } from '../DBConnector.js';

const router = Router();

/**
 * 기기조회
 */
router.get('/',(req,res) => {
    DB_CLIENT.GetInstance().AsyncQuery("select * from Device")
    .then((result) => {
        const jsonResult = JSON.stringify(result);
        res.json(result);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

/**
 * 등록된 기기 & 라이센스 삭제
 */
router.delete("/", (req,res) => {
    let param = req.body;
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }

    const RemoveDeviceFromLicense = async (mac : string): Promise<any> => {
        const res = await DB_CLIENT.GetInstance()
            .AsyncQuery(`UPDATE License SET Device = NULL WHERE Device = '${mac}'`);
        return res;
    };

    DB_CLIENT.GetInstance()
    .AsyncQuery(`UPDATE Device SET IsUsed = FALSE WHERE mac = '${param.mac}'`)
    .then(() => RemoveDeviceFromLicense(param.mac))
    .then((result) => {
        res.json({result : true });
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });
});

/**
 * 기기정보 수정(별명, 메모 등) -> Backlog
 */
router.put("/", (req,res) => {
    let param = req.body;
    console.log(`param chk : ${JSON.stringify(param)}`);
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }
    if (param.nick === undefined || param.nick === null) {
        res.status(400).send("No nick");
    }
    if (param.isUsed === undefined || param.isUsed === null) {
        res.status(400).send("No isUsed");
    }
    let isUsed = param.isUsed === true ? 1 : 0;

    DB_CLIENT.GetInstance()
    .AsyncQuery(`UPDATE Device SET Nick = '${param.nick}', IsUsed = ${isUsed} WHERE mac = '${param.mac}'`)
    .then((result) => {
        res.json({result : true });
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });
});

export default router;