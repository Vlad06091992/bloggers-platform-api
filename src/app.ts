import express, {Request, Response} from "express";
import bodyParser from "body-parser";
export const app = express()

app.use(bodyParser())