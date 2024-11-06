import { Router } from 'express';
import { CheckProcessType, StringBuilder } from '../Util.js';
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
router.put("/", (req,res) => {
    // const processType = req.params.type;
    // if(processType == null || processType == undefined) 
    //     res.status(400).send("param not exist");
    // if(!CheckProcessType(processType)) res.status(400).send("wrong param");

    let param = req.body;
    if(param.ProcessName === undefined || param.ProcessName == null){
        res.status(400).send("ProcessName required");
    }
    // ProcessName
    let processName = param.ProcessName;

    // IsBlack
    let IsBlack = param.IsBlack === undefined ? null : param.IsBlack;
    // IsAuto
    let IsAuto = param.IsAuto === undefined ? null : param.IsAuto;
    // Memo
    let Memo = param.Memo === undefined ? null : param.Memo;

    if(IsBlack == null &&
        IsAuto == null &&
        Memo == null
    ) {
        res.status(400).send("Nothing changed");
    }

    let queryBuilder = new StringBuilder();
    queryBuilder.append("UPDATE ProcessList SET ");
    
    let queryArr : string[] = [];
    const separator: string = ", ";
    if(IsBlack != null) {
        queryArr.push(`IsBlack = ${IsBlack}`)
    }

    if(IsAuto != null) {
        queryArr.push(`IsAuto = ${IsAuto}`);
    }

    if(Memo != null) {
        queryArr.push(`Memo = '${Memo}'`);
    }
    let changedQuery = queryArr.join(separator);

    queryBuilder.append(changedQuery);
    queryBuilder.append(` WHERE ProcessName = '${processName}'`);

    DB_CLIENT.GetInstance()
    .AsyncQuery(queryBuilder.toString())
    .then((result) => {
        res.json({result : true });
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });

    // res.send(queryBuilder.toString());
});

export default router;