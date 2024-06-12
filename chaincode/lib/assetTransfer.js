'use strict';
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {


    //start writing your contract functions from here

    async addNumbers(ctx ,num1, num2) {
        console.log("called");
        const result = parseInt(num1) + parseInt(num2);
        return result.toString();
    }
}

module.exports = AssetTransfer;
