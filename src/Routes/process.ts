/*
1. /process/black/, /process/white/
2. C→POST, R→GET, U→PUT, D→DELETE
*/

import { Router } from 'express';
import { CheckProcessType } from '../Util.js';

const router = Router();

router.get('/:type',(req , res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) res.send("param not exist");
    if(!CheckProcessType(processType)) res.send("wrong param");
    
    res.send(`process get, ${processType}`);
});

router.post("/:type", (req, res) => {
    const processType = req.params.type;
    res.send(`process post, ${processType}`);
});

router.delete("/:type", (req,res) => {
    const processType = req.params.type;
    res.send(`process delete, ${processType}`);
});

router.put("/:type", (req,res) => {
    const processType = req.params.type;
    res.send(`process put, ${processType}`);
});

export default router;