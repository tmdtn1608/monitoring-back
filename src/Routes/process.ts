import { Router } from 'express';
import { CheckProcessType } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';

const router = Router();

router.get('/', (req, res) => {
    DB_CLIENT.GetInstance()
    .AsyncQuery(`select * from ProcessList`)
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
 * 블랙/화이트리스트 프로세스 조회
 * /black, /white
 */
router.get('/:type',(req , res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) 
        res.status(400).send("param not exist");
    if(!CheckProcessType(processType)) res.status(400).send("wrong param");

    let IsBlack = processType == "Black" ? 1 : 0;
    
    DB_CLIENT.GetInstance()
    .AsyncQuery(`select * from ProcessList WHERE IsBlack = ${IsBlack}`)
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
 * 블랙/화이트리스트 프로세스 등록
 */
router.post("/:type", (req, res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) 
        res.status(400).send("param not exist");
    if(!CheckProcessType(processType)) res.status(400).send("wrong param");

    let IsBlack = processType == "Black" ? 1 : 0;

    res.send(`process post, ${processType}`);
});

/**
 * 블랙/화이트리스트 프로세스 삭제
 */
router.delete("/:type", (req,res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) 
        res.status(400).send("param not exist");
    if(!CheckProcessType(processType)) res.status(400).send("wrong param");

    let IsBlack = processType == "Black" ? 1 : 0;

    res.send(`process delete, ${processType}`);
});

/**
 * 블랙/화이트리스트 프로세스 수정
 */
router.put("/:type", (req,res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) 
        res.status(400).send("param not exist");
    if(!CheckProcessType(processType)) res.status(400).send("wrong param");

    let IsBlack = processType == "Black" ? 1 : 0;
    
    res.send(`process put, ${processType}`);
});

export default router;