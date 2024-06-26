import express from "express";
import { getUserData } from "../controllers/index.js";

const publicRouter = express.Router();

publicRouter.post("/get", getUserData);

export default publicRouter;
