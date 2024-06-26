import express from "express";
import { test } from "../controllers/ipfsTest.js";

const testRouter = express.Router();

testRouter.get("/", test);

export default testRouter;
