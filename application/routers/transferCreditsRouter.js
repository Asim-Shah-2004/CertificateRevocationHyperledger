import express from 'express'
import { transferCredits } from '../controllers/index.js'

const transferRouter = express.Router();

transferRouter.post("/credits", transferCredits);

export default transferRouter;