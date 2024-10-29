import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import licenseRouter from './Routes/License.js';
import deviceRouter from './Routes/Device.js';
import processRouter from './Routes/process.js';
import { DB_CLIENT } from './DBConnector';
import dotenv from 'dotenv';
dotenv.config();

const router = express();
const port : number = 3000;

const server = http.createServer(router);
const wss = new WebSocketServer({ server, path: '/ws' });
let clientCnt : number = 0;
// TODO : DB 컨넥션 관리, 테스트할것.
DB_CLIENT.GetInstance().Check().then(() => {
    DB_CLIENT.GetInstance().Clear();
});

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    clientCnt++;
    const origin = req.headers.origin as string | undefined;
    console.log(`Connection establish: ${origin}`);
    // TODO : 기기 부팅 히스토리 추가
  
    ws.on('message', (message: string) => {
        console.log(`Received: ${message}`);
        ws.send(`Receive success`);
    });
  
    ws.on('close', () => {
        console.log('Disconnect');
        // TODO : 기기 종료 히스토리 추가
        if(clientCnt > 0) clientCnt--;
    });
});
// express 5 변경점 : https://news.hada.io/topic?id=17320
router.get("/",(req:Request, res:Response):void => {
    res.send(`Hello, World! / current User : ${clientCnt}`);
});

router.use("/license", licenseRouter);
router.use("/device", deviceRouter);
router.use("/process", processRouter);


// 서버 시작
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});