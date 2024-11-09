import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import licenseRouter from './Routes/License.js';
import deviceRouter from './Routes/Device.js';
import processRouter from './Routes/process.js';
import historyRouter from './Routes/History.js';
import { DB_CLIENT } from "./DBConnector.js"
import { ConstInit,HistoryType } from './Const.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
const port : number = 5000;

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
const clients = new Set<WebSocket>();
ConstInit();
DB_CLIENT.GetInstance().Check().then(() => {
    console.log("DB Connection OK");
});

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    clients.add(ws);
    const origin = req.headers.origin as string | undefined;
    console.log(`Connection establish: ${origin}`);
  
    ws.on('message', (message: string) => {
        console.log(`Received: ${message}`);
        ws.send(`Receive success`);

        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });
  
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Disconnect');
    });
});
// express 5 변경점 : https://news.hada.io/topic?id=17320
app.get("/", async (req:Request, res:Response): Promise<void> => {
    // DB_CLIENT.GetInstance().AsyncQuery("select * from License")
    // .then((result) => {
    //     const jsonResult = JSON.stringify(result);
    //     res.json(result);
    // })
    // .catch((error) => {
    //     console.error('Error fetching process list:', error);
    //     res.status(500);
    // });
    res.send(`Hello, World! / current User : ${clients.size}`);
});

app.use("/license", licenseRouter);
app.use("/device", deviceRouter);
app.use("/process", processRouter);
app.use("/history", historyRouter);

// 서버 시작
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});