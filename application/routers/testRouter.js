const express = require('express');
const { test } = require('../controllers/ipfsTest.js');

const testRouter = express.Router();  

testRouter.post('/', test);

module.exports = testRouter;  
