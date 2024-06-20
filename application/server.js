const express = require('express');
const bodyParser = require('body-parser');
const CertificateRouter = require('./routers/CertificateRouter.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/ipfs', CertificateRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
