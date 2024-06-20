const express = require('express');
const bodyParser = require('body-parser');
const CertificateRouter = require('./routers/CertificateRouter.js');
const connectToHyperledger = require('./services/hyperledgerNetworkService.js')
const testRouter = require('./routers/testRouter.js')
const app = express();

connectToHyperledger()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/ipfs', CertificateRouter);
app.use('/test',testRouter)
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
