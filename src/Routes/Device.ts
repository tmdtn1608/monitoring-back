
/**
1. 기기 R 조회, /Device, GET
2. 기기 D 삭제, /Device, DELETE
 */
import { Router } from 'express';

const router = Router();

router.get('/',(req,res) => {
    res.send('device get');
});

router.delete("/", (req,res) => {
    res.send("device delete");
});

export default router;