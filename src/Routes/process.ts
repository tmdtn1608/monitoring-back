import { Router } from 'express';
import { CheckProcessType } from '../Util.js';

const router = Router();

/**
 * 블랙/화이트리스트 프로세스 조회
 */
router.get('/:type',(req , res) => {
    const processType = req.params.type;
    if(processType == null || processType == undefined) res.send("param not exist");
    if(!CheckProcessType(processType)) res.send("wrong param");
    
    res.send(`process get, ${processType}`);
});

/**
 * 블랙/화이트리스트 프로세스 등록
 */
router.post("/:type", (req, res) => {
    const processType = req.params.type;
    res.send(`process post, ${processType}`);
});

/**
 * 블랙/화이트리스트 프로세스 삭제
 */
router.delete("/:type", (req,res) => {
    const processType = req.params.type;
    res.send(`process delete, ${processType}`);
});

/**
 * 블랙/화이트리스트 프로세스 수정
 */
router.put("/:type", (req,res) => {
    const processType = req.params.type;
    res.send(`process put, ${processType}`);
});

export default router;