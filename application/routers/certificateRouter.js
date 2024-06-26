import express from "express";
import { HandleAddCertificate, HandleGetCertificate } from "../controllers/handleCertificate.js";

const certificateRouter = express.Router();

certificateRouter.post("/add", HandleAddCertificate);
certificateRouter.post("/get", HandleGetCertificate);

export default certificateRouter;
