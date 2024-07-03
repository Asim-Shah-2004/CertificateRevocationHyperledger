import express from "express";
import { connectToHyperledger } from "./services/index.js";
import { hyperledgerRouter, ipfsRouter, publicRouter, testRouter, transferRouter, certificateRouter } from "./routers/index.js";
import {checkAuthority} from './middlewares/index.js'

const app = express();
const port = process.env.PORT || 3000;

connectToHyperledger();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const checkOrg1Access = (req, res, next) => {
  const { org } = req.headers;
  if (org === "Org1") {
    next();
  } else {
    res.status(403).send({ message: "Access denied" });
  }
};

const checkOrg2Access = (req, res, next) => {
  const { org } = req.headers;
  if (org === "Org2") {
    next();
  } else {
    res.status(403).send({ message: "Access denied" });
  }
};

app.use("/ipfs", checkOrg1Access, checkAuthority, ipfsRouter);
app.use("/hyperledger", checkOrg1Access, checkAuthority, hyperledgerRouter);
app.use("/public", checkOrg1Access, checkAuthority, publicRouter);
app.use("/transfer", checkOrg1Access, checkAuthority, transferRouter);
app.use("/certificate", checkOrg1Access, checkAuthority, certificateRouter);

app.use("/test", checkOrg2Access, checkAuthority, testRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
