import express from "express";
import createEntry from "../controllers/hyperledgerControllers/createController.js";

const hyperledgerRouter = express.Router();

hyperledgerRouter.post("/create", createEntry);

export default hyperledgerRouter;
