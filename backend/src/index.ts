import { Express, Request, Response } from "express";
import sql from "../db/db"
import express = require('express');
import dotenv = require('dotenv');

dotenv.config({ path: "../.env" });

const app: Express = express();
console.log(process.env)
const port = process.env.PORT ?? 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
    sql.connect()
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});