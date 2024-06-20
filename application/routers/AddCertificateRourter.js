const express = require('express');
const { HanldeAddCertificate } = require('../controllers/HandleAddCertificate.js');
const addCertificateRouter = express.Router();

addCertificateRouter.post('/', HanldeAddCertificate);

module.exports = {addCertificateRouter};
