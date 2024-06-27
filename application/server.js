import express from "express";
import { connectToHyperledger } from "./services/index.js";
import { hyperledgerRouter, ipfsRouter, publicRouter, testRouter ,transfer } from "./routers/index.js";

const app = express();
const port = process.env.PORT || 3000;

connectToHyperledger();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/ipfs", ipfsRouter);
app.use("/hyperledger", hyperledgerRouter);
app.use("/public", publicRouter);
app.use("/test", testRouter);
app.use("/transfer",transfer);
app.get("/", (req, res) => {
  res.send("Hello from IPFS and Hyperledger!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
