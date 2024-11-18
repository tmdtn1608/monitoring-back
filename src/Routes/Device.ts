import { Router } from 'express';
import { GetDevice, ResetDevice, UpdateDevice } from '../Services/DeviceService.js';
import { ResetLicense } from '../Services/LicenseService.js';

const router = Router();

/**
 * 기기조회
 */
router.get('/', async (req,res) => {
    let result = await GetDevice();
    
    if(result == null) res.status(500);
    else res.json(result);
});

/**
 * 등록된 기기 & 라이센스 삭제
 */
router.delete("/", async (req,res) => {
    let param = req.body;
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }

    let resetResult = await ResetLicense(param.mac);
    if(!resetResult) res.status(500).send("Failed reset license");
    
    resetResult = await ResetDevice(param.mac);
    if(!resetResult) res.status(500).send("Failed reset device");

    res.send(resetResult);
});

/**
 * 기기정보 수정(별명, 메모 등) -> Backlog
 */
router.put("/", async (req,res) => {
    let param = req.body;
    console.log(`param chk : ${JSON.stringify(param)}`);
    if (param.mac === undefined || param.mac === null) {
        res.status(400).send("No device");
    }
    if (param.nick === undefined || param.nick === null) {
        res.status(400).send("No nick");
    }
    if (param.isUsed === undefined || param.isUsed === null) {
        res.status(400).send("No isUsed");
    }
    let isUsed = param.isUsed === true ? 1 : 0;

    let result = await UpdateDevice(param.nick, isUsed, param.mac);

    if(!result) res.status(500).send("Failed to update device");
    res.send(result);
});

export default router;