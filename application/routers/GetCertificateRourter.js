const express = require('express');
const { HandleGetCertificate } = require('../controllers/HandleGetCertificate.js');
const getCertificateRouter = express.Router();

getCertificateRouter.post('/', HandleGetCertificate);

module.exports = {getCertificateRouter};
