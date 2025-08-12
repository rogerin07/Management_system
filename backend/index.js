import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  connectDb();
  console.log("servidor esta rodando na porta 3000");
});
