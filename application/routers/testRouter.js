import express from "express";
import { test } from "../controllers/ipfsTest.js";

const router = express.Router();

// Define the test route
router.get("/", test);

export default router;
