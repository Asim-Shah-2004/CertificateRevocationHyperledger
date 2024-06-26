import express from "express";
import CertificateRouter from "./routers/CertificateRouter.js";
import connectToHyperledger from "./services/hyperledgerNetworkService.js";
import testRouter from "./routers/testRouter.js";

const app = express();
const port = process.env.PORT || 3000;

connectToHyperledger();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/ipfs", CertificateRouter);
app.use("/test", testRouter);

app.get("/", (req, res) => {
  res.send("Hello from IPFS and Hyperledger!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
