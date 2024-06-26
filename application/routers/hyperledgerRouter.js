import express from "express";
import createEntry from "../controllers/hyperledgerControllers/createController.js";
const HyperledgerRouter = express.Router()
HyperledgerRouter.post('/create',createEntry)
export default HyperledgerRouter

