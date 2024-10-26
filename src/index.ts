import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port : number = 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const origin = req.headers.origin as string | undefined;
    console.log(`Connection establish: ${origin}`);
  
    ws.on('message', (message: string) => {
        console.log(`Received: ${message}`);
        ws.send(`Receive success`);
    });
  
    ws.on('close', () => {
        console.log('Disconnect');
    });
});

// express 5 변경점 : https://news.hada.io/topic?id=17320
app.get("/",(req:Request, res:Response):void => {
    res.send(`Create new uuid : ${uuidv4()}`);
});

// 서버 시작
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});