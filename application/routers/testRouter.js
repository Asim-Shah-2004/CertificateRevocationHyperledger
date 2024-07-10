import express from "express";
import { test,test2 } from "../controllers/ipfsTest.js";

const testRouter = express.Router();

testRouter.get("/1", test);
testRouter.get("/2", test2);

export default testRouter;
