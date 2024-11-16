import { Router } from 'express';
import { CheckProcessType, StringBuilder } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';
import { SetBlackWhiteList } from '../index.js';

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
router.post("/", (req, res) => {
    let param = req.body;
    console.log(JSON.stringify(param));
    // processName
    if(param.processName === undefined || param.processName == null){
        res.status(400).send("ProcessName required");
    }
    // device
    if(param.device === undefined || param.device == null){
        res.status(400).send("device required");
    }
    // IsBlack
    if(param.isBlack === undefined || param.isBlack == null){
        res.status(400).send("IsBlack required");
    }
    // IsAuto
    if(param.isAuto === undefined || param.isAuto == null){
        res.status(400).send("IsAuto required");
    }
    // Memo
    if(param.memo === undefined || param.memo == null){
        res.status(400).send("Memo required");
    }

    let qb = new StringBuilder();
    qb.append('INSERT INTO ProcessLIST (ProcessName, Device, IsBlack, IsAuto, MEMO) VALUES ')
    .append(`('${param.processName}','${param.device}',${param.isBlack},${param.isAuto},'${param.memo}')`);


    DB_CLIENT.GetInstance()
    .AsyncQuery(qb.toString())
    .then((result) => {
        console.log('process add complete');
        SetBlackWhiteList();
        res.send(result);
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });
    // TODO : global blackWhiteList 갱신
});


/**
 * 블랙/화이트리스트 프로세스 삭제
 */
router.delete("/", (req,res) => {
    let param = req.body;
    if(param.ProcessName === undefined || param.ProcessName == null){
        res.status(400).send("ProcessName required");
    }
    // ProcessName
    let processName = param.ProcessName;

    DB_CLIENT.GetInstance()
    .AsyncQuery(`DELETE FROM ProcessList WHERE ProcessName ='${processName}'`)
    .then((result) => {
        res.json({result : true });
    })
    .catch((error) => {
        console.error('Error fetching process list:', error);
        res.status(500).json({result : false});
    });
});

/**
 * 블랙/화이트리스트 프로세스 수정
 */
router.put("/", (req,res) => {
    let param = req.body;
    console.log(JSON.stringify(param));
    if(param.processName === undefined || param.processName == null){
        res.status(400).send("ProcessName required");
    }
    // ProcessName
    let processName = param.processName;
    // Device
    let Device = param.device === undefined ? null : param.device;
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
        queryArr.push(`Device = '${Device}'`);
    }
    if(IsBlack != null) {
        queryArr.push(`IsBlack = ${IsBlack}`);
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