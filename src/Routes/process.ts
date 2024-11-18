import { Router } from 'express';
import { CheckProcessType } from '../Util.js';
import { DB_CLIENT } from '../DBConnector.js';
import { SetBlackWhiteList } from '../index.js';
import { logBlackAdded, logWhiteAdded } from '../Services/LogService.js';
import { DeleteProcess, EditProcess, GetProcessList, RegistProcess } from '../Services/ProcessService.js';

const router = Router();

router.get('/', async (req, res) => {
    let result = await GetProcessList();
    if(result == null) res.status(500);
    else res.json(result);
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
router.post("/", async (req, res) => {
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

    let result = await RegistProcess(param);
    if(!result) res.status(500).json({result : false});
    else {
        await SetBlackWhiteList();
        if (param.isBlack === 1) await logBlackAdded(param.device);
        else if (param.isBlack === 0) await logWhiteAdded(param.device);
        res.send(result);
    }
});


/**
 * 블랙/화이트리스트 프로세스 삭제
 */
router.delete("/", async (req,res) => {
    let param = req.body;
    if(param.ProcessName === undefined || param.ProcessName == null){
        res.status(400).send("ProcessName required");
    }
    // ProcessName
    let processName = param.ProcessName;

    let result = await DeleteProcess(processName);
    if(!result) res.status(500).send("Failed to delete process");
    res.send({result : result});

});

/**
 * 블랙/화이트리스트 프로세스 수정
 */
router.put("/", async (req,res) => {
    let param = req.body;
    if(param.processName === undefined || param.processName == null){
        res.status(400).send("ProcessName required");
    }
    let result = await EditProcess(param);
    if(!result) res.status(500).json({result : false});
    res.send({result : result});
});

export default router;