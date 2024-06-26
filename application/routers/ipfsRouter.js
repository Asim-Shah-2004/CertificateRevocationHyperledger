import express from "express";
import updateIPFS from "../controllers/ipfsControllers/updateController.js";
const IPFSrouter = express.Router()
IPFSrouter.post('/update',updateIPFS)

export default IPFSrouter
