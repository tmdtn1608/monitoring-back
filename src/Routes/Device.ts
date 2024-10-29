import { Router } from 'express';

const router = Router();

/**
 * 기기조회
 */
router.get('/',(req,res) => {
    res.send('device get');
});

/**
 * 등록된 기기 & 라이센스 삭제
 */
router.delete("/", (req,res) => {
    res.send("device delete");
});

/**
 * 기기정보 수정(별명, 메모 등)
 */
router.put("/", (req,res) => {
    res.send("device edit")
});

export default router;