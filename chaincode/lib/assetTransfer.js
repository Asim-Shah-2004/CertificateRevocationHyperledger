"use strict";
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class AssetTransfer extends Contract {
  async addBlock(ctx, abcID, hash) {
    const block = { abcID, hash };

    await ctx.stub.putState(abcID, Buffer.from(stringify(sortKeysRecursive(block))));
    return JSON.stringify(block);
  }

  async getBlock(ctx, abcID) {
    const blockJSON = await ctx.stub.getState(abcID);
    if (!blockJSON || blockJSON.length === 0) return `The block ${abcID} does not exist`;

    return blockJSON.toString();
  }

  async updateBlock(ctx, abcID, hash) {
    const blockJSON = await ctx.stub.getState(abcID);
    if (!blockJSON || blockJSON.length === 0) return `The block ${abcID} does not exist`;
    const block = JSON.parse(blockJSON.toString());
    block.hash = hash;

    await ctx.stub.putState(abcID, Buffer.from(JSON.stringify(block)));
    return JSON.stringify(block);
  }
}

module.exports = AssetTransfer;
