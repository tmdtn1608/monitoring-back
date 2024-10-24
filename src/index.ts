import express, { Request, Response } from 'express';

const app = express();
const port : number = 3000;
console.log("Hello, world");
// express 5 변경점 : https://news.hada.io/topic?id=17320
app.get("/",(req:Request, res:Response):void => {
    res.send('Hello, world!');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});