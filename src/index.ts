import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { RowDataPacket } from 'mysql2';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/monitoring-back/.env' });
import licenseRouter from './Routes/License.js';
import deviceRouter from './Routes/Device.js';
import processRouter from './Routes/Process.js';
import historyRouter from './Routes/History.js';
import processLogRouter from './Routes/ProcessLog.js';
import { DB_CLIENT } from "./DBConnector.js"
import { ConstInit } from './Const.js';
import { logProcKill } from './Services/LogService.js';
import { GetAutoBlack, GetProcessList } from './Services/ProcessService.js';

ConstInit();
const app = express();
app.use(express.json());
const port : number = Number(process.env.API_PORT) | 5000;
export let blackWhiteList : RowDataPacket[] | null = null;

app.use(
    cors({
      origin: 'http://localhost:3000', // 프론트엔드 URL을 origin으로 지정
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // 필요한 HTTP 메서드만 허용
      credentials: true, // 쿠키를 포함한 요청을 허용
    })
);

app.use((req: Request, res: Response, next) => {
    console.log(`Requested Method: ${req.method}, URL: ${req.originalUrl}`);
    res.setHeader("Content-Type", "application/json");
    next();
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
type Dict = Record<string, WebSocket>;
export const clients : Dict = {};
DB_CLIENT.GetInstance().Check().then(() => {
    console.log("DB Connection OK");
})
.catch((error) =>{
    console.error(error);
    // process.exit();
});

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const origin = req.headers.origin as string | undefined;
    console.log(`Connection established.`);
  
    ws.on('message', (message: string) => {
        let parsedMsg = JSON.parse(message);
        console.log(`Receive success : ${parsedMsg.from}`);
        // 클라이언트에서 전송
        if(parsedMsg.from != "web") {
            if(clients[parsedMsg.from] === null 
                || clients[parsedMsg.from] === undefined){
                clients[parsedMsg.from] = ws;
            }
        }
        // 웹에서 전송
        else {
            if(clients[parsedMsg.device] !== null 
                && clients[parsedMsg.device] !== undefined) {
                let target = clients[parsedMsg.device];
                target.send(parsedMsg.process);
                logProcKill(parsedMsg.device);
            }
             
        }
    });
  
    ws.on('close', () => {
        let temp = '';
        for (const key in clients) {
            if (clients.hasOwnProperty(key)) {
                if(clients[key] === ws) {
                    temp = key;
                    break;
                }
            }
        }
        delete clients[temp];

        console.log('Disconnect');
    });
});
// express 5 변경점 : https://news.hada.io/topic?id=17320
app.get("/", async (req:Request, res:Response): Promise<void> => {
    res.send(`Hello, World! / current User : ${clients.size}`);
});

app.use("/license", licenseRouter);
app.use("/device", deviceRouter);
app.use("/process", processRouter);
app.use("/history", historyRouter);
app.use("/log", processLogRouter);

// 서버 시작
server.listen(port, async() => {
    console.log(`Server is running on http://localhost:${port}`);
    await SetBlackWhiteList();
});

export const SetBlackWhiteList = async () => {
    // let result : RowDataPacket[] | null = null;
    // GetAutoBlack()
    // .then((res) => {
    //     result = res;
    // }).catch((err) => {
    //     console.error(err)
    //     return null;
    // });
    blackWhiteList = await GetAutoBlack();
}