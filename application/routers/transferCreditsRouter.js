import express from 'express'
import { transferCredits } from '../controllers/index.js'

const transfer = express.Router();

transfer.post("/credits", transferCredits);

export default transfer;