import express from "express";
import { HandleAddCertificate, HandleGetCertificate } from "../controllers/handleCertificate.js";

const router = express.Router();

router.post("/add", HandleAddCertificate);
router.post("/get", HandleGetCertificate);

export default router;
