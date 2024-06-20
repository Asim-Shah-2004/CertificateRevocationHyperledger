const express = require('express');
const { HandleAddCertificate, HandleGetCertificate } = require('../controllers/HandleCertificate.js');

const router = express.Router();

router.post('/add', HandleAddCertificate);
router.get('/get', HandleGetCertificate);

module.exports = router;
