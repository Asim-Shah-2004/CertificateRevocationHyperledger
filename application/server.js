import express from "express";
import { connectToHyperledger } from "./services/index.js";
import testRouter from "./routers/testRouter.js";
import IPFSrouter from "./routers/ipfsRouter.js";
import HyperledgerRouter from "./routers/hyperledgerRouter.js";
const app = express();
const port = process.env.PORT || 3000;

connectToHyperledger();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/IPFS",IPFSrouter)
app.use("/test", testRouter);
app.use("/hyperledger",HyperledgerRouter)
app.get("/", (req, res) => {
  res.send("Hello from IPFS and Hyperledger!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
