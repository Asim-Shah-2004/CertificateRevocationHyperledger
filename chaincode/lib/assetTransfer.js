'use strict';
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async createEntry(ctx, id, name, collegeName) {
        const exists = await this.entryExists(ctx, id);
        if (exists) {
            return `The entry ${id} already exists`;
        }

        const entry = {
            id,
            name,
            collegeName,
            validity: null,
            certificateHash: null,
            expirationTime: null,
        };

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(entry))));
        return JSON.stringify(entry);
    }

    async findEntry(ctx, id) {
        const entryJSON = await ctx.stub.getState(id); 
        if (!entryJSON || entryJSON.length === 0) {
            return `The entry ${id} does not exist`;
        }

        const entry = JSON.parse(entryJSON.toString());

        if (entry.validity && Date.now() > entry.expirationTime) {
            entry.validity = false;
            await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(entry))));
        }

        return JSON.stringify(entry);
    }

    async issueCertificate(ctx, id, certificateHash, validityPeriod) {
        const entryJSON = await ctx.stub.getState(id);
        if (!entryJSON || entryJSON.length === 0) {
            throw new Error(`The entry ${id} does not exist`);
        }

        const entry = JSON.parse(entryJSON.toString());
        entry.certificateHash = certificateHash;
        entry.validity = true;
        entry.expirationTime = Date.now() + validityPeriod * 60000;

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(entry))));
        return JSON.stringify(entry);
    }

    async entryExists(ctx, id) {
        const entryJSON = await ctx.stub.getState(id);
        return entryJSON && entryJSON.length > 0;
    }

    async addBlock(ctx, abcid, hash) {
        const block = {
            abcid,
            hash,
        };

        await ctx.stub.putState(abcid, Buffer.from(stringify(sortKeysRecursive(block))));
        return JSON.stringify(block);
    }

    async getBlock(ctx, abcid) {
        const blockJSON = await ctx.stub.getState(abcid);
        if (!blockJSON || blockJSON.length === 0) {
            return `The block ${abcid} does not exist`;
        }

        return blockJSON.toString();
    }
}

module.exports = AssetTransfer;
