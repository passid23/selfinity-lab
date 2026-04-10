import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from "mongoose";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('express läuft');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});