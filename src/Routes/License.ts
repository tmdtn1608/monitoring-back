import { Router, Request, Response } from 'express';
import { CheckLicense, CheckUsedLicense, CreateLicense, DeleteLicense, GetLicense, SetLicense } from '../Services/LicenseService.js';
import { RegistDevice } from '../Services/DeviceService.js';

const router = Router();

/**
 * 라이센스 및 등록된 기기 조회
 */
router.get('/', async (req : Request, res : Response) : Promise<void> => {
    let result = await GetLicense();
    if(result == null) res.status(500);
    else res.json(result);
});

/**
 * 라이센스 발급
 */
router.post("/", async (req, res) => {
    let newLicense = await CreateLicense();
    if(newLicense == null) res.status(500).send("Failed to create license");
    else {
        let json = { license : "" };
        json.license = newLicense;
        res.json(json);
    }
});

/**
 * 라이센스 삭제
 */
router.delete("/", async (req,res) => {
    let param = req.body;
    if (param.license === undefined || param.license === null) {
        res.status(400).send("No license");
    }
    let result = await DeleteLicense(param.license);

    if(!result) res.status(500).send("Failed to delete license");
    else res.send(result);
});

/**
 * 클라이언트로부터 라이센스 & 기기 등록
*/
router.post("/regist", async (req,res) => {
    let param = req.body;
    if (param.license === undefined || param.license === null) {
        res.status(400).send("No license");
    }
    if(param.mac === undefined ||param.mac === null) {
        res.status(400).send("No mac address");
    }
    let result = await RegistDevice(param.mac);
    if(!result) res.status(500).send("Failed to regist device");
    
    result = await SetLicense(param.mac, param.license);
    if(!result) res.status(500).send("Failed to set license");
    else res.json({"result" : result});
    
});

/**
 * 라이센스 유효성 확인
*/
router.post("/check", async (req,res) => {

    try {
        let param = req.body;
        if (param.license === undefined || param.license === null) {
            res.status(400).send("No license");
        }
        if(param.mac === undefined ||param.mac === null) {
            res.status(400).send("No mac address");
        }
        // let isAvailable = await CheckUsedLicense(param.license);
        // if(isAvailable) {
        // }
        // else throw new Error("Already used license");
        
        let result = await CheckLicense(param.license, param.mac);
        res.json({"result" : result});
    } catch (error) {
        res.status(500).send("Failed to check license");
    }
});
export default router;