import express from "express";
import { getIPFSEntry, updateIPFSEntry } from "../controllers/index.js";

const ipfsRouter = express.Router();

ipfsRouter.post("/get", getIPFSEntry);
ipfsRouter.post("/update", updateIPFSEntry);

export default ipfsRouter;
