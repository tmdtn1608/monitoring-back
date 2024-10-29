import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * 라이센스 및 등록된 기기 조회
 */
router.get('/',(req,res) => {
    res.send('licesne get');
});

/**
 * 라이센스 발급
 */
router.post("/", (req, res) => {
    res.send(`Create new uuid : ${uuidv4()}`);
    res.send('license post');
});

/**
 * 라이센스 삭제
 */
router.delete("/", (req,res) => {
    res.send("license delete");
});

/**
 * 클라이언트로부터 라이센스 & 기기 등록
 */
router.post("/regist", (req,res) => {
    res.send("license regist post");
});

export default router;