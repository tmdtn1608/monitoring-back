import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB_CLIENT } from "../DBConnector.js"
import { RowDataPacket } from 'mysql2';

const router = Router();

/**
 * 라이센스 및 등록된 기기 조회
 */
router.get('/',async (req : Request, res : Response) : Promise<void> => {
    DB_CLIENT.GetInstance().AsyncQuery("select * from License")
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
 * 라이센스 발급
 */
router.post("/", (req, res) => {
    let licenseNum : string = uuidv4();
    DB_CLIENT.GetInstance()
    .AsyncQuery(`INSERT INTO License (License) VALUES ('${licenseNum}')`)
    .then((result) => {
        let json = { license : "" };
        json.license = licenseNum;
        res.json(json);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

/**
 * 라이센스 삭제
 */
router.delete("/", (req,res) => {
    let param = req.body;
    if (param.license === undefined || param.license === null) {
        res.status(400).send("No license");
    }

    DB_CLIENT.GetInstance()
    .AsyncQuery(`DELETE FROM License WHERE License = '${param.license}'`)
    .then((result) => {
        res.send("Delete finish");
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});

/**
 * 클라이언트로부터 라이센스 & 기기 등록
*/
router.post("/regist", (req,res) => {
    let param = req.body;
    if (param.license === undefined || param.license === null) {
        res.status(400).send("No license");
    }
    if(param.mac === undefined ||param.mac === null) {
        res.status(400).send("No mac address");
    }
    const InsertMacAddr = async (mac: string) : Promise<any> => {
        const res = await DB_CLIENT.GetInstance()
            .AsyncQuery(`INSERT INTO Device (mac) VALUES ('${mac}')`);
        return res;
    };

    DB_CLIENT.GetInstance()
    .AsyncQuery(`UPDATE License SET Device = '${param.mac}' WHERE License = '${param.license}'`)
    .then(() => InsertMacAddr(param.mac))
    .then((result) => {
        res.json({result : true });
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });
    
});

/**
 * 라이센스 유효성 확인
*/
router.post("/check", (req,res) => {
    let param = req.body;
    if (param.license === undefined || param.license === null) {
        res.status(400).send("No license");
    }
    if(param.mac === undefined ||param.mac === null) {
        res.status(400).send("No mac address");
    }
    
    DB_CLIENT.GetInstance()
    .AsyncQuery(` SELECT COUNT(*) as CNT FROM License WHERE License = '${param.license}' AND Device = '${param.mac}'`)
    .then((result) => {
        if(result != null) {
            let cnt = result[0].CNT;
            switch (cnt) {
                case 0:
                    res.json({result : false});
                    break;
                case 1:
                    res.json({result : true});
                    break;
                default:
                    res.status(500);
                    break;
            }
        }
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500);
    });
});
export default router;