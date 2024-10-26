import { Router } from 'express';

const router = Router();

router.get('/',(req,res) => {
    res.send('licesne get');
});

router.post("/", (req, res) => {
    res.send('license post');
});

router.delete("/", (req,res) => {
    res.send("license delete");
});

router.post("/regist", (req,res) => {
    res.send("license regist post");
});

export default router;