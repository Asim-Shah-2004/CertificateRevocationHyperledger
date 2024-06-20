const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const testRouter = require('./routers/testRouter.js');
const {addCertificateRouter} = require('./routers/AddCertificateRourter.js')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.use('/test', testRouter);
app.use('/add',addCertificateRouter)
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
