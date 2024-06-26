import express from "express";
import { createIPFSEntry } from "../controllers/index.js";

const hyperledgerRouter = express.Router();

hyperledgerRouter.post("/create", createIPFSEntry);

export default hyperledgerRouter;
