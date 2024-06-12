/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
    async addNumbers(ctx ,num1, num2) {
        console.log("called");
        const result = parseInt(num1) + parseInt(num2);
        return result.toString();
    }
}

module.exports = AssetTransfer;
