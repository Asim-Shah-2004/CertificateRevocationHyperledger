import express from "express";
import { revokeEntry } from "../controllers/index.js";

const certificateRouter = express.Router();

certificateRouter.post("/revoke", revokeEntry);

export default certificateRouter;
