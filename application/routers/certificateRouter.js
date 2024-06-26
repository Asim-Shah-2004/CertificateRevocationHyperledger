import express from "express";
import { HandleAddCertificate, HandleGetCertificate } from "../controllers/HandleCertificate.js";

const router = express.Router();

router.post("/add", HandleAddCertificate);
router.post("/get", HandleGetCertificate);

export default router;
