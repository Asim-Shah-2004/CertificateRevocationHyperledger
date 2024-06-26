import express from "express";
import updateIPFS from "../controllers/ipfsControllers/updateController.js";

const ipfsRouter = express.Router();

ipfsRouter.post("/update", updateIPFS);

export default ipfsRouter;
